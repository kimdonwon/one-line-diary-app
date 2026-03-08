const fs = require('fs');

try {
    const file = './WriteScreen.view.js';
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add OS Keyboard dismiss on tool buttons:
    content = content.replace(/LayoutAnimation\.configureNext\(LayoutAnimation\.Presets\.easeInEaseOut\);\s*setShowStickers\(!showStickers\);/g, 'Keyboard.dismiss();\n                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);\n                                        setShowStickers(!showStickers);');
    content = content.replace(/LayoutAnimation\.configureNext\(LayoutAnimation\.Presets\.easeInEaseOut\);\s*setShowPhotos\(!showPhotos\);/g, 'Keyboard.dismiss();\n                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);\n                                        setShowPhotos(!showPhotos);');
    content = content.replace(/LayoutAnimation\.configureNext\(LayoutAnimation\.Presets\.easeInEaseOut\);\s*setShowTexts\(!showTexts\);/g, 'Keyboard.dismiss();\n                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);\n                                        setShowTexts(!showTexts);');

    // 2. Extract floatingDockContainer OUT of KeyboardAvoidingView
    const dockStartMarker = '{/* ─── 🚀 플로팅 글래스 아일랜드 (Seamless Morphing Dock) ─── */}';
    const dockStart = content.indexOf(dockStartMarker);
    const metaStartMarker = '{/* ─── 📊 피드 레이아웃의 하단 메타 정보 영역 ─── */}';
    const metaStart = content.indexOf(metaStartMarker);
    // The dock block is from dockStart to just before metaStart

    // Back up to the closing tags if needed, but actually the entire dock block is between dockStart and metaStart (excluding some newlines)
    const dockStrWithSpacing = content.substring(dockStart, metaStart);
    // Let's remove it from the middle:
    content = content.substring(0, dockStart) + content.substring(metaStart);

    // Find the end of KeyboardAvoidingView
    const keyboardCloseMarker = '</KeyboardAvoidingView>';
    const keyboardEnd = content.indexOf(keyboardCloseMarker) + keyboardCloseMarker.length;

    // Insert it after keyboardEnd
    content = content.substring(0, keyboardEnd) + '\n\n' + dockStrWithSpacing + '\n' + content.substring(keyboardEnd);

    // 3. Make the floating dock content swipeable
    // First, find the new location of the dock
    let updatedDockStart = content.indexOf(dockStartMarker);
    let nextMarker = content.indexOf('{/* 🗑️ 인스타그램 스타일 다크 펄스 쓰레기통 (드래그 중에만 표시) */}');
    let dockSection = content.substring(updatedDockStart, nextMarker);

    // Add pointer events and opacity map:
    dockSection = dockSection.replace(
        '<View style={styles.floatingDockContainer}>',
        '<View style={[styles.floatingDockContainer, { paddingBottom: insets.bottom + 8, height: 280 + insets.bottom, zIndex: 1000, opacity: isDraggingAny ? 0 : 1 }]} pointerEvents={isDraggingAny ? \'none\' : \'auto\'}>'
    );

    // Add overlay BEFORE the container
    dockSection = dockSection.replace(
        dockStartMarker,
        `{/* ─── 🚀 닫기용 투명 오버레이 ─── */}
            {(showTexts || showPhotos || showStickers) && !isDraggingAny && (
                <Pressable
                    style={[StyleSheet.absoluteFill, { zIndex: 999 }]}
                    onPress={() => {
                        setShowStickers(false);
                        setShowPhotos(false);
                        setShowTexts(false);
                    }}
                />
            )}
            ${dockStartMarker}`
    );

    // Apply swipe ScrollView exactly like before
    // Notice that texts, photos, stickers bodies are cleanly enclosed in View tags
    // Let's extract them correctly by slicing
    const tStart = dockSection.indexOf('{showTexts && (');
    const tEnd = dockSection.indexOf(')}', dockSection.indexOf('</View>', dockSection.indexOf('</View>', tStart) + 7) + 7) + 2;

    // We can just use split and replace! The original code has:
    // {showTexts && ( ... )}
    // {showPhotos && ( ... )}
    // {showStickers && ( ... )}
    // inside `<View style={styles.floatingDockContent}> ... </View>`

    const dockContentStart = dockSection.indexOf('<View style={styles.floatingDockContent}>');
    const dockContentEnd = dockSection.lastIndexOf('</View>', dockSection.lastIndexOf('</View>', dockSection.lastIndexOf('</View>') - 1) - 1);

    // Let's just use regex for the 3 conditionals:
    // Replace: {showTexts && ( \n <View ...> \n  ... \n </View> \n )}

    // We can do it by removing the wrapper `{showXXX && (` and trailing `)}`
    let innerContent = dockSection.substring(dockContentStart + '<View style={styles.floatingDockContent}>'.length, dockSection.lastIndexOf('</View>', dockSection.length - 15));
    // Let's manually parse the blocks since regex dotall is tricky with multiple identical views

    const textStartI = innerContent.indexOf('{showTexts && (');
    const photoStartI = innerContent.indexOf('{showPhotos && (');
    const stickerStartI = innerContent.indexOf('{showStickers && (');

    const textRaw = innerContent.substring(textStartI, photoStartI);
    const photoRaw = innerContent.substring(photoStartI, stickerStartI);
    const stickerRaw = innerContent.substring(stickerStartI);

    const unwrap = (str) => {
        let firstParen = str.indexOf('(');
        let lastParen = str.lastIndexOf(')');
        return str.substring(firstParen + 1, lastParen - 1).trim();
    };

    const textReady = unwrap(textRaw);
    const photoReady = unwrap(photoRaw);
    const stickerReady = unwrap(stickerRaw);

    const newScrollView = `
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

    let assembledDock = dockSection.substring(0, dockContentStart) + newScrollView + '\n' + dockSection.substring(dockSection.lastIndexOf('</View>', dockSection.length - 15));
    // wait, `dockSection.lastIndexOf('</View>'` is the closing of floatingDockContainer.
    // The previous string was `{(showTexts || showPhotos || showStickers) && ( \n <View ...> \n <BlurView/> \n <View dockContent> ... </View> \n </View> \n )}`
    // So dockContent is followed by `</View>\n)}`

    content = content.replace(dockSection, dockSection.substring(0, dockContentStart) + newScrollView + '\n                </View>\n            )}\n\n            ');

    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} catch (e) {
    console.error(e);
}
