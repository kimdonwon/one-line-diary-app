import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as MailComposer from 'expo-mail-composer';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import { getAllData, restoreFromData } from '../database/db';
import { Alert } from 'react-native';

// 암호화용 고정 키 (32바이트 권장)
const SECRET_KEY = Utf8.parse('today-piece-secure-key-32chars!!');

/**
 * 📤 데이터를 JSON 파일로 생성하고 이메일에 첨부합니다.
 */
/**
 * 📤 데이터를 JSON 파일로 생성하고 공유 창을 띄웁니다. (구글 드라이브, 카카오톡, 메일 등)
 */
export async function exportToShareSheet() {
    try {
        const data = await getAllData();
        const jsonString = JSON.stringify(data, null, 2);

        // 데이터 암호화 (AES)
        const encrypted = AES.encrypt(jsonString, SECRET_KEY, {
            mode: ECB,
            padding: Pkcs7
        }).toString();

        // 날짜를 포함한 파일명 생성
        const today = new Date().toISOString().split('T')[0];
        const fileUri = `${FileSystem.documentDirectory}today_piece_backup_${today}.json`;

        // 임시 파일 쓰기
        await FileSystem.writeAsStringAsync(fileUri, encrypted);

        // 시스템 공유 시트 띄우기
        if (await Sharing.isAvailableAsync()) {
            const result = await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: '백업 파일 내보내기',
                UTI: 'public.json' // iOS 지원용
            });

            // 사용자가 실제로 공유를 수행했는지 확인 (iOS에서 정확하며, 안드로이드는 항상 완료로 간주될 수 있음)
            // expo-sharing의 결과 객체에 action 속성이 있을 경우 체크
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
 * 📥 JSON 파일에서 데이터를 읽어와 DB를 복구합니다.
 */
export async function importFromFile() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // 구글 드라이브 등에서 확장자 인식을 위해 전체 허용 후 내부 검증
            copyToCacheDirectory: true
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            return false;
        }

        const pickedFile = result.assets[0];
        const encryptedContent = await FileSystem.readAsStringAsync(pickedFile.uri);

        // 데이터 복호화
        let jsonContent;
        try {
            const bytes = AES.decrypt(encryptedContent, SECRET_KEY, {
                mode: ECB,
                padding: Pkcs7
            });
            jsonContent = bytes.toString(Utf8);

            if (!jsonContent) {
                throw new Error('복호화 실패: 올바른 백업 파일이 아니거나 비밀번호가 틀립니다.');
            }
        } catch (e) {
            throw new Error('백업 파일 암호를 풀 수 없습니다. 손상된 파일이거나 다른 앱의 백업일 수 있습니다.');
        }

        const data = JSON.parse(jsonContent);

        // 기본 구조 검증 (version, tables 존재 여부)
        if (!data.tables || !data.version) {
            throw new Error('올바른 오늘조각 백업 파일 형식이 아닙니다.');
        }

        return data;
    } catch (error) {
        console.error('[Restore Error]:', error);
        throw error;
    }
}
