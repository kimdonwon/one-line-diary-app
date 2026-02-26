import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSetting, saveSetting } from '../database/db';

const LockContext = createContext();

export function LockProvider({ children }) {
    const [isLockEnabled, setIsLockEnabled] = useState(false); // 잠금 기능 활성화 여부
    const [password, setPassword] = useState(''); // 설정된 비밀번호
    const [isLocked, setIsLocked] = useState(false); // 현재 화면이 잠겨있는지 여부
    const [isLoading, setIsLoading] = useState(true);

    // 🔐 초기 설정값 로드
    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const enabled = await getSetting('isLockEnabled');
            const pass = await getSetting('password');

            const isEnabled = enabled === 'true';
            setIsLockEnabled(isEnabled);
            setPassword(pass || '');

            // 잠금이 켜져있고 비밀번호가 있다면 잠금 상태로 시작
            if (isEnabled && pass && pass.length === 4) {
                setIsLocked(true);
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
        loadSettings();
    }, [loadSettings]);

    // 🔑 잠금 해제 시도
    const unlock = (input) => {
        if (input === password) {
            setIsLocked(false);
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

        // 설정을 끄면 즉시 잠금 해제
        if (!enabled) {
            setIsLocked(false);
        }
    };

    return (
        <LockContext.Provider value={{
            isLockEnabled,
            password,
            isLocked,
            isLoading,
            unlock,
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
