// 1 足球
// 4 篮球
// 5 美式足球
// 7 赛马
// 8 赛狗

function isRaceEvent(sport_id: any) {
    return [7, 8].includes(Number(sport_id));
}

const SportUtil = {
    isRaceEvent,
};

export default SportUtil;
