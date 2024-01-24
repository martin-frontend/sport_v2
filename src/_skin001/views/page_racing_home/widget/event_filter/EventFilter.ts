import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";
import PageRacingHomeProxy from "../../proxy/PageRacingHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import Assets from "@/_skin001/assets/Assets";
import PageHomeProxy from "@/_skin001/views/page_home/proxy/PageHomeProxy";
import page_racing_home from "../..";

@Component
export default class EventFilter extends AbstractView {
    LangUtil = LangUtil;
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
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
    isRaceEvent = SportUtil.isRaceEvent;

    get curSportId() {
        return this.homeProxy.listQueryComp.sport_id;
    }

    get curTag() {
        return this.listQueryComp.tag;
    }

    get sportIds() {
        return this.navProxy.pageData.sportIdArr.filter((id) => this.myProxy.sportCheckBoxArr.includes(`${id}`));
    }

    getSportNav(sportId: any) {
        return this.navProxy.pageData.new_menu_subnav[sportId];
    }

    getCompetitions(sportId: any) {
        const { tag } = this.listQueryComp;
        if (!tag) return [];
        return this.getSportNav(sportId)[tag].competitions;
    }

    resetData() {
        this.pageData.selectCompetitionLength = 0;
        this.pageData.allCompetitionLength = 0;
        this.selectAll = true;
        this.selectReverse = false;
        this.selectSport = [];
        this.selectCountry = {};
        this.allCountry = {};
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
        this.resetData();
        this.sportIds.forEach((sportId: any, i: number) => {
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
                if (!this.selectCountry[sportId].includes(findItem.country_code)) {
                    this.selectCountry[sportId].push(findItem.country_code);
                    this.allCountry[sportId].push(findItem.country_code);
                }

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
        this.sportIds.forEach((sportId: any) => {
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
        this.myProxy.sportCheckBoxArr = this.selectSport.map((sportId: number) => sportId.toString());
        page_racing_home.showBySport(this.selectSport.toString(), this.curTag);
        // this.myProxy.api_event_list();
        this.pageData.isShowFilter = false;
    }

    onReverse() {
        this.sportIds.forEach((sportId: any) => {
            Object.keys(this.allCompetition[sportId]).forEach((country_code) => {
                const arr: any = [];
                this.allCompetition[sportId][country_code].forEach((id: any) => {
                    if (!this.selectCompetition[sportId][country_code].includes(id)) {
                        arr.push(id);
                    }
                });
                this.selectCompetition[sportId][country_code] = arr;
                this.checkCountry(sportId, country_code);
            });
            this.checkSport(sportId);
        });
        this.pageData.selectCompetitionLength = this.pageData.allCompetitionLength - this.pageData.selectCompetitionLength;
        this.ckeckAll();
    }

    onCountryClick(sportId: any, country_code: any) {
        const checkBoxVal = this.selectCountry[sportId].includes(country_code);

        const length = this.selectCompetition[sportId][country_code].length;
        const totalLength = this.allCompetition[sportId][country_code].length;
        if (checkBoxVal) {
            this.pageData.selectCompetitionLength += totalLength - length;
        } else {
            this.pageData.selectCompetitionLength -= length;
        }
        this.selectCompetition[sportId][country_code] = checkBoxVal ? [...this.allCompetition[sportId][country_code]] : [];

        this.countryIndeterminates[sportId][country_code] = false;

        // check順序 sport => all
        this.checkSport(sportId);
        this.ckeckAll();
    }

    onSportClick(sportId: any) {
        const checkBoxVal = this.selectSport.includes(sportId);

        this.allCountry[sportId].forEach((country_code: any) => {
            const length = this.selectCompetition[sportId][country_code].length;
            const totalLength = this.allCompetition[sportId][country_code].length;

            if (checkBoxVal) {
                this.pageData.selectCompetitionLength += totalLength - length;
            } else {
                this.pageData.selectCompetitionLength -= length;
            }
            this.selectCompetition[sportId][country_code] = [...this.allCompetition[sportId][country_code]];
            this.selectCompetition[sportId][country_code] = checkBoxVal ? [...this.allCompetition[sportId][country_code]] : [];

            this.checkCountry(sportId, country_code);
        });
        this.sportIndeterminates[sportId] = false;

        this.ckeckAll();
    }

    onCompetitionClick(sportId: any, country_code: any, id: any) {
        const ckeckBoxVal = this.selectCompetition[sportId][country_code].includes(id);

        this.pageData.selectCompetitionLength = ckeckBoxVal
            ? this.pageData.selectCompetitionLength + 1
            : this.pageData.selectCompetitionLength - 1;

        // check順序 country => sport => all
        this.checkCountry(sportId, country_code);
        this.checkSport(sportId);
        this.ckeckAll();
    }

    onAll(val: boolean) {
        this.sportIds.forEach((sportId: any) => {
            this.selectCountry[sportId] = [];
            this.pageData.selectCompetitionLength = val ? this.pageData.allCompetitionLength : 0;

            Object.keys(this.allCompetition[sportId]).forEach((country_code) => {
                this.selectCompetition[sportId][country_code] = val ? [...this.allCompetition[sportId][country_code]] : [];
                this.checkCountry(sportId, country_code);
            });
            this.checkSport(sportId);
        });
    }

    ckeckAll() {
        this.selectAll = this.pageData.selectCompetitionLength == this.pageData.allCompetitionLength;
    }

    checkSport(sportId: any) {
        const countryLength = this.selectCountry[sportId].length;
        const totalCountryLength = this.allCountry[sportId].length;

        if (Object.values(this.countryIndeterminates[sportId]).includes(true)) {
            this.sportIndeterminates[sportId] = true;
        } else {
            this.sportIndeterminates[sportId] = countryLength > 0 && countryLength < totalCountryLength;
        }

        if (countryLength > 0) {
            if (!this.selectSport.includes(sportId)) {
                this.selectSport.push(sportId);
            }
        } else {
            this.selectSport = this.selectSport.filter((sport_id: any) => sportId != sport_id);
        }
    }

    checkCountry(sportId: any, country_code: any) {
        const competitionLength = this.selectCompetition[sportId][country_code].length;
        const totalCompetitionLength = this.allCompetition[sportId][country_code].length;

        this.countryIndeterminates[sportId][country_code] = competitionLength > 0 && competitionLength < totalCompetitionLength;

        if (competitionLength > 0) {
            if (!this.selectCountry[sportId].includes(country_code)) {
                this.selectCountry[sportId].push(country_code);
            }
        } else {
            this.selectCountry[sportId] = this.selectCountry[sportId].filter((countryCode: any) => countryCode != country_code);
        }
    }

    @Watch("curSportId")
    onWatchCurSportId() {
        this.pageData.isShowFilter = false;
        this.pageData.filterCompetition = {};
    }

    @Watch("curTag")
    onWatchCurTag() {
        this.pageData.isShowFilter = false;
        this.pageData.filterCompetition = {};
        this.init();
    }

    @Watch("pageData.isShowFilter", { immediate: true })
    onWatchIsShowFilter() {
        this.init();
        this.setData();
    }

    @Watch("sportIds", { deep: true })
    onWatchSportIds() {
        if (this.pageData.filterCompetition) {
            Object.keys(this.pageData.filterCompetition).forEach((sportId) => {
                if (!this.sportIds.includes(Number(sportId))) {
                    delete this.pageData.filterCompetition[sportId];
                }
            });
        }
        this.init();
        this.setData();
    }

    destroyed() {
        this.pageData.isShowFilter = false;
    }
}
