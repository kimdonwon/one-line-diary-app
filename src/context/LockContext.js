import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { getSetting, saveSetting } from '../database/db';

const LockContext = createContext();

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
            const pass = await getSetting('password');

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
                // 생체인증 실패/취소 → PIN 화면으로 전환
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
        await saveSetting('password', newPass);

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
