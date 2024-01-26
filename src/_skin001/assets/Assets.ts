const SportIcon: any = {
    1: "football", //足球
    4: "basketball", //篮球
    5: "soccer", //美式足球
    7: "race", //赛马
    8: "greyhound_racing", //赛狗
    9: "harness_racing", //马车赛
};
const SportNameMap = <any>{
    "1": "足球",
    "4": "篮球",
    "5": "美式足球",
    "7": "赛马",
    "8": "赛狗",
    "9": "马车赛",
};
const TagIcon = {
    inplay: "live", //滚球
    today: "today", //今日
    future: "early", //早盘
};
const SportSvga = {
    1: {
        darkActive: "football_01",
        darkInactive: "football_02",
        lightActive: "football_04",
        lightInactive: "football_03",
    },
    4: {
        darkActive: "basketball_01",
        darkInactive: "basketball_02",
        lightActive: "basketball_04",
        lightInactive: "basketball_03",
    },
    5: {
        darkActive: "soccer_01",
        darkInactive: "soccer_02",
        lightActive: "soccer_04",
        lightInactive: "soccer_03",
    },
    7: {
        darkActive: "race_01",
        darkInactive: "race_02",
        lightActive: "race_04",
        lightInactive: "race_03",
    },
    8: {
        darkActive: "greyhound_racing_01",
        darkInactive: "greyhound_racing_02",
        lightActive: "greyhound_racing_04",
        lightInactive: "greyhound_racing_03",
    },
    9: {
        darkActive: "harness_racing_01",
        darkInactive: "harness_racing_02",
        lightActive: "harness_racing_04",
        lightInactive: "harness_racing_03",
    },
};

export default { SportIcon, TagIcon, SportNameMap, SportSvga };
