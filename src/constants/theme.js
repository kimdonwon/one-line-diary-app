// 🍰 소프트 파스텔 테마 — 부드럽고 귀여운 다이어리 디자인
// BRUTALISM 제거 → SOFT_SHADOW 도입

export const COLORS = {
    background: '#F7F3F0',   // 웜 오트밀 (힙하고 중성적인 배경)
    card: '#FFFFFF',
    text: '#4A3728',         // 따뜻한 다크 브라운
    textSecondary: '#9E8E82',
    todayHighlight: '#FF8FAB',
    border: '#E2DED0',       // 웜톤에 맞춘 연한 베이지 보더

    // Mood colors (파스텔 톤)
    happy: '#7CD4A0',        // 파스텔 그린
    sad: '#8BBFEF',          // 파스텔 블루
    surprised: '#FFD485',    // 파스텔 옐로우
    embarrassed: '#FFB5B5',  // 파스텔 핑크레드
    soso: '#C8BEB7',         // 파스텔 그레이
};

export const FONTS = {
    bold: { fontWeight: '700' },
    semiBold: { fontWeight: '600' },
    regular: { fontWeight: '500' },
    title: { fontSize: 26, fontWeight: '700', color: '#4A3728' },
    subtitle: { fontSize: 20, fontWeight: '700', color: '#4A3728' },
    body: { fontSize: 16, fontWeight: '500', color: '#4A3728' },
    caption: { fontSize: 13, fontWeight: '600', color: '#9E8E82' },
    calendarDay: { fontSize: 15, fontWeight: '700', color: '#4A3728' },
    calendarHeader: { fontSize: 13, fontWeight: '700', color: '#9E8E82', textTransform: 'uppercase' },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const RADIUS = { sm: 12, md: 18, lg: 24, full: 999 };

// 🍰 소프트 쉐도우 (BRUTALISM 대체)
export const SOFT_SHADOW = {
    card: {
        shadowColor: '#C9A8B2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(232, 213, 204, 0.5)',
    },
    button: {
        shadowColor: '#C9A8B2',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
};

// 하위 호환: BRUTALISM → SOFT_SHADOW alias
export const BRUTALISM = SOFT_SHADOW;
