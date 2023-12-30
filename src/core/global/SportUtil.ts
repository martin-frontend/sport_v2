// 1 足球
// 4 篮球
// 5 美式足球
// 7 赛马
// 8 赛狗

function isRaceEvent(sport_id: any) {
    return [7, 8, 9].includes(Number(sport_id));
}

// 球类 获取数量不为0的标签
function getTag(navData: any) {
    if (!navData) return "";

    let tag = "inplay";
    if (navData["inplay"]?.num == 0) {
        tag = navData["today"]?.num == 0 ? "future" : "today";
    }
    return tag;
}

const SportUtil = {
    isRaceEvent,
    getTag,
};

export default SportUtil;
