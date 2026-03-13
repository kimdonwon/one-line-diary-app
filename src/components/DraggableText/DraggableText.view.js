import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Animated, TouchableOpacity, Keyboard, Platform, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from './DraggableText.styles';
import { useDraggableTextLogic } from './DraggableText.logic';
import { RotationHandle } from '../RotationHandle';

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

/**
 * ✏️ 편집 아이콘 (연필 모양)
 */
function EditIcon({ size = 20, color = '#8B7E74' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

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

    const { pan, rotation, scale, panResponder, isSelected, setIsSelected, isLongPressActive, lastRotation, currentTransformScale, setMySize, handleRotateAndScale, handleRotation, handleRotationEnd } = useDraggableTextLogic({
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

    // 💡 버튼 역보정: 부모 스케일에 반비례하여 버튼 크기를 일정하게 유지 (1/x 곡선 근사)
    const handleScale = scale.interpolate({
        inputRange: [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [3.33, 2, 1.428, 1, 0.666, 0.5, 0.333, 0.2],
    });

    const handleOffset = scale.interpolate({
        inputRange: [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-80, -48, -34.28, -24, -16, -12, -8, -4.8], // 화면상 -24px 유지하기 위한 역산
    });
    const dragHandleOffset = scale.interpolate({
        inputRange: [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-120, -72, -51.42, -36, -24, -18, -12, -7.2],
    });

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
                    maxWidth: dynamicMaxWidth, // 👈 실시간 줄바꿈 적용
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

            {/* ✏️ 수정 버튼 (선택 시 좌측 하단에 표시, 편집 모드 아닐 때만) */}
            {isSelected && !isEditing && (

                <Animated.View {...editResponder.panHandlers} style={[
                    styles.editHandle,
                    {
                        left: handleOffset,
                        bottom: handleOffset,
                        transform: [{ scale: handleScale }]
                    }
                ]}>
                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <EditIcon size={20} color="#8B7E74" />
                    </View>
                </Animated.View>
            )}

            {/* 👆 드래그 막대 핸들 (선택 시 하단 중앙에 표시, 편집 모드 아닐 때만) */}
            {isSelected && !isEditing && (
                <Animated.View style={{
                    position: 'absolute',
                    bottom: dragHandleOffset,
                    left: '50%',
                    marginLeft: -20, // width 40의 절반 무조건 중앙 정렬
                    width: 40,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#8B7E74',
                    transform: [{ scale: handleScale }]
                }} />
            )}

            {/* 🔄 회전 핸들 (선택 시 우측 하단에 표시) */}
            {isSelected && (
                <RotationHandle
                    containerRef={containerRef}
                    currentRotation={lastRotation}
                    currentScale={currentTransformScale}
                    onRotateAndScale={handleRotateAndScale}
                    onRotateEnd={handleRotationEnd}
                    onInteractionStart={onInteractionStart}
                    onInteractionEnd={onInteractionEnd}
                    style={{
                        right: handleOffset,
                        bottom: handleOffset,
                        transform: [{ scale: handleScale }]
                    }}
                />
            )}
        </Animated.View>
    );
});
