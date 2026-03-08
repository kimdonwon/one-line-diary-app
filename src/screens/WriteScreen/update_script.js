const fs = require('fs');

try {
    const file = './WriteScreen.view.js';
    let content = fs.readFileSync(file, 'utf8');

    const startIdx = content.indexOf('<View style={styles.floatingDockContent}>');
    if (startIdx === -1) throw new Error("Could not find start");

    const textsStart = content.indexOf('{showTexts && (', startIdx);
    const textsEnd = content.indexOf(')}', content.indexOf(')}', content.indexOf('</View>', content.indexOf('</View>', textsStart) + 7) + 7) + 2) + 2;

    // Find the end of showTexts reliably:
    const photosStart = content.indexOf('{showPhotos && (', startIdx);
    const stickersStart = content.indexOf('{showStickers && (', startIdx);

    // The end of floatingDockContent
    const endIdx = content.indexOf('</View>', stickersStart + 100);
    // it's the last </View> before the next section

    const textBlockRaw = content.substring(textsStart, photosStart);
    const photoBlockRaw = content.substring(photosStart, stickersStart);

    // We must find the closing of showStickers: it's right before `</View>` of floatingDockContent
    // Since isDraggingAny follows it:
    const nextSectionIdx = content.indexOf('{isDraggingAny && (');
    const containerEndIdx = content.lastIndexOf('</View>', nextSectionIdx - 1);
    const contentEndIdx = content.lastIndexOf('</View>', containerEndIdx - 1);

    const stickerBlockRaw = content.substring(stickersStart, contentEndIdx);

    // Now clean up the `{show... && (` wrappers:
    const cleanBlock = (raw) => {
        let s = raw.substring(raw.indexOf('(') + 1);
        return s.substring(0, s.lastIndexOf(')')).trim();
    };

    const textBlock = cleanBlock(textBlockRaw);
    const photoBlock = cleanBlock(photoBlockRaw);
    const stickerBlock = cleanBlock(stickerBlockRaw);

    // Assemble the new ScrollView content
    const newContentStr = `
                    <View style={[styles.floatingDockContent, { paddingHorizontal: 0, paddingBottom: 0 }]}>
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
                                ${stickerBlock}
                            </View>
                            <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
                                ${photoBlock}
                            </View>
                            <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
                                ${textBlock}
                            </View>
                        </ScrollView>
`;

    content = content.substring(0, startIdx) + newContentStr + content.substring(contentEndIdx);

    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} catch (e) {
    console.error(e);
}
