const fs = require('fs');

try {
    const file = './WriteScreen.view.js';
    let content = fs.readFileSync(file, 'utf8');

    const floatingStart = content.indexOf('<View style={styles.floatingDockContent}>');
    if (floatingStart === -1) throw new Error("floatingDockContent not found");

    const tStart = content.indexOf('{showTexts && (', floatingStart);
    const pStart = content.indexOf('{showPhotos && (', floatingStart);
    const sStart = content.indexOf('{showStickers && (', floatingStart);

    // Look for the end of the floatingDockContent.
    // We know it is followed by </View> and )}
    const floatingEnd = content.indexOf('</View>\n                </View>\n            )}', sStart);

    // Actually the code in the file is:
    //                     </View>
    //                 </View>
    //             )}
    let floatingDockCloseIdx = -1;
    let idx = sStart;
    while (true) {
        idx = content.indexOf('</View>', idx + 1);
        if (idx === -1) break;
        let nextLines = content.substring(idx, idx + 100);
        if (nextLines.includes('</View>') && nextLines.match(/<\/View>\s*<\/View>\s*}\)/)) {
            floatingDockCloseIdx = idx;
            break;
        }
    }

    if (floatingDockCloseIdx === -1) throw new Error("Container close not found");
    const blockStr = content.substring(floatingStart, floatingDockCloseIdx + 7);

    const cleanBlock = (str) => {
        const startParen = str.indexOf('(') + 1;
        const lastParen = str.lastIndexOf(')');
        return str.substring(startParen, lastParen).trim();
    };

    const textRaw = blockStr.substring(tStart - floatingStart, pStart - floatingStart);
    const photoRaw = blockStr.substring(pStart - floatingStart, sStart - floatingStart);
    const stickerRaw = blockStr.substring(sStart - floatingStart); // to the end

    const textReady = cleanBlock(textRaw);
    const photoReady = cleanBlock(photoRaw);
    const stickerReady = cleanBlock(stickerRaw);

    const newScrollView = `
<View style={[styles.floatingDockContent, { paddingHorizontal: 0, paddingBottom: 0 }]}>
    <View style={styles.bottomSheetHeader}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>
            {showStickers ? '스티커' : showPhotos ? '사진 프레임' : '텍스트 스타일'}
        </Text>
        <TouchableOpacity
            style={styles.bottomSheetCloseBtn}
            onPress={() => {
                setShowStickers(false);
                setShowPhotos(false);
                setShowTexts(false);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Text style={{ fontSize: 18, color: '#A0A09F', fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
    </View>
    <ScrollView
        ref={bottomSheetScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
            if (idx === 0) { setShowStickers(true); setShowPhotos(false); setShowTexts(false); }
            else if (idx === 1) { setShowStickers(false); setShowPhotos(true); setShowTexts(false); }
            else if (idx === 2) { setShowStickers(false); setShowPhotos(false); setShowTexts(true); }
        }}
    >
        <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
            ${stickerReady}
        </View>
        <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
            ${photoReady}
        </View>
        <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
            ${textReady}
        </View>
    </ScrollView>
</View>`;

    content = content.replace(blockStr, newScrollView);

    fs.writeFileSync(file, content, 'utf8');
    console.log("Success inner rewrite");
} catch (e) {
    console.error("Error:", e.message);
}
