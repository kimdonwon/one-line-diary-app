import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { getSetting, saveSetting } from '../database/db';

const LockContext = createContext();

// 🔐 SecureStore 키 상수
const SECURE_PIN_KEY = 'today_piece_pin';

export function LockProvider({ children }) {
    const [isLockEnabled, setIsLockEnabled] = useState(false);
    const [password, setPassword] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    const [showPinFallback, setShowPinFallback] = useState(false);

    // 🔐 생체인증 가용 여부 확인
    const checkBiometric = useCallback(async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setIsBiometricAvailable(compatible && enrolled);
        } catch (e) {
            setIsBiometricAvailable(false);
        }
    }, []);

    // 🔐 초기 설정값 로드
    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const enabled = await getSetting('isLockEnabled');

            // 🔐 SecureStore에서 PIN을 읽습니다 (안전한 금고)
            let pass = null;
            try {
                pass = await SecureStore.getItemAsync(SECURE_PIN_KEY);
            } catch (e) {
                console.warn('[Lock] SecureStore read failed, trying DB fallback:', e.message);
            }

            // 🔄 마이그레이션: 기존 DB에 저장된 PIN이 있으면 SecureStore로 이전
            if (!pass) {
                const dbPass = await getSetting('password');
                if (dbPass && dbPass.length === 4) {
                    pass = dbPass;
                    try {
                        await SecureStore.setItemAsync(SECURE_PIN_KEY, dbPass);
                        // DB에서 평문 비밀번호 삭제 (보안 강화)
                        await saveSetting('password', '');
                    } catch (e) {
                        console.warn('[Lock] Migration to SecureStore failed:', e.message);
                    }
                }
            }

            const isEnabled = enabled === 'true';
            setIsLockEnabled(isEnabled);
            setPassword(pass || '');

            if (isEnabled && pass && pass.length === 4) {
                setIsLocked(true);
                setShowPinFallback(false);
            } else {
                setIsLocked(false);
            }
        } catch (e) {
            console.error('Failed to load lock settings:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkBiometric();
        loadSettings();
    }, [checkBiometric, loadSettings]);

    // 🔑 생체인증 시도
    const tryBiometricAuth = async () => {
        if (!isBiometricAvailable) {
            setShowPinFallback(true);
            return false;
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: '오늘조각 잠금 해제',
                cancelLabel: '비밀번호 입력',
                disableDeviceFallback: true,
                fallbackLabel: '비밀번호 입력',
            });

            if (result.success) {
                setIsLocked(false);
                setShowPinFallback(false);
                return true;
            } else {
                setShowPinFallback(true);
                return false;
            }
        } catch (e) {
            console.error('Biometric auth error:', e);
            setShowPinFallback(true);
            return false;
        }
    };

    // 🔑 PIN 코드로 잠금 해제 시도
    const unlock = (input) => {
        if (input === password) {
            setIsLocked(false);
            setShowPinFallback(false);
            return true;
        }
        return false;
    };

    // ⚙️ 잠금 설정 변경
    const updateLockSettings = async (enabled, newPass) => {
        await saveSetting('isLockEnabled', String(enabled));

        // 🔐 PIN은 SecureStore에 저장 (DB가 아닌 OS 보안 영역)
        try {
            if (enabled && newPass) {
                await SecureStore.setItemAsync(SECURE_PIN_KEY, newPass);
            } else {
                await SecureStore.deleteItemAsync(SECURE_PIN_KEY);
            }
        } catch (e) {
            console.error('[Lock] SecureStore write failed:', e);
        }

        // DB에는 평문 비밀번호를 저장하지 않습니다
        await saveSetting('password', '');

        setIsLockEnabled(enabled);
        setPassword(newPass);

        if (!enabled) {
            setIsLocked(false);
            setShowPinFallback(false);
        }
    };

    return (
        <LockContext.Provider value={{
            isLockEnabled,
            password,
            isLocked,
            isLoading,
            isBiometricAvailable,
            showPinFallback,
            setShowPinFallback,
            unlock,
            tryBiometricAuth,
            updateLockSettings,
            setIsLocked,
            reloadSettings: loadSettings
        }}>
            {children}
        </LockContext.Provider>
    );
}

export function useLock() {
    return useContext(LockContext);
}
