import * as SQLite from 'expo-sqlite';

let db = null;
let dbReady = false;
let initPromise = null;

/**
 * 🗄️ 데이터베이스 초기화 및 테이블 생성
 */
export async function initDB() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            db = await SQLite.openDatabaseAsync('diary.db');

            // 테이블 생성 및 마이그레이션 (순차적 실행)
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS diary (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT UNIQUE NOT NULL,
                    content TEXT NOT NULL,
                    mood TEXT NOT NULL,
                    stickers TEXT DEFAULT '[]'
                );
                CREATE TABLE IF NOT EXISTS activities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT NOT NULL,
                    activity TEXT NOT NULL,
                    title TEXT DEFAULT '',
                    note TEXT DEFAULT '',
                    UNIQUE(date, activity)
                );
                CREATE TABLE IF NOT EXISTS app_settings (
                    key TEXT PRIMARY KEY,
                    value TEXT
                );
            `);

            // 컬럼 추가 마이그레이션 (try-catch로 중복 추가 방지)
            try { await db.execAsync(`ALTER TABLE activities ADD COLUMN title TEXT DEFAULT ''`); } catch (e) { }
            try { await db.execAsync(`ALTER TABLE activities ADD COLUMN note TEXT DEFAULT ''`); } catch (e) { }
            try { await db.execAsync(`ALTER TABLE diary ADD COLUMN stickers TEXT DEFAULT '[]'`); } catch (e) { }

            // 기본 설정 초기화
            await db.runAsync('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)', ['isLockEnabled', 'false']);
            await db.runAsync('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)', ['password', '']);
            await db.runAsync('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)', ['isPremium', 'false']);

            dbReady = true;
            console.log('[DB]: Initialization complete.');
        } catch (error) {
            console.error('[DB Init Error]:', error);
            initPromise = null; // 에러 시 재시도 가능하도록 초기화
            throw error;
        }
    })();

    return initPromise;
}

/**
 * DB 인스턴스 보장 (내부용)
 */
function ensureDB() {
    if (!db || !dbReady) {
        throw new Error('Database not ready. Call initDB() and wait for it.');
    }
    return db;
}

// ─── 데이터베이스 작업 대기열 (Mutex Queue) ───
let dbQueue = Promise.resolve();

/**
 * 모든 DB 작업을 안전하게 큐잉하여 실행합니다.
 * NullPointerException 및 동시성 문제를 방지합니다.
 */
function enqueueDBTask(taskFn) {
    return new Promise((resolve, reject) => {
        dbQueue = dbQueue.then(async () => {
            try {
                // 초기화가 진행 중이라면 완료될 때까지 대기
                if (initPromise) await initPromise;

                const d = ensureDB();
                const result = await taskFn(d);
                resolve(result);
            } catch (err) {
                console.error('[DB Task Error]:', err);
                reject(err);
            }
        }).catch((fatalErr) => {
            console.error('[DB Fatal Exception]:', fatalErr);
            reject(fatalErr);
        });
    });
}

// ─── 설정 관련 ───

export async function saveSetting(key, value) {
    return enqueueDBTask(async (d) => {
        await d.runAsync(
            'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
            [key, String(value)]
        );
    });
}

export async function getSetting(key) {
    return enqueueDBTask(async (d) => {
        const result = await d.getFirstAsync('SELECT value FROM app_settings WHERE key = ?', [key]);
        return result ? result.value : null;
    });
}

// ─── 일기 관련 ───

export async function saveDiary(date, content, mood, stickers = '[]') {
    return enqueueDBTask(async (d) => {
        await d.runAsync(
            'INSERT OR REPLACE INTO diary (date, content, mood, stickers) VALUES (?, ?, ?, ?)',
            [date, content, mood, stickers]
        );
    });
}

export async function getDiary(date) {
    return enqueueDBTask(async (d) => {
        return await d.getFirstAsync('SELECT * FROM diary WHERE date = ?', [date]);
    });
}

export async function getMonthDiaries(yearMonth) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT * FROM diary WHERE date LIKE ? ORDER BY date ASC",
            [`${yearMonth}%`]
        );
    });
}

export async function getMoodStats(yearMonth) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT mood, COUNT(*) as count FROM diary WHERE date LIKE ? GROUP BY mood",
            [`${yearMonth}%`]
        );
    });
}

export async function getMoodStatsByDateRange(startDate, endDate) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT mood, COUNT(*) as count FROM diary WHERE date >= ? AND date <= ? GROUP BY mood",
            [startDate, endDate]
        );
    });
}

export async function getYearDiaries(year) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT * FROM diary WHERE date LIKE ? ORDER BY date ASC",
            [`${year}%`]
        );
    });
}

export async function getYearMoodStats(year) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT mood, COUNT(*) as count FROM diary WHERE date LIKE ? GROUP BY mood",
            [`${year}%`]
        );
    });
}

export async function getYearMonthlyStats(year) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT substr(date, 1, 7) as month, mood, COUNT(*) as count FROM diary WHERE date LIKE ? GROUP BY substr(date, 1, 7), mood ORDER BY month ASC",
            [`${year}%`]
        );
    });
}

// ─── 활동 기록 ───

export async function saveActivities(date, activities) {
    return enqueueDBTask(async (d) => {
        await d.runAsync('DELETE FROM activities WHERE date = ?', [date]);
        for (const act of activities) {
            if (act.selected) {
                await d.runAsync(
                    'INSERT OR REPLACE INTO activities (date, activity, title, note) VALUES (?, ?, ?, ?)',
                    [date, act.key, act.title || '', act.note || '']
                );
            }
        }
    });
}

export async function getActivities(date) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            'SELECT * FROM activities WHERE date = ? ORDER BY activity ASC',
            [date]
        );
    });
}

export async function getYearActivities(year) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT activity, COUNT(*) as count FROM activities WHERE date LIKE ? GROUP BY activity ORDER BY count DESC",
            [`${year}%`]
        );
    });
}

export async function getYearAllActivities(year) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT * FROM activities WHERE date LIKE ? ORDER BY date DESC",
            [`${year}%`]
        );
    });
}

export async function getYearMonthlyActivities(year) {
    return enqueueDBTask(async (d) => {
        try {
            const result = await d.getAllAsync(
                "SELECT substr(date, 1, 7) as month, activity, COUNT(*) as count FROM activities WHERE date LIKE ? GROUP BY substr(date, 1, 7), activity ORDER BY month ASC",
                [`${year}%`]
            );
            return result || [];
        } catch (e) {
            console.error('getYearMonthlyActivities query failed:', e);
            return [];
        }
    });
}

export async function getMonthActivities(yearMonth) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT activity, COUNT(*) as count FROM activities WHERE date LIKE ? GROUP BY activity ORDER BY count DESC",
            [`${yearMonth}%`]
        );
    });
}

export async function getYearSpecificActivities(year, activity) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT * FROM activities WHERE date LIKE ? AND activity = ? ORDER BY date DESC",
            [`${year}%`, activity]
        );
    });
}
