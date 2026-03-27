import Constants from 'expo-constants';

/**
 * 🔐 중앙 집중식 앱 설정 및 환경 변수 관리
 * app.config.js에서 주입된 extra 데이터를 안전하게 읽어옵니다.
 */

const extra = Constants.expoConfig?.extra || {};

export const CONFIG = {
    // 백업 암호화용 비밀키 (32자 권장)
    BACKUP_SECRET: extra.backupSecret || 'today-piece-secure-key-32chars!!',
    
    // EAS 프로젝트 ID 등 추가 가능
    EAS_PROJECT_ID: extra.eas?.projectId || '',
};
