import React from 'react';
import {
    FrogSticker,
    StrawberrySticker,
    CatSticker,
    BearSticker,
    CherrySticker,
    CloudSticker,
    DaisySticker,
    PizzaSticker,
    AvocadoSticker,
    SparkleSticker
} from './DoodleStickers';

// 텍스트 기반 이모지/카옴모지 스티커
export const TEXT_STICKERS = [
    "✨", "🎀", "🎧", "🍀", "🍓", "🧸", "🍒", "🎨", "🍭", "🧁", "🥞",
];

// 그래픽(SVG) 기반 커스텀 브랜드 스티커
export const GRAPHIC_STICKERS = [
    { key: 'frog', Component: FrogSticker, label: ':frog:' },
    { key: 'strawberry', Component: StrawberrySticker, label: ':strawberry:' },
    { key: 'bear', Component: BearSticker, label: ':bear:' },
    { key: 'cherry', Component: CherrySticker, label: ':cherry:' },
    { key: 'cloud', Component: CloudSticker, label: ':cloud:' },
    { key: 'daisy', Component: DaisySticker, label: ':daisy:' },
    { key: 'pizza', Component: PizzaSticker, label: ':pizza:' },
    { key: 'avocado', Component: AvocadoSticker, label: ':avocado:' },
    { key: 'sparkle', Component: SparkleSticker, label: ':sparkle:' },
];
