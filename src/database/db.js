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
            console.log('[DB]: Opening database...');
            const instance = await SQLite.openDatabaseAsync('diary.db');
            if (!instance) throw new Error('Failed to open database instance');

            console.log('[DB]: Setting pragmas...');
            await instance.execAsync('PRAGMA busy_timeout = 5000;');

            try {
                await instance.execAsync('PRAGMA journal_mode = WAL;');
            } catch (e) {
                console.warn('[DB]: WAL mode setting skipped:', e.message);
            }

            try {
                await instance.execAsync('PRAGMA foreign_keys = ON;');
            } catch (e) {
                console.warn('[DB]: foreign_keys setting skipped:', e.message);
            }

            console.log('[DB]: Creating tables...');
            await instance.execAsync(`
                CREATE TABLE IF NOT EXISTS diary (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT UNIQUE NOT NULL, content TEXT NOT NULL, mood TEXT NOT NULL, stickers TEXT DEFAULT '[]');
                CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, activity TEXT NOT NULL, title TEXT DEFAULT '', note TEXT DEFAULT '', UNIQUE(date, activity));
                CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, diary_date TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, character TEXT DEFAULT 'bear');
                CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT);
            `.replace(/\s+/g, ' ').trim());

            console.log('[DB]: Running migrations...');
            const migrations = [
                "ALTER TABLE activities ADD COLUMN title TEXT DEFAULT ''",
                "ALTER TABLE activities ADD COLUMN note TEXT DEFAULT ''",
                "ALTER TABLE diary ADD COLUMN stickers TEXT DEFAULT '[]'",
                "ALTER TABLE diary ADD COLUMN photos TEXT DEFAULT '[]'",
                "ALTER TABLE diary ADD COLUMN backgrounds TEXT DEFAULT '[]'",
                "ALTER TABLE diary ADD COLUMN texts TEXT DEFAULT '[]'",
                "ALTER TABLE comments ADD COLUMN character TEXT DEFAULT 'bear'"
            ];

            for (const sql of migrations) {
                try { await instance.execAsync(sql); } catch (e) { /* 이미 존재 */ }
            }

            console.log('[DB]: Initializing app settings...');
            const now = new Date().toISOString();
            await instance.execAsync(`
                INSERT OR IGNORE INTO app_settings (key, value) VALUES ('isLockEnabled', 'false');
                INSERT OR IGNORE INTO app_settings (key, value) VALUES ('password', '');
                INSERT OR IGNORE INTO app_settings (key, value) VALUES ('isPremium', 'false');
                INSERT OR IGNORE INTO app_settings (key, value) VALUES ('premiumTrialStartDate', '${now}');
            `);

            db = instance;
            dbReady = true;
            console.log('[DB]: Initialization complete.');
            return db;
        } catch (error) {
            console.error('[DB Init Error]:', error);
            initPromise = null;
            dbReady = false;
            throw error;
        }
    })();

    return initPromise;
}

/**
 * DB 인스턴스 보장 (내부용)
 */
function ensureDB() {
    if (!db) {
        throw new Error('Database instance is null. Call initDB() first.');
    }
    return db;
}

let dbQueue = Promise.resolve();

/**
 * 모든 DB 작업을 안전하게 큐잉하여 실행합니다.
 * NullPointerException 및 동시성 문제를 방지합니다.
 */
function enqueueDBTask(taskFn) {
    return new Promise((resolve, reject) => {
        dbQueue = dbQueue.then(async () => {
            try {
                // 초기화가 실행되지 않았다면 실행 및 대기
                if (!initPromise) initDB();
                await initPromise;

                const d = ensureDB();
                const result = await taskFn(d);
                return resolve(result); // Return the resolution to ensure chaining waits
            } catch (err) {
                console.error('[DB Task Error]:', err);
                reject(err);
                // Return resolve to not break the queue chain structure, allowing next tasks to proceed
                return Promise.resolve();
            }
        }).catch((fatalErr) => {
            console.error('[DB Fatal Exception]:', fatalErr);
            reject(fatalErr);
            return Promise.resolve(); // Keep queue alive
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

export async function saveDiary(date, content, mood, stickers = '[]', photos = '[]', backgrounds = '[]', texts = '[]') {
    return enqueueDBTask(async (d) => {
        await d.runAsync(
            'INSERT OR REPLACE INTO diary (date, content, mood, stickers, photos, backgrounds, texts) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [date, content, mood, stickers, photos, backgrounds, texts]
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

export async function getAllDiaries() {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT * FROM diary ORDER BY date ASC"
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
                    [date, act.key, '', '']
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

export async function getMonthAllActivities(yearMonth) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT * FROM activities WHERE date LIKE ? ORDER BY date ASC",
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

// ─── 댓글 (Comments) ───

export async function saveComment(diary_date, content, created_at, character = 'bear') {
    return enqueueDBTask(async (d) => {
        await d.runAsync(
            'INSERT INTO comments (diary_date, content, created_at, character) VALUES (?, ?, ?, ?)',
            [diary_date, content, created_at, character]
        );
    });
}

export async function getComments(diary_date) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            'SELECT * FROM comments WHERE diary_date = ? ORDER BY created_at ASC',
            [diary_date]
        );
    });
}

export async function deleteComment(id) {
    return enqueueDBTask(async (d) => {
        await d.runAsync(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
    });
}

export async function getAllCommentCounts() {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            'SELECT diary_date, COUNT(*) as count FROM comments GROUP BY diary_date'
        );
    });
}
// ─── 데이터 백업 및 복원 ───

/**
 * 모든 데이터를 하나의 JSON 객체로 가져옵니다.
 */
export async function getAllData() {
    return enqueueDBTask(async (d) => {
        const diary = await d.getAllAsync('SELECT * FROM diary');
        const activities = await d.getAllAsync('SELECT * FROM activities');
        const comments = await d.getAllAsync('SELECT * FROM comments');
        const app_settings = await d.getAllAsync('SELECT * FROM app_settings');

        return {
            version: '2.0.0',
            exported_at: new Date().toISOString(),
            tables: {
                diary,
                activities,
                comments,
                app_settings
            }
        };
    });
}

/**
 * 이전 데이터를 모두 삭제하고 제공된 데이터로 복원합니다.
 */
export async function restoreFromData(data) {
    if (!data || !data.tables) {
        throw new Error('Invalid backup data format');
    }

    return enqueueDBTask(async (d) => {
        try {
            // 트랜잭션 시작 (execAsync로 수동 제어)
            await d.execAsync('BEGIN TRANSACTION');

            // 1. 기존 데이터 삭제
            await d.execAsync('DELETE FROM diary');
            await d.execAsync('DELETE FROM activities');
            await d.execAsync('DELETE FROM comments');
            await d.execAsync('DELETE FROM app_settings');

            // 2. 데이터 삽입
            const { diary, activities, comments, app_settings } = data.tables;

            for (const item of diary) {
                await d.runAsync(
                    'INSERT INTO diary (id, date, content, mood, stickers, photos, backgrounds, texts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.date, item.content, item.mood, item.stickers || '[]', item.photos || '[]', item.backgrounds || '[]', item.texts || '[]']
                );
            }

            for (const item of activities) {
                await d.runAsync(
                    'INSERT INTO activities (id, date, activity, title, note) VALUES (?, ?, ?, ?, ?)',
                    [item.id, item.date, item.activity, item.title, item.note]
                );
            }

            for (const item of comments) {
                await d.runAsync(
                    'INSERT INTO comments (id, diary_date, content, created_at, character) VALUES (?, ?, ?, ?, ?)',
                    [item.id, item.diary_date, item.content, item.created_at, item.character || 'bear']
                );
            }

            for (const item of app_settings) {
                await d.runAsync(
                    'INSERT INTO app_settings (key, value) VALUES (?, ?)',
                    [item.key, item.value]
                );
            }

            await d.execAsync('COMMIT');
            return true;
        } catch (error) {
            await d.execAsync('ROLLBACK');
            throw error;
        }
    });
}
/**
 * 🗑️ 모든 일기, 활동, 댓글 데이터를 삭제합니다. (테스트용)
 */
export async function deleteAllDiaryData() {
    return enqueueDBTask(async (d) => {
        try {
            await d.execAsync('BEGIN TRANSACTION');
            await d.execAsync('DELETE FROM diary');
            await d.execAsync('DELETE FROM activities');
            await d.execAsync('DELETE FROM comments');
            await d.execAsync('COMMIT');
            return true;
        } catch (error) {
            await d.execAsync('ROLLBACK');
            throw error;
        }
    });
}
