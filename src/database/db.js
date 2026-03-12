import * as SQLite from 'expo-sqlite';
import { analyzeWordsFromDiary } from '../utils/wordAnalyzer';

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
                CREATE TABLE IF NOT EXISTS word_stats (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, word TEXT NOT NULL, count INTEGER DEFAULT 1, UNIQUE(date, word));
            `.replace(/\s+/g, ' ').trim());

            console.log('[DB]: Running migrations...');
            const migrations = [
                "ALTER TABLE activities ADD COLUMN title TEXT DEFAULT ''",
                "ALTER TABLE activities ADD COLUMN note TEXT DEFAULT ''",
                "ALTER TABLE diary ADD COLUMN stickers TEXT DEFAULT '[]'",
                "ALTER TABLE diary ADD COLUMN photos TEXT DEFAULT '[]'",
                "ALTER TABLE diary ADD COLUMN backgrounds TEXT DEFAULT '[]'",
                "ALTER TABLE diary ADD COLUMN texts TEXT DEFAULT '[]'",
                "ALTER TABLE comments ADD COLUMN character TEXT DEFAULT 'bear'",
                "CREATE TABLE IF NOT EXISTS word_stats (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, word TEXT NOT NULL, count INTEGER DEFAULT 1, UNIQUE(date, word))",
                "ALTER TABLE diary ADD COLUMN updated_at TEXT DEFAULT ''"
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
    const now = new Date().toISOString();
    return enqueueDBTask(async (d) => {
        await d.runAsync(
            `INSERT OR REPLACE INTO diary (date, content, mood, stickers, photos, backgrounds, texts, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT updated_at FROM diary WHERE date = ? AND updated_at != ''), ?))`,
            [date, content, mood, stickers, photos, backgrounds, texts, date, now]
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
        if (!Array.isArray(activities)) {
            console.warn('[DB]: saveActivities called with invalid activities array:', activities);
            return;
        }

        try {
            await d.execAsync('BEGIN TRANSACTION');
            await d.runAsync('DELETE FROM activities WHERE date = ?', [date]);
            for (const act of activities) {
                if (act.selected) {
                    await d.runAsync(
                        'INSERT OR REPLACE INTO activities (date, activity, title, note) VALUES (?, ?, ?, ?)',
                        [date, act.key, act.title || '', act.note || '']
                    );
                }
            }
            await d.execAsync('COMMIT');
        } catch (e) {
            await d.execAsync('ROLLBACK');
            throw e;
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
            await d.execAsync('DELETE FROM word_stats');

            // 2. 데이터 삽입
            const { diary, activities, comments, app_settings } = data.tables;

            for (const item of diary) {
                await d.runAsync(
                    'INSERT INTO diary (id, date, content, mood, stickers, photos, backgrounds, texts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [item.id, item.date, item.content, item.mood, item.stickers || '[]', item.photos || '[]', item.backgrounds || '[]', item.texts || '[]']
                );

                // 🍱 복구 시 word_stats도 함께 생성
                try {
                    const wordMap = analyzeWordsFromDiary(item);
                    const entries = Object.entries(wordMap);
                    for (const [word, count] of entries) {
                        await d.runAsync(
                            'INSERT INTO word_stats (date, word, count) VALUES (?, ?, ?)',
                            [item.date, word, count]
                        );
                    }
                } catch (e) {
                    // 단어 분석 실패해도 복구는 계속 진행
                }
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

/**
 * 🗑️ 특정 날짜의 일기, 활동, 댓글 데이터를 삭제합니다.
 */
export async function deleteDiaryByDate(date) {
    return enqueueDBTask(async (d) => {
        try {
            await d.execAsync('BEGIN TRANSACTION');
            await d.runAsync('DELETE FROM diary WHERE date = ?', [date]);
            await d.runAsync('DELETE FROM activities WHERE date = ?', [date]);
            await d.runAsync('DELETE FROM comments WHERE diary_date = ?', [date]);
            await d.execAsync('COMMIT');
            return true;
        } catch (error) {
            await d.execAsync('ROLLBACK');
            throw error;
        }
    });
}

// ─── 단어 통계 (Word Stats) ───

/**
 * 특정 날짜의 단어 빈도를 저장합니다 (증분 동기화).
 * 기존 해당 날짜 데이터를 삭제 후 새로 삽입합니다.
 * @param {string} date - 'YYYY-MM-DD'
 * @param {Object} wordMap - { word: count, ... }
 */
export async function saveWordStats(date, wordMap) {
    return enqueueDBTask(async (d) => {
        try {
            await d.execAsync('BEGIN TRANSACTION');
            await d.runAsync('DELETE FROM word_stats WHERE date = ?', [date]);
            const entries = Object.entries(wordMap);
            for (const [word, count] of entries) {
                await d.runAsync(
                    'INSERT INTO word_stats (date, word, count) VALUES (?, ?, ?)',
                    [date, word, count]
                );
            }
            await d.execAsync('COMMIT');
        } catch (e) {
            try { await d.execAsync('ROLLBACK'); } catch (_) {}
            console.warn('[WordStats] saveWordStats failed:', e.message);
        }
    });
}

/**
 * 특정 연도의 단어 빈도 상위 N개를 조회합니다.
 * @param {string|number} year
 * @param {number} limit - 상위 몇 개 (기본 10)
 */
export async function getYearWordStats(year, limit = 10) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            `SELECT word, SUM(count) as total FROM word_stats WHERE date LIKE ? GROUP BY word ORDER BY total DESC LIMIT ?`,
            [`${year}%`, limit]
        );
    });
}

/**
 * 특정 날짜의 단어 통계를 삭제합니다.
 */
export async function deleteWordStats(date) {
    return enqueueDBTask(async (d) => {
        await d.runAsync('DELETE FROM word_stats WHERE date = ?', [date]);
    });
}

/**
 * 특정 연도의 연속 기록 일수(최대 스트릭)를 계산합니다.
 * @param {string|number} year
 * @returns {number} maxStreak
 */
export async function getYearMaxStreak(year) {
    return enqueueDBTask(async (d) => {
        const rows = await d.getAllAsync(
            "SELECT date FROM diary WHERE date LIKE ? ORDER BY date ASC",
            [`${year}%`]
        );
        if (!rows || rows.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < rows.length; i++) {
            const prev = new Date(rows[i - 1].date);
            const curr = new Date(rows[i].date);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        return maxStreak;
    });
}

/**
 * 특정 연도의 일기 기록 시간들을 조회합니다. (황금 시간대 분석용)
 * @param {string|number} year
 * @returns {Array} [{ updated_at }, ...]
 */
export async function getYearDiaryTimes(year) {
    return enqueueDBTask(async (d) => {
        return await d.getAllAsync(
            "SELECT updated_at FROM diary WHERE date LIKE ? AND updated_at IS NOT NULL AND updated_at != ''",
            [`${year}%`]
        );
    });
}
