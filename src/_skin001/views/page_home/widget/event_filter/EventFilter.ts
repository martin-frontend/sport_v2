import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class EventFilter extends AbstractView {
    LangUtil = LangUtil;
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    selectAll = true;
    selectReverse = false;
    selectCountry: any = [];
    selectCompetition: any = {};
    allCompetition: any = {}; // 原数据 对比用
    indeterminates: any = {};
    panel: number[] = [];
    totalPanel: number[] = [];
    isRaceEvent = SportUtil.isRaceEvent;

    get curSportId() {
        return this.listQueryComp.sport_id;
    }

    get curTag() {
        return this.listQueryComp.tag;
    }

    get tagName() {
        const { tag } = this.listQueryComp;
        if (tag) {
            if (["inplay", "today", "future"].includes(tag)) {
                return this.curSportNav[tag].name;
            } else {
                const findItem = this.curSportNav.tags.find((item: any) => item.tag == tag);
                return findItem.name;
            }
        }
        return "";
    }

    get curSportNav() {
        return this.navProxy.pageData.new_menu_subnav[this.curSportId];
    }

    get curCompetitions() {
        const { tag } = this.listQueryComp;
        if (tag) {
            if (["inplay", "today", "future"].includes(tag)) {
                return this.curSportNav[tag].competitions;
            } else {
                const findItem = this.curSportNav.tags.find((item: any) => item.tag == tag);
                return findItem.competitions;
            }
        }
        return [];
    }

    resetData() {
        this.pageData.selectCompetitionLength = 0;
        this.pageData.allCompetitionLength = 0;
        this.selectAll = true;
        this.selectReverse = false;
        this.selectCountry = [];
        this.selectCompetition = {};
        this.allCompetition = {}; // 该标签下的所有联赛
        this.indeterminates = {};
        this.panel = [];
        this.totalPanel = [];
    }

    init() {
        this.resetData();
        let index = 0;
        this.curCompetitions.forEach((item: any) => {
            let findIndex = -1;
            const findItem = this.curSportNav?.all_competition.find((comp: any) => {
                findIndex = comp.competitions.findIndex((c: any) => c.id == item.id);
                return findIndex > -1;
            });

            this.selectCountry.push(findItem.country_code);
            if (!this.selectCompetition[findItem.country_code]) {
                this.$set(this.selectCompetition, findItem.country_code, <any>[]);
                this.$set(this.allCompetition, findItem.country_code, <any>[]);
                this.$set(this.indeterminates, findItem.country_code, false);
                this.panel.push(index);
                index++;
            }
            this.selectCompetition[findItem.country_code].push(item.id);
            this.allCompetition[findItem.country_code].push(item.id);
            this.pageData.selectCompetitionLength++;
            this.pageData.allCompetitionLength++;
        });
        this.totalPanel = [...this.panel];
    }

    setData() {
        if (this.pageData.filterCompetition) {
            const selectCompetition = JSON.parse(JSON.stringify(this.pageData.filterCompetition));
            Object.keys(selectCompetition).forEach((country_code) => {
                if (!this.selectCompetition[country_code]) return;
                this.pageData.selectCompetitionLength -= this.allCompetition[country_code].length;
                this.selectCompetition[country_code] = [];
                selectCompetition[country_code]?.forEach((id: any) => {
                    if (this.allCompetition[country_code].includes(id)) {
                        this.selectCompetition[country_code].push(id);
                        this.pageData.selectCompetitionLength++;
                    }
                });
                this.checkCountry(country_code);
            });
            this.ckeckAll();
        }
    }

    onSave() {
        this.pageData.filterCompetition = JSON.parse(JSON.stringify(this.selectCompetition));
        this.myProxy.api_event_list();
        this.pageData.isShowFilter = false;
    }

    onReverse() {
        Object.keys(this.allCompetition).forEach((country_code) => {
            const arr: any = [];
            this.allCompetition[country_code].forEach((id: any) => {
                if (!this.selectCompetition[country_code].includes(id)) {
                    arr.push(id);
                }
            });
            this.selectCompetition[country_code] = arr;
            this.checkCountry(country_code);
        });

        this.pageData.selectCompetitionLength = this.pageData.allCompetitionLength - this.pageData.selectCompetitionLength;
        this.ckeckAll();
    }

    onCountryClick(country_code: any) {
        const checkBoxVal = this.selectCountry.includes(country_code);

        const length = this.selectCompetition[country_code].length;
        const totalLength = this.allCompetition[country_code].length;

        if (checkBoxVal) {
            this.pageData.selectCompetitionLength += totalLength - length;
        } else {
            this.pageData.selectCompetitionLength -= length;
        }

        this.selectCompetition[country_code] = checkBoxVal ? [...this.allCompetition[country_code]] : [];

        this.indeterminates[country_code] = false;

        this.ckeckAll();
    }

    onCompetitionClick(country_code: any, id: any) {
        const checkBoxVal = this.selectCompetition[country_code].includes(id);

        this.pageData.selectCompetitionLength = checkBoxVal
            ? this.pageData.selectCompetitionLength + 1
            : this.pageData.selectCompetitionLength - 1;

        this.checkCountry(country_code);
        this.ckeckAll();
    }

    onAll(val: boolean) {
        this.selectCountry = [];
        this.pageData.selectCompetitionLength = val ? this.pageData.allCompetitionLength : 0;
        if (val) {
            Object.keys(this.allCompetition).forEach((country_code) => {
                this.selectCountry.push(country_code);
                this.selectCompetition[country_code] = [...this.allCompetition[country_code]];
                this.indeterminates[country_code] = false;
            });
        } else {
            Object.keys(this.allCompetition).forEach((country_code) => {
                this.selectCompetition[country_code] = [];
                this.indeterminates[country_code] = false;
            });
        }
    }

    checkCountry(country_code: any) {
        const competitionLength = this.selectCompetition[country_code].length;
        const totalCompetitionLength = this.allCompetition[country_code].length;

        this.indeterminates[country_code] = competitionLength > 0 && competitionLength < totalCompetitionLength;

        if (competitionLength > 0) {
            if (!this.selectCountry.includes(country_code)) {
                this.selectCountry.push(country_code);
            }
        } else {
            this.selectCountry = this.selectCountry.filter((countryCode: any) => countryCode != country_code);
        }
    }

    ckeckAll() {
        this.selectAll = this.pageData.selectCompetitionLength == this.pageData.allCompetitionLength;
    }

    @Watch("myProxy.pageData.isOpenFilterIndexs")
    onWatchIsOpenFilterIndexs(val: boolean) {
        if (val) {
            this.panel = [...this.totalPanel];
        } else {
            this.panel = [];
        }
    }

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
            this.init();
            this.setData();
        }
    }

    destroyed() {
        this.pageData.isShowFilter = false;
    }
}
