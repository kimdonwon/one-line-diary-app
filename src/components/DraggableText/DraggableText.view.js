import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, Animated, TouchableOpacity, Keyboard, Platform } from 'react-native';
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
        lineHeight: 28,
    },
    'hand': {
        fontFamily: 'SingleDay_400Regular',
        fontSize: 22,
    },
    'y2k': {
        fontFamily: 'NanumPenScript_400Regular',
        fontSize: 24,
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
    autoFocus = false,
}) => {
    const [isEditing, setIsEditing] = useState(autoFocus);
    const [localText, setLocalText] = useState(text);
    const inputRef = useRef(null);
    const isNewlyCreated = useRef(autoFocus); // 새로 생성되었는지 추적
    const blurTimerRef = useRef(null); // blur 디바운스 타이머

    // 편집 모드 중에도 드래그를 허용하기 위해 onFocus 시점에 handleEditTap 대신 탭 판단 수행
    const handleEndEditingProxy = () => {
        handleFinishEditing();
    };

    const { pan, rotation, scale, panResponder, isSelected, setIsSelected, lastRotation, currentTransformScale, handleRotateAndScale, handleRotation, handleRotationEnd } = useDraggableTextLogic({
        id,
        initialX,
        initialY,
        initialRotation,
        initialScale,
        isEditing,
        onDelete,
        onDragEnd,
        onTap: (id, wasSelected) => {
            // 이미 선택된 상태에서 다시 짧게 탭하면 편집 모드 진입
            if (wasSelected) {
                handleEditTap();
                // 팁: DraggableText가 편집 모드로 들어가면 useDraggable 내부에서 
                // isEditing=true 상태가 되어 드래그 등이 비활성화됨
                setIsSelected(true); // 편집 모드일 땐 항상 선택 유지
            }
        },
        onInteractionStart,
        onInteractionEnd,
    });

    const containerRef = useRef(null);

    // 폰트 스타일 매핑
    const currentFontStyle = FONT_PRESETS_MAP[fontId] || FONT_PRESETS_MAP['basic'];

    // autoFocus일 때 선택 상태를 강제로 켜고 포커스 진입
    useEffect(() => {
        if (autoFocus) {
            setIsSelected(true);
            // 약간의 딜레이 후 포커스 (렌더링 안정화 대기)
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                isNewlyCreated.current = false; // 포커스 완료 후 신규 생성 플래그 해제
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

    // 편집 완료 처리
    const handleFinishEditing = () => {
        // blur 디바운스 (연속 blur 이벤트 방지)
        if (blurTimerRef.current) {
            clearTimeout(blurTimerRef.current);
        }
        blurTimerRef.current = setTimeout(() => {
            setIsEditing(false);
            const trimmed = localText.trim();
            if (trimmed.length === 0) {
                // 빈 텍스트이면 삭제
                onDelete?.(id);
            } else if (trimmed !== text) {
                // 변경되었으면 업데이트
                onTextChange?.(id, trimmed);
            }
        }, 100); // 100ms 디바운스 (포커스 전환 시 너무 빨리 삭제되는 것 방지)
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        };
    }, []);

    // 선택 해제 시 편집 모드도 함께 종료 (단, 새로 생성 직후가 아닐 때만)
    useEffect(() => {
        if (!isSelected && isEditing && !isNewlyCreated.current) {
            handleFinishEditing();
        }
    }, [isSelected]);

    // 선택된 상태에서 한번 더 탭 → 편집 모드 진입
    const handleEditTap = () => {
        if (isSelected && !isEditing) {
            setIsEditing(true);
            // blur 타이머가 있으면 취소 (편집 모드로 전환 중이니까)
            if (blurTimerRef.current) {
                clearTimeout(blurTimerRef.current);
                blurTimerRef.current = null;
            }
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    };

    return (
        <Animated.View
            ref={containerRef}
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        {
                            rotate: rotation.interpolate({
                                inputRange: [-360, 360],
                                outputRange: ['-360deg', '360deg']
                            })
                        },
                        { scale }
                    ]
                },
                isSelected && styles.selected,
            ]}
        >
            <View style={[styles.textWrapper, { backgroundColor: bgColor }]}>
                {isEditing ? (
                    <TextInput
                        ref={inputRef}
                        style={[styles.textFormat, styles.textInput, currentFontStyle, { color }]}
                        value={localText}
                        onChangeText={setLocalText}
                        multiline
                        autoFocus={autoFocus}
                        onBlur={handleFinishEditing}
                        onEndEditing={handleEndEditingProxy} // proxy 함수 사용으로 안정성 확보
                        placeholder="여기에 적어보세요..."
                        placeholderTextColor="rgba(0,0,0,0.25)"
                        scrollEnabled={false}
                        blurOnSubmit={false}
                    />
                ) : (
                    <Text style={[styles.textFormat, currentFontStyle, { color }]}>
                        {localText || '탭하여 입력...'}
                    </Text>
                )}
            </View>

            {/* 🔄 회전 핸들 (선택 시 표시) */}
            {isSelected && (
                <RotationHandle
                    containerRef={containerRef}
                    currentRotation={lastRotation}
                    currentScale={currentTransformScale}
                    onRotateAndScale={handleRotateAndScale}
                    onRotateEnd={handleRotationEnd}
                    onInteractionStart={onInteractionStart}
                    onInteractionEnd={onInteractionEnd}
                />
            )}
        </Animated.View>
    );
});
