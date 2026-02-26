import * as SQLite from 'expo-sqlite';

let db = null;
let dbReady = false;

export async function initDB() {
    db = await SQLite.openDatabaseAsync('diary.db');

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS diary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT UNIQUE NOT NULL,
            content TEXT NOT NULL,
            mood TEXT NOT NULL,
            stickers TEXT DEFAULT '[]'
        )`
    );

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            activity TEXT NOT NULL,
            title TEXT DEFAULT '',
            note TEXT DEFAULT '',
            UNIQUE(date, activity)
        )`
    );

    // 기존 activities 테이블 마이그레이션
    try { await db.execAsync(`ALTER TABLE activities ADD COLUMN title TEXT DEFAULT ''`); } catch (e) { }
    try { await db.execAsync(`ALTER TABLE activities ADD COLUMN note TEXT DEFAULT ''`); } catch (e) { }

    // 기존 diary 테이블 마이그레이션 (다꾸 스티커 데이터용)
    try { await db.execAsync(`ALTER TABLE diary ADD COLUMN stickers TEXT DEFAULT '[]'`); } catch (e) { }

    await db.execAsync(
        `CREATE TABLE IF NOT EXISTS app_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`
    );

    // 기본 설정값 초기화 (비밀번호 잠금 비활성)
    try {
        await db.runAsync('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)', ['isLockEnabled', 'false']);
        await db.runAsync('INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)', ['password', '']);
    } catch (e) { }

    dbReady = true;
}

export async function saveSetting(key, value) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        await d.runAsync(
            'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
            [key, String(value)]
        );
    });
}

export async function getSetting(key) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getFirstAsync('SELECT value FROM app_settings WHERE key = ?', [key]);
        return result ? result.value : null;
    });
}

function ensureDB() {
    // Fast Refresh 등으로 모듈 변수가 초기화된 경우를 대비한 폴백 처리
    if (!db || !dbReady) {
        try {
            db = SQLite.openDatabaseSync('diary.db');
            dbReady = true;
        } catch (e) {
            throw new Error('DB not initialized. Call initDB() first.');
        }
    }
    return db;
}

// ─── 데이터베이스 작업 대기열 (Mutex Queue) ───
// 병렬로 여러 번의 DB 접근 시 (expo-sqlite의 NativeDatabase.prepareAsync) 널포인터 예외가
// 발생하는 것을 방지하기 위해 모든 DB 작업을 순차적으로 실행합니다.
let dbQueue = Promise.resolve();

function enqueueDBTask(taskFn) {
    return new Promise((resolve, reject) => {
        dbQueue = dbQueue.then(async () => {
            try {
                const result = await taskFn();
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}

export async function saveDiary(date, content, mood, stickers = '[]') {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        await d.runAsync(
            'INSERT OR REPLACE INTO diary (date, content, mood, stickers) VALUES (?, ?, ?, ?)',
            [date, content, mood, stickers]
        );
    });
}

export async function getDiary(date) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getFirstAsync('SELECT * FROM diary WHERE date = ?', [date]);
        return result;
    });
}

export async function getMonthDiaries(yearMonth) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT * FROM diary WHERE date LIKE ? ORDER BY date ASC",
            [`${yearMonth}%`]
        );
        return result;
    });
}

export async function getMoodStats(yearMonth) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT mood, COUNT(*) as count FROM diary WHERE date LIKE ? GROUP BY mood",
            [`${yearMonth}%`]
        );
        return result;
    });
}

export async function getMoodStatsByDateRange(startDate, endDate) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT mood, COUNT(*) as count FROM diary WHERE date >= ? AND date <= ? GROUP BY mood",
            [startDate, endDate]
        );
        return result;
    });
}

export async function getYearDiaries(year) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT * FROM diary WHERE date LIKE ? ORDER BY date ASC",
            [`${year}%`]
        );
        return result;
    });
}

export async function getYearMoodStats(year) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT mood, COUNT(*) as count FROM diary WHERE date LIKE ? GROUP BY mood",
            [`${year}%`]
        );
        return result;
    });
}

export async function getYearMonthlyStats(year) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT substr(date, 1, 7) as month, mood, COUNT(*) as count FROM diary WHERE date LIKE ? GROUP BY substr(date, 1, 7), mood ORDER BY month ASC",
            [`${year}%`]
        );
        return result;
    });
}

// ─── 활동 기록 ───

export async function saveActivities(date, activities) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
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
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            'SELECT * FROM activities WHERE date = ? ORDER BY activity ASC',
            [date]
        );
        return result;
    });
}

export async function getYearActivities(year) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT activity, COUNT(*) as count FROM activities WHERE date LIKE ? GROUP BY activity ORDER BY count DESC",
            [`${year}%`]
        );
        return result;
    });
}

export async function getYearAllActivities(year) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT * FROM activities WHERE date LIKE ? ORDER BY date DESC",
            [`${year}%`]
        );
        return result;
    });
}

export async function getYearMonthlyActivities(year) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT substr(date, 1, 7) as month, activity, COUNT(*) as count FROM activities WHERE date LIKE ? GROUP BY substr(date, 1, 7), activity ORDER BY month ASC",
            [`${year}%`]
        );
        return result;
    });
}

export async function getMonthActivities(yearMonth) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT activity, COUNT(*) as count FROM activities WHERE date LIKE ? GROUP BY activity ORDER BY count DESC",
            [`${yearMonth}%`]
        );
        return result;
    });
}

export async function getYearSpecificActivities(year, activity) {
    return enqueueDBTask(async () => {
        const d = ensureDB();
        const result = await d.getAllAsync(
            "SELECT * FROM activities WHERE date LIKE ? AND activity = ? ORDER BY date DESC",
            [`${year}%`, activity]
        );
        return result;
    });
}
