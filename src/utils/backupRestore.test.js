import { exportToShareSheet, importFromFile } from './backupRestore';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { getAllData } from '../database/db';
import JSZip from 'jszip';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';

// ----------------------------------------------------------------------------
// 1. 모의(Mock) 객체 설정
// ----------------------------------------------------------------------------
jest.mock('expo-file-system/legacy', () => ({
    documentDirectory: 'file:///mock/document/directory/',
    getInfoAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    EncodingType: { Base64: 'base64' },
}));

jest.mock('expo-sharing', () => ({
    isAvailableAsync: jest.fn(),
    shareAsync: jest.fn(),
}));

jest.mock('expo-document-picker', () => ({
    getDocumentAsync: jest.fn(),
}));

jest.mock('../database/db', () => ({
    getAllData: jest.fn(),
}));

jest.mock('jszip', () => {
    return jest.fn().mockImplementation(() => {
        return {
            file: jest.fn(),
            generateAsync: jest.fn().mockResolvedValue('mock-zip-base64'),
            files: {},
        };
    });
});
JSZip.loadAsync = jest.fn();

// 암복호화 원리 유지를 위한 간단한 mock 처리 (실제 라이브러리 우회 시)
const DUMMY_ENCRYPTED = 'U2FsdGVkX1+MockEncryptedString';
jest.mock('crypto-js/aes', () => ({
    encrypt: jest.fn(() => ({ toString: () => DUMMY_ENCRYPTED })),
    decrypt: jest.fn(() => ({ toString: jest.fn(() => JSON.stringify({ tables: { diary: [] }, version: 1 })) })),
}));

// ----------------------------------------------------------------------------
// 2. 단위 테스트 (Unit Tests)
// ----------------------------------------------------------------------------
describe('Backup & Restore 유틸리티 테스트', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        // 테스트 중 발생하는 의도된 에러 로그가 터미널을 더럽히지 않도록 spyOn 처리
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('exportToShareSheet - 백업 생성 및 내보내기', () => {
        it('DB 데이터 추출 및 ZIP 파일 패키징을 성공적으로 수행해야 한다', async () => {
            // MOCK: getAllData가 더미 데이터를 반환하도록 설정
            getAllData.mockResolvedValue({
                version: 1,
                tables: {
                    diary: [
                        { id: 1, date: '2023-10-01', photos: JSON.stringify([{ uri: 'file:///mock/photo1.jpg' }]) }
                    ]
                }
            });

            // MOCK: 사진 파일이 존재한다고 가정
            FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
            FileSystem.readAsStringAsync.mockResolvedValue('base64-image-data');
            
            // MOCK: 기기가 공유 기능을 지원한다고 가정
            Sharing.isAvailableAsync.mockResolvedValue(true);
            Sharing.shareAsync.mockResolvedValue({ action: 'sharedAction' });

            const result = await exportToShareSheet();

            // 검증 1: DB에서 데이터를 가져왔는가?
            expect(getAllData).toHaveBeenCalledTimes(1);
            
            // 검증 2: 사진 존재 여부를 확인하고 읽어들였는가?
            expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('file:///mock/photo1.jpg');
            expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file:///mock/photo1.jpg', { encoding: 'base64' });

            // 검증 3: 최종적으로 공유 시트가 임시 ZIP 파일을 띄웠는가?
            expect(Sharing.isAvailableAsync).toHaveBeenCalled();
            expect(Sharing.shareAsync).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('기기가 공유 지원 오류(isAvailableAsync=false) 반환 시 예외를 던져야 한다', async () => {
            getAllData.mockResolvedValue({ tables: { diary: [] } });
            Sharing.isAvailableAsync.mockResolvedValue(false);

            await expect(exportToShareSheet()).rejects.toThrow('공유 기능을 사용할 수 없는 기기입니다.');
        });
    });

    describe('importFromFile - 백업 복구 수행', () => {
        it('사용자가 파일 선택 휴지(Cancel) 시 false를 반환해야 한다', async () => {
            DocumentPicker.getDocumentAsync.mockResolvedValue({ canceled: true });
            const result = await importFromFile();
            expect(result).toBe(false);
        });

        it('정상적인 ZIP 형태의 백업 파일을 선택 시 복호화 및 데이터가 반환되어야 한다', async () => {
            DocumentPicker.getDocumentAsync.mockResolvedValue({
                canceled: false,
                assets: [{ uri: 'file:///mock/download/backup.zip', name: 'backup.zip', mimeType: 'application/zip' }]
            });

            FileSystem.readAsStringAsync.mockResolvedValue('mock-base64-zip-data');
            
            // MOCK: JSZip.loadAsync 결과 (data.json 포함)
            const mockZipFile = {
                file: jest.fn().mockReturnValue({
                    async: jest.fn().mockResolvedValue(DUMMY_ENCRYPTED)
                }),
                files: {} // 빈 사진 리스트
            };
            JSZip.loadAsync.mockResolvedValue(mockZipFile);

            // photos 디렉토리 생성 통과
            FileSystem.getInfoAsync.mockResolvedValue({ exists: false });

            const restoredData = await importFromFile();

            // 검증 1: 파일을 불러왔는가?
            expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
            // 검증 2: Zip 파일 압축을 풀었는가?
            expect(JSZip.loadAsync).toHaveBeenCalled();
            // 검증 3: 결과 데이터 포맷 (AES 복호화 결과)
            expect(restoredData.version).toBe(1);
            expect(restoredData.tables.diary).toEqual([]);
        });
    });
});
