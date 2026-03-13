import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Animated, TouchableOpacity, Keyboard, Platform, PanResponder } from 'react-native';
import { styles } from './DraggableText.styles';
import { useDraggableTextLogic } from './DraggableText.logic';

// FONT_PRESETS 동일 설정 (WriteScreen과 매칭)
const FONT_PRESETS_MAP = {
    'basic': {
        fontFamily: 'GowunDodum_400Regular',
    },
    'diary': {
        fontFamily: 'NanumMyeongjo_400Regular',
        lineHeight: 20,
    },
    'hand': {
        fontFamily: 'SingleDay_400Regular',
        fontSize: 15,
    },
    'y2k': {
        fontFamily: 'NanumPenScript_400Regular',
        fontSize: 17,
    },
    'bebas': {
        fontFamily: 'BebasNeue_400Regular',
        fontSize: 15,
        letterSpacing: 2,
    },
    'dmsans': {
        fontFamily: 'DMSans_400Regular',
        fontSize: 12,
    },
};



export const DraggableText = React.memo(({
    id,
    text,
    fontId = 'basic',
    color = '#37352F',
    bgColor = 'transparent',
    initialX,
    initialY,
    initialRotation,
    initialScale,
    onDelete,
    onDragEnd,
    onTextChange,
    onInteractionStart,
    onInteractionEnd,
    onDragMove,
    onDragDrop,
    onSelect,
    isSelected: externalIsSelected,
    autoFocus = false,
    createdAt,
    bounds,
}) => {
    const [isEditing, setIsEditing] = useState(autoFocus);
    const [localText, setLocalText] = useState(text);
    const inputRef = useRef(null);
    const isNewlyCreated = useRef(autoFocus);
    const blurTimerRef = useRef(null);

    const handleEndEditingProxy = () => {
        handleFinishEditing();
    };

    const { pan, rotation, scale, panResponder, isSelected, setIsSelected, isLongPressActive, lastRotation, currentTransformScale, setMySize, mySize, handleRotateAndScale, handleRotation, handleRotationEnd, renderControls } = useDraggableTextLogic({
        id,
        initialX,
        initialY,
        initialRotation,
        initialScale,
        isEditing,
        onDelete,
        onDragEnd,
        bounds,
        onTap: (id, wasSelected) => {
            if (wasSelected) {
                // 이미 선택된 상태에서 다시 탭하면 수정 모드 진입
                handleEditButtonPress();
            } else {
                // 선택되지 않은 상태에서 탭하면 즉시 선택
                setIsSelected(true);
            }
        },
        onInteractionStart,
        onInteractionEnd,
        onDragMove,
        onDragDrop,
        onSelect,
        isSelected: externalIsSelected,
        createdAt,
    });

    const containerRef = useRef(null);



    // 💡 동적 최대 너비 계산: 캔버스 우측 경계를 넘지 않도록 실시간 줄바꿈 유도
    const canvasWidth = bounds?.width || 350;
    const padding = 16;
    const remainingSpace = pan.x.interpolate({
        inputRange: [0, canvasWidth],
        outputRange: [canvasWidth - padding, 0],
        extrapolate: 'clamp',
    });


    // 레이아웃상의 maxWidth = 남은 공간 / 현재 스케일
    const dynamicMaxWidth = Animated.divide(remainingSpace, scale);

    const currentFontStyle = FONT_PRESETS_MAP[fontId] || FONT_PRESETS_MAP['basic'];

    // autoFocus일 때 선택 상태를 강제로 켜고 포커스 진입
    useEffect(() => {
        if (autoFocus) {
            setIsSelected(true);
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                isNewlyCreated.current = false;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, []);

    // 외부에서 text prop이 바뀌면 동기화
    useEffect(() => {
        if (!isEditing) {
            setLocalText(text);
        }
    }, [text]);

    // 실시간 상태 업데이트 (편집 상태에서 뒤로가기/저장 터치 시 최신 데이터 유지)
    const handleChangeText = (val) => {
        setLocalText(val);
        onTextChange?.(id, val);
    };

    // 편집 완료 처리
    const handleFinishEditing = () => {
        if (blurTimerRef.current) {
            clearTimeout(blurTimerRef.current);
        }
        blurTimerRef.current = setTimeout(() => {
            setIsEditing(false);
            const trimmed = localText.trim();
            if (trimmed.length === 0) {
                onDelete?.(id);
            } else if (trimmed !== localText) {
                setLocalText(trimmed);
                onTextChange?.(id, trimmed);
            }
        }, 100);
    };

    useEffect(() => {
        return () => {
            if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        };
    }, []);

    // 선택 해제 시 편집 모드도 함께 종료
    useEffect(() => {
        if (!isSelected && isEditing && !isNewlyCreated.current) {
            handleFinishEditing();
        }
    }, [isSelected]);

    // ✏️ 수정 버튼 핸들러: 편집 모드 진입
    const handleEditButtonPress = () => {
        setIsEditing(true);
        if (blurTimerRef.current) {
            clearTimeout(blurTimerRef.current);
            blurTimerRef.current = null;
        }
        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };

    // ✏️ 수정 버튼 전용 터치 핸들러: 부모의 드래그를 가로채기 위해 PanResponder 사용
    const editResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true, // 👈 움직임도 가로챔
            onPanResponderTerminationRequest: () => false,  // 👈 💡 절대 뺏기지 않음 (회전 핸들과 동일)
            onPanResponderRelease: () => {
                handleEditButtonPress(); // 👈 뗐을 때 실행
            },
            onShouldBlockNativeResponder: () => true,
        })
    ).current;

    return (
        <Animated.View
            ref={containerRef}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setMySize({ width: width * currentTransformScale.current, height: height * currentTransformScale.current });
            }}
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    left: pan.x,
                    top: pan.y,
                    maxWidth: isEditing ? dynamicMaxWidth : canvasWidth, // 👈 실시간 줄바꿈 적용
                    transform: [
                        {
                            rotate: rotation.interpolate({
                                inputRange: [-360, 360],
                                outputRange: ['-360deg', '360deg']
                            })
                        },
                        { scale }
                    ],
                    transformOrigin: ['0%', '0%', 0]
                },
                isSelected && styles.selected,
            ]}
            pointerEvents={isEditing ? 'box-none' : 'auto'} // 💡 편집 중일 땐 자기 자신(Animated.View)이 터치를 안 삼키도록 함
        >
            <View style={[styles.textWrapper, { backgroundColor: bgColor }]} pointerEvents={isEditing ? 'box-none' : 'auto'}>
                {isEditing ? (
                    <TextInput
                        ref={inputRef}
                        style={[styles.textFormat, styles.textInput, currentFontStyle, { color }]}
                        value={localText}
                        onChangeText={handleChangeText}
                        multiline
                        autoFocus={autoFocus}
                        onBlur={handleFinishEditing}
                        onEndEditing={handleEndEditingProxy}
                        placeholder="여기에 적어보세요..."
                        placeholderTextColor="rgba(0,0,0,0.25)"
                        scrollEnabled={false}
                        blurOnSubmit={false}
                        maxLength={200}
                        pointerEvents="auto" // 💡 편집 중일 땐 무조건 터치를 흡수
                    />
                ) : (
                    <Text style={[styles.textFormat, currentFontStyle, { color }]}>
                        {localText || '탭하여 입력...'}
                    </Text>
                )}
            </View>

            {/* 🕹️ 통합 조작 UI (수정 버튼, 드래그 막대, 회전 핸들 포함) */}
            {renderControls({
                containerRef,
                editOptions: { panHandlers: editResponder.panHandlers }
            })}
        </Animated.View>
    );
});
