import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import JSZip from 'jszip';
import { getAllData, restoreFromData } from '../database/db';

// 암호화용 고정 키 (32바이트)
const SECRET_KEY = Utf8.parse('today-piece-secure-key-32chars!!');

// 사진 저장용 앱 전용 디렉토리
const PHOTOS_DIR = `${FileSystem.documentDirectory}diary_photos/`;

/**
 * 📁 사진 디렉토리 보장
 */
async function ensurePhotosDir() {
    const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
}

/**
 * 🔐 JSON 문자열을 AES 암호화
 */
function encryptData(jsonString) {
    return AES.encrypt(jsonString, SECRET_KEY, {
        mode: ECB,
        padding: Pkcs7
    }).toString();
}

/**
 * 🔓 AES 암호화된 문자열을 복호화
 */
function decryptData(encryptedString) {
    const bytes = AES.decrypt(encryptedString, SECRET_KEY, {
        mode: ECB,
        padding: Pkcs7
    });
    const result = bytes.toString(Utf8);
    if (!result) {
        throw new Error('복호화 실패: 올바른 백업 파일이 아니거나 비밀번호가 틀립니다.');
    }
    return result;
}

/**
 * 📷 diary 데이터에서 모든 사진 URI를 추출합니다.
 * 페이지 기능 적용: photos 컬럼은 2차원 배열 [[{id, uri, ...}], [{...}]] 또는 1차원 배열
 */
function extractAllPhotoUris(diaries) {
    const uris = [];
    for (const diary of diaries) {
        if (!diary.photos || diary.photos === '[]') continue;
        try {
            const parsed = JSON.parse(diary.photos);
            // 2차원 배열 (멀티 페이지) 또는 1차원 배열 (레거시) 처리
            if (Array.isArray(parsed)) {
                for (const item of parsed) {
                    if (Array.isArray(item)) {
                        // 2차원: 페이지별 사진 배열
                        for (const photo of item) {
                            if (photo && photo.uri) {
                                uris.push(photo.uri);
                            }
                        }
                    } else if (item && item.uri) {
                        // 1차원: 단일 페이지 레거시
                        uris.push(item.uri);
                    }
                }
            }
        } catch (e) {
            console.warn('[Backup] Failed to parse photos for diary:', diary.date, e);
        }
    }
    return uris;
}

/**
 * 📷 diary 데이터의 사진 URI를 상대 경로로 변환합니다. (ZIP 내부 경로)
 */
function remapPhotoUrisToRelative(diaries, uriToFilenameMap) {
    return diaries.map(diary => {
        if (!diary.photos || diary.photos === '[]') return diary;
        try {
            const parsed = JSON.parse(diary.photos);
            const remapped = remapPhotosRecursive(parsed, uriToFilenameMap);
            return { ...diary, photos: JSON.stringify(remapped) };
        } catch (e) {
            return diary;
        }
    });
}

function remapPhotosRecursive(arr, uriToFilenameMap) {
    if (!Array.isArray(arr)) return arr;
    return arr.map(item => {
        if (Array.isArray(item)) {
            return remapPhotosRecursive(item, uriToFilenameMap);
        }
        if (item && item.uri && uriToFilenameMap[item.uri]) {
            return { ...item, uri: `images/${uriToFilenameMap[item.uri]}` };
        }
        return item;
    });
}

/**
 * 📷 복원 시 상대 경로를 실제 로컬 경로로 되돌립니다.
 */
function remapPhotoUrisToLocal(diaries) {
    return diaries.map(diary => {
        if (!diary.photos || diary.photos === '[]') return diary;
        try {
            const parsed = JSON.parse(diary.photos);
            const remapped = remapPhotosToLocalRecursive(parsed);
            return { ...diary, photos: JSON.stringify(remapped) };
        } catch (e) {
            return diary;
        }
    });
}

function remapPhotosToLocalRecursive(arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.map(item => {
        if (Array.isArray(item)) {
            return remapPhotosToLocalRecursive(item);
        }
        if (item && item.uri && item.uri.startsWith('images/')) {
            const filename = item.uri.replace('images/', '');
            return { ...item, uri: `${PHOTOS_DIR}${filename}` };
        }
        return item;
    });
}

/**
 * 📤 ZIP 파일로 전체 백업을 생성하고 공유합니다.
 * - data.json: AES 암호화된 DB 데이터
 * - images/: 일기에 첨부된 사진 파일들
 */
export async function exportToShareSheet() {
    try {
        const data = await getAllData();
        const diaries = data.tables.diary || [];

        // 1. 사진 URI 수집 및 파일명 매핑
        const photoUris = extractAllPhotoUris(diaries);
        const uriToFilenameMap = {};
        let photoIndex = 0;

        const zip = new JSZip();

        for (const uri of photoUris) {
            if (uriToFilenameMap[uri]) continue; // 중복 방지

            try {
                const fileInfo = await FileSystem.getInfoAsync(uri);
                if (!fileInfo.exists) {
                    console.warn('[Backup] Photo file not found, skipping:', uri);
                    continue;
                }

                // 파일 확장자 추출
                const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
                const filename = `photo_${photoIndex}.${ext}`;
                uriToFilenameMap[uri] = filename;
                photoIndex++;

                // base64로 읽어서 ZIP에 추가
                const base64Data = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                zip.file(`images/${filename}`, base64Data, { base64: true });
            } catch (e) {
                console.warn('[Backup] Failed to read photo:', uri, e);
            }
        }

        // 2. diary의 사진 URI를 상대경로로 변환
        const remappedDiaries = remapPhotoUrisToRelative(diaries, uriToFilenameMap);
        const exportData = {
            ...data,
            tables: {
                ...data.tables,
                diary: remappedDiaries
            }
        };

        // 3. JSON → 암호화 → ZIP에 추가
        const jsonString = JSON.stringify(exportData, null, 2);
        const encrypted = encryptData(jsonString);
        zip.file('data.json', encrypted);

        // 4. ZIP 생성 (base64)
        const zipBase64 = await zip.generateAsync({ type: 'base64' });

        // 5. 임시 파일로 저장
        const today = new Date().toISOString().split('T')[0];
        const zipUri = `${FileSystem.documentDirectory}today_piece_backup_${today}.zip`;
        await FileSystem.writeAsStringAsync(zipUri, zipBase64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // 6. 공유 시트 띄우기
        if (await Sharing.isAvailableAsync()) {
            const result = await Sharing.shareAsync(zipUri, {
                mimeType: 'application/zip',
                dialogTitle: '백업 파일 내보내기',
                UTI: 'com.pkware.zip-archive'
            });

            if (result && result.action === 'dismissedAction') {
                return false;
            }
            return true;
        } else {
            throw new Error('공유 기능을 사용할 수 없는 기기입니다.');
        }
    } catch (error) {
        console.error('[Backup Error]:', error);
        throw error;
    }
}

/**
 * 📥 ZIP 파일에서 데이터를 읽어와 DB 및 사진을 복구합니다.
 */
export async function importFromFile() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            return false;
        }

        const pickedFile = result.assets[0];
        const fileUri = pickedFile.uri;
        const fileName = pickedFile.name || '';

        // ZIP 파일인지 레거시 JSON 파일인지 판별
        if (fileName.endsWith('.zip') || pickedFile.mimeType === 'application/zip') {
            return await importFromZip(fileUri);
        } else {
            // 레거시 JSON 호환 (기존 백업 파일 지원)
            return await importFromLegacyJson(fileUri);
        }
    } catch (error) {
        console.error('[Restore Error]:', error);
        throw error;
    }
}

/**
 * 📦 ZIP 파일에서 복원
 */
async function importFromZip(fileUri) {
    // 1. ZIP 파일을 base64로 읽기
    const zipBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    // 2. JSZip으로 열기
    const zip = await JSZip.loadAsync(zipBase64, { base64: true });

    // 3. data.json 복호화
    const dataFile = zip.file('data.json');
    if (!dataFile) {
        throw new Error('올바른 오늘조각 백업 파일이 아닙니다. (data.json 없음)');
    }
    const encryptedContent = await dataFile.async('string');

    let jsonContent;
    try {
        jsonContent = decryptData(encryptedContent);
    } catch (e) {
        throw new Error('백업 파일 암호를 풀 수 없습니다. 손상된 파일이거나 다른 앱의 백업일 수 있습니다.');
    }

    const data = JSON.parse(jsonContent);

    if (!data.tables || !data.version) {
        throw new Error('올바른 오늘조각 백업 파일 형식이 아닙니다.');
    }

    // 4. 사진 파일 복원
    await ensurePhotosDir();

    const imageFiles = Object.keys(zip.files).filter(name => name.startsWith('images/') && !zip.files[name].dir);

    for (const imagePath of imageFiles) {
        try {
            const imageBase64 = await zip.file(imagePath).async('base64');
            const filename = imagePath.replace('images/', '');
            const localPath = `${PHOTOS_DIR}${filename}`;

            await FileSystem.writeAsStringAsync(localPath, imageBase64, {
                encoding: FileSystem.EncodingType.Base64,
            });
        } catch (e) {
            console.warn('[Restore] Failed to restore image:', imagePath, e);
        }
    }

    // 5. diary의 상대 경로를 실제 로컬 경로로 변환
    if (data.tables.diary) {
        data.tables.diary = remapPhotoUrisToLocal(data.tables.diary);
    }

    return data;
}

/**
 * 📄 레거시 JSON 파일에서 복원 (기존 .json 백업 호환)
 */
async function importFromLegacyJson(fileUri) {
    const encryptedContent = await FileSystem.readAsStringAsync(fileUri);

    let jsonContent;
    try {
        jsonContent = decryptData(encryptedContent);
    } catch (e) {
        throw new Error('백업 파일 암호를 풀 수 없습니다. 손상된 파일이거나 다른 앱의 백업일 수 있습니다.');
    }

    const data = JSON.parse(jsonContent);

    if (!data.tables || !data.version) {
        throw new Error('올바른 오늘조각 백업 파일 형식이 아닙니다.');
    }

    return data;
}
