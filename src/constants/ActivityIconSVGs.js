/**
 * 🎮 Skia 파티클 엔진용 활동 아이콘 SVG XML (v2 — Skia 호환)
 *
 * Skia.SVG.MakeFromString()은 브라우저 SVG 파서보다 제한적임.
 * - fill="none"을 지원하지 않는 경우가 있어 → fill 속성 자체를 생략하거나 transparent 사용
 * - 복합 M 명령이 여러 path에 걸쳐 있으면 → 개별 path로 분리
 * - Arc (A) 명령 → 간단한 곡선(C)이나 제거로 대체
 */

const LW = 4.5;
const LINE = "#283665";

const READING_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 28 C30 20 50 25 50 25 C50 25 50 75 50 85 C50 85 30 80 18 88Z" fill="#FEE97D" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <path d="M82 28 C70 20 50 25 50 25 C50 25 50 75 50 85 C50 85 70 80 82 88Z" fill="#B4DCC6" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <line x1="50" y1="25" x2="50" y2="85" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="27" y1="45" x2="42" y2="42" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="27" y1="60" x2="42" y2="57" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="73" y1="45" x2="58" y2="42" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="73" y1="60" x2="58" y2="57" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
</svg>`;

const VIDEO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="30" width="70" height="50" rx="12" fill="#8BBFEF" stroke="${LINE}" stroke-width="${LW}"/>
  <line x1="35" y1="15" x2="50" y2="30" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="65" y1="15" x2="50" y2="30" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <circle cx="35" cy="15" r="4" fill="#FFB5B5" stroke="${LINE}" stroke-width="${LW}"/>
  <circle cx="65" cy="15" r="4" fill="#FEE97D" stroke="${LINE}" stroke-width="${LW}"/>
  <path d="M44 43 L60 55 L44 67Z" fill="#FFFFFF" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
</svg>`;

const STUDY_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M25 75 L35 85 L85 35 L75 25Z" fill="#FEE97D" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <path d="M25 75 L35 85 L14 90Z" fill="#FFD485" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <path d="M85 35 L75 25 L80 20 L90 30Z" fill="#FFB5B5" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <line x1="45" y1="55" x2="55" y2="65" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="55" y1="45" x2="65" y2="55" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <circle cx="16" cy="88" r="3" fill="${LINE}"/>
</svg>`;

const DATE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 85 C50 85 10 55 15 30 C18 15 40 10 50 30 C60 10 82 15 85 30 C90 55 50 85 50 85Z" fill="#FFB5B5" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M28 35 C28 30 34 24 38 25" stroke="#FFFFFF" stroke-width="${LW}" stroke-linecap="round" fill="transparent"/>
</svg>`;

const GAME_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="12" y="32" width="76" height="42" rx="21" fill="#C9B5B6" stroke="${LINE}" stroke-width="${LW}"/>
  <line x1="30" y1="45" x2="30" y2="61" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <line x1="22" y1="53" x2="38" y2="53" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <circle cx="62" cy="58" r="5.5" fill="#FFB5B5" stroke="${LINE}" stroke-width="2.5"/>
  <circle cx="74" cy="46" r="5.5" fill="#FEE97D" stroke="${LINE}" stroke-width="2.5"/>
</svg>`;

const SOCIAL_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="47" y1="32" x2="47" y2="22" stroke="#FFB5B5" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="39" y1="35" x2="32" y2="27" stroke="#FFB5B5" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="55" y1="35" x2="62" y2="27" stroke="#FFB5B5" stroke-width="${LW}" stroke-linecap="round"/>
  <path d="M52 45 L52 75 C52 85 72 85 72 75 L72 45Z" fill="#FEE97D" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <path d="M72 55 C84 55 84 70 72 70" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round" fill="transparent"/>
  <path d="M28 40 L28 70 C28 80 48 80 48 70 L48 40Z" fill="#B4DCC6" stroke="${LINE}" stroke-width="${LW}" stroke-linejoin="round"/>
  <path d="M28 50 C16 50 16 65 28 65" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round" fill="transparent"/>
</svg>`;

const EXERCISE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="50" x2="80" y2="50" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <rect x="15" y="30" width="16" height="40" rx="6" fill="#8BBFEF" stroke="${LINE}" stroke-width="${LW}"/>
  <rect x="69" y="30" width="16" height="40" rx="6" fill="#FFB5B5" stroke="${LINE}" stroke-width="${LW}"/>
  <line x1="20" y1="30" x2="20" y2="70" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  <line x1="74" y1="30" x2="74" y2="70" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const DEFAULT_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#E8F1FB" stroke="${LINE}" stroke-width="${LW}"/>
  <line x1="40" y1="40" x2="60" y2="60" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
  <line x1="60" y1="40" x2="40" y2="60" stroke="${LINE}" stroke-width="${LW}" stroke-linecap="round"/>
</svg>`;

export const ACTIVITY_ICON_SVG_MAP = {
    reading: READING_SVG,
    video: VIDEO_SVG,
    study: STUDY_SVG,
    date: DATE_SVG,
    game: GAME_SVG,
    social: SOCIAL_SVG,
    exercise: EXERCISE_SVG,
    default: DEFAULT_SVG,
};
