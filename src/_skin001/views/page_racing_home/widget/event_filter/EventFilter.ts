import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";
import PageRacingHomeProxy from "../../proxy/PageRacingHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import Assets from "@/_skin001/assets/Assets";

@Component
export default class EventFilter extends AbstractView {
    LangUtil = LangUtil;
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    selectAll = true;
    selectReverse = false;
    selectSport: any = [];
    selectCountry: any = {};
    allCountry: any = {}; // 原数据 对比用
    selectCompetition: any = {};
    allCompetition: any = {}; // 原数据 对比用
    countryIndeterminates: any = {};
    sportIndeterminates: any = {};
    panel: any = {};
    sportPanel: any = [];
    // totalPanel: any = {};
    items = <any>{};
    sportIcon = Assets.SportIcon;

    get curSportId() {
        return this.listQueryComp.sport_id;
    }

    get curTag() {
        return this.listQueryComp.tag;
    }

    get raceSportIds() {
        return this.navProxy.pageData.sportIdArr.filter((id) => SportUtil.isRaceEvent(id));
    }

    getSportNav(sportId: any) {
        return this.navProxy.pageData.new_menu_subnav[sportId];
    }
    getCompetitions(sportId: any) {
        const { tag } = this.listQueryComp;
        return this.getSportNav(sportId)[tag].competitions;
    }

    resetData() {
        this.pageData.selectCompetitionLength = 0;
        this.pageData.allCompetitionLength = 0;
        this.items = {};
        this.selectAll = true;
        this.selectReverse = false;
        this.selectCountry = {};
        this.selectCompetition = {};
        this.allCompetition = {};
        this.countryIndeterminates = {};
        this.sportIndeterminates = {};
        this.panel = {};
        this.sportPanel = [];
        // this.totalPanel = {};
        this.items = {};
    }

    init() {
        this.raceSportIds.forEach((sportId, i) => {
            this.$set(this.panel, sportId, <any>[]);
            this.$set(this.selectCountry, sportId, <any>[]);
            this.$set(this.allCountry, sportId, <any>[]);
            this.$set(this.sportIndeterminates, sportId, false);

            this.selectSport.push(sportId);
            this.sportPanel.push(i);
            this.selectCompetition[sportId] = {};
            this.allCompetition[sportId] = {};
            this.countryIndeterminates[sportId] = {};
            this.items[sportId] = {};

            let index = 0;
            const sportNav = this.getSportNav(sportId);
            const competitions = this.getCompetitions(sportId);
            competitions.forEach((item: any) => {
                let findIndex = -1;
                const findItem = sportNav.all_competition.find((comp: any) => {
                    findIndex = comp.competitions.findIndex((c: any) => c.id == item.id);
                    return findIndex > -1;
                });
                this.selectCountry[sportId].push(findItem.country_code);
                this.allCountry[sportId].push(findItem.country_code);

                if (!this.selectCompetition[sportId][findItem.country_code]) {
                    this.$set(this.selectCompetition[sportId], findItem.country_code, <any>[]);
                    this.$set(this.allCompetition[sportId], findItem.country_code, <any>[]);
                    this.$set(this.countryIndeterminates[sportId], findItem.country_code, false);
                    this.$set(this.items[sportId], findItem.country_code, <any>{
                        ...findItem,
                        competitions: <any>[],
                    });
                    this.panel[sportId].push(index);
                    index++;
                }
                this.items[sportId][findItem.country_code].competitions.push(item);
                this.selectCompetition[sportId][findItem.country_code].push(item.id);
                this.allCompetition[sportId][findItem.country_code].push(item.id);
                this.pageData.selectCompetitionLength++;
                this.pageData.allCompetitionLength++;
            });
            // this.totalPanel[sportId] = [...this.panel[sportId]];
        });
    }

    setData() {
        if (!this.pageData.filterCompetition) return;
        this.raceSportIds.forEach((sportId) => {
            const competition = this.pageData.filterCompetition[sportId];
            if (competition) {
                const selectCompetition = JSON.parse(JSON.stringify(competition));
                Object.keys(selectCompetition).forEach((country_code) => {
                    if (!this.selectCompetition[sportId][country_code]) return;
                    this.pageData.selectCompetitionLength -= this.allCompetition[sportId][country_code].length;
                    this.selectCompetition[sportId][country_code] = [];
                    selectCompetition[country_code]?.forEach((id: any) => {
                        if (this.allCompetition[sportId][country_code].includes(id)) {
                            this.selectCompetition[sportId][country_code].push(id);
                            this.pageData.selectCompetitionLength++;
                        }
                    });
                    this.checkCountry(sportId, country_code);
                    this.checkSport(sportId);
                });
                this.ckeckAll();
            }
        });
    }

    onSave() {
        this.pageData.filterCompetition = JSON.parse(JSON.stringify(this.selectCompetition));
        this.myProxy.api_event_list();
        this.pageData.isShowFilter = false;
    }

    onReverse() {
        this.raceSportIds.forEach((sportId) => {
            Object.keys(this.allCompetition[sportId]).forEach((country_code) => {
                const arr: any = [];
                this.allCompetition[sportId][country_code].forEach((id: any) => {
                    if (!this.selectCompetition[sportId][country_code].includes(id)) {
                        arr.push(id);
                    }
                });
                if (arr.length == 0) {
                    this.selectCountry[sportId] = this.selectCountry[sportId].filter((item: any) => item != country_code);
                } else {
                    if (!this.selectCountry[sportId].includes(country_code)) {
                        this.selectCountry[sportId].push(country_code);
                    }
                }
                this.selectCompetition[sportId][country_code] = arr;
            });
        });
        this.pageData.selectCompetitionLength = this.pageData.allCompetitionLength - this.pageData.selectCompetitionLength;
        this.ckeckAll();
    }

    onCountryClick(sportId: any, country_code: any) {
        const length = this.selectCompetition[sportId][country_code].length;
        const totalLength = this.allCompetition[sportId][country_code].length;

        if (this.selectCountry[sportId].includes(country_code)) {
            this.pageData.selectCompetitionLength += totalLength - length;
            this.selectCompetition[sportId][country_code] = [...this.allCompetition[sportId][country_code]];
        } else {
            this.pageData.selectCompetitionLength -= length;
            this.selectCompetition[sportId][country_code] = [];
        }
        this.countryIndeterminates[sportId][country_code] = false;
        this.ckeckAll();
    }

    onSportClick(sportId: any) {}

    onCompetitionClick(sportId: any, country_code: any, id: any) {
        const length = this.selectCompetition[sportId][country_code].length;
        const totalLength = this.allCompetition[sportId][country_code].length;

        this.pageData.selectCompetitionLength = this.selectCompetition[sportId][country_code].includes(id)
            ? this.pageData.selectCompetitionLength + 1
            : this.pageData.selectCompetitionLength - 1;

        if (length == 0) {
            this.countryIndeterminates[sportId][country_code] = false;
            this.selectCountry[sportId] = this.selectCountry[sportId].filter((item: any) => item != country_code);
        } else {
            if (length == totalLength) {
                this.countryIndeterminates[sportId][country_code] = false;
                if (!this.selectCountry[sportId].includes(country_code)) {
                    this.selectCountry[sportId].push(country_code);
                }
            } else {
                if (!this.selectCountry[sportId].includes(country_code)) {
                    this.selectCountry[sportId].push(country_code);
                }
                this.countryIndeterminates[sportId][country_code] = true;
            }
        }
        this.ckeckAll();
    }

    onAll(val: boolean) {
        this.raceSportIds.forEach((sportId) => {
            this.selectCountry[sportId] = [];
            this.pageData.selectCompetitionLength = val ? this.pageData.allCompetitionLength : 0;
            if (val) {
                Object.keys(this.allCompetition[sportId]).forEach((country_code) => {
                    this.selectCountry[sportId].push(country_code);
                    this.selectCompetition[sportId][country_code] = [...this.allCompetition[sportId][country_code]];
                    this.countryIndeterminates[sportId][country_code] = false;
                });
            } else {
                Object.keys(this.allCompetition).forEach((country_code) => {
                    this.selectCompetition[sportId][country_code] = [];
                    this.countryIndeterminates[sportId][country_code] = false;
                });
            }
        });
    }

    ckeckAll() {
        this.selectAll = this.pageData.selectCompetitionLength == this.pageData.allCompetitionLength;
    }

    checkSport(sportId: any) {
        const countryLength = this.selectCountry[sportId].length;
        const totalCountryLength = this.allCountry[sportId].length;
        if (countryLength > 0 && countryLength < totalCountryLength) {
            this.countryIndeterminates[sportId] = true;
        }
        if (countryLength == 0) {
            this.selectSport = this.selectSport.filter((sport_id: any) => sportId != sport_id);
        }
    }

    checkCountry(sportId: any, country_code: any) {
        const competitionLength = this.selectCompetition[sportId][country_code].length;
        const totalCompetitionLength = this.allCompetition[sportId][country_code].length;
        if (competitionLength > 0 && competitionLength < totalCompetitionLength) {
            this.countryIndeterminates[sportId][country_code] = true;
        }
        if (competitionLength == 0) {
            this.selectCountry[sportId] = this.selectCountry[sportId].filter((countryCode: any) => countryCode != country_code);
        }
    }

    // @Watch("myProxy.pageData.isOpenFilterIndexs")
    // onWatchIsOpenFilterIndexs(val: boolean) {
    //     if (val) {
    //         this.panel = [...this.totalPanel];
    //     } else {
    //         this.panel = [];
    //     }
    // }

    @Watch("curSportId")
    onWatchCurSportId() {
        this.pageData.isShowFilter = false;
    }

    @Watch("curTag")
    onWatchCurTag() {
        this.pageData.isShowFilter = false;
    }

    @Watch("pageData.isShowFilter", { immediate: true })
    onWatchIsShowFilter(val: boolean) {
        if (val) {
            // this.resetData();
            this.init();
            // this.setData();
        }
    }
}
