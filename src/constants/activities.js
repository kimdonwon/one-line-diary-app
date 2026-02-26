// 🍰 활동 데이터 정의
// 각 활동의 키, 라벨, 아이콘(이모지), 파스텔 색상
// hasTitle: 제목/이름을 입력할 수 있는 활동

export const ACTIVITIES = [
    { key: 'reading', label: '독서', color: '#B5D8A0', character: 'bear', hasTitle: true, titlePlaceholder: '어떤 책을 읽었나요?' },
    { key: 'video', label: '영상', color: '#A8C8F0', character: 'cat', hasTitle: true, titlePlaceholder: '어떤 영상을 보았나요?' },
    { key: 'study', label: '공부', color: '#FFD485', character: 'octopus', hasTitle: true, titlePlaceholder: '어떤 공부를 했나요?' },
    { key: 'date', label: '데이트', color: '#FFB5B5', character: 'frog', hasTitle: false },
    { key: 'game', label: '게임', color: '#C4A8F0', character: 'chick', hasTitle: true, titlePlaceholder: '어떤 게임을 즐겼나요?' },
    { key: 'social', label: '친목', color: '#F5C08A', character: 'bear', hasTitle: false },
    { key: 'exercise', label: '운동', color: '#8DD4C8', character: 'frog', hasTitle: true, titlePlaceholder: '어떤 운동을 했나요?' },
];

export function getActivityByKey(key) {
    return ACTIVITIES.find(a => a.key === key) || ACTIVITIES[0];
}
