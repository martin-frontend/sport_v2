import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HelpMediator from "../mediator/HelpMediator";
import HelpProxy from "../proxy/HelpProxy";
import LangUtil from "@/_skin001_help/core/config/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { getQueryVariable } from "@/core/global/Functions";
import Http from "@/core/Http";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import LangConfig from "../core/config/LangConfig";
import { watch } from "vue";
//import { marked } from "marked";

@Component
export default class Help extends AbstractView {
    LangUtil = LangUtil;
    // marked = marked;
    myProxy: HelpProxy = this.getProxy(HelpProxy);
    pageData = this.myProxy.pageData;
    titleRef = new Map();
    contentRef = new Map();
    showPanel = false;

    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
        token: getQueryVariable("t") || "",
    };
    oldSearchTxt = "";

    constructor() {
        super(HelpMediator);
    }

    mounted() {

        const { lang, plat_id, timezone, token } = this.form;

        Http.post(net.HttpType.public_plat_config, { plat_id, timezone, lang }).then((response: any) => {
            PlatConfig.config = response.data;
            GlobalVar.plat_id = plat_id?.toString() || "";
            GlobalVar.zone = timezone?.toString() || "";
            GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            GlobalVar.lang = lang;
            const sTime = GlobalVar.server_time;
            LangConfig.load(this.form.lang).then(() => {

                this.myProxy.api_helpcenter_list();
                GlobalVar.token = token;


            })

        })

    }
    @Watch("myProxy.isloadSecLang")
    onWatchLoadfinish() {
        if (this.myProxy.isloadSecLang) {
            const refs = this.$refs
            for (const key of Object.keys(refs)) {

                if (key.indexOf("tabIndex") != -1) {
                    this.titleRef.set(key, refs[key]);
                }
                if (key.indexOf("tabcontent") != -1) {
                    this.contentRef.set(key, refs[key]);

                }
            }
        }
    }
    @Watch("pageData.searchTxt")
    onWatchSearch() {
        if (this.pageData.searchTxt == this.oldSearchTxt) {
            return
        }
        let needshowtabIndex = -1;
        let needshowcontentidx = -1
        let hasfindTitle = false;
        for (const item of this.titleRef.entries()) {
            const key = item[0];
            const value = item[1]
            const Text = value[0]?.innerText;
            const findidx = Text.indexOf(this.pageData.searchTxt)
            if (findidx != -1 && this.pageData.searchTxt) {
                const keyarr = <any[]>key.split("-")
                keyarr[1] = Number(keyarr[1]) //tabIndex第几个页签从0开始
                keyarr[2] = Number(keyarr[2])//当前页签的第几个item
                if (needshowtabIndex == -1) {
                    hasfindTitle = true;
                    this.pageData.tabIndex = keyarr[1] + 1;
                    needshowtabIndex = keyarr[1] + 1;
                }

            }
            this.replacetitle(value[0])
        }
        if (!hasfindTitle) {
            for (const item of this.contentRef.entries()) {
                const key = item[0];
                const value = item[1]
                const Text = value[0]?.$el.innerText;
                const findidx = Text.indexOf(this.pageData.searchTxt)
                if (findidx != -1 && this.pageData.searchTxt) {
                    const keyarr = <any[]>key.split("-")
                    keyarr[1] = Number(keyarr[1]) //tabIndex第几个页签从0开始
                    keyarr[2] = Number(keyarr[2])//当前页签的第几个item
                    if (needshowtabIndex == -1) {

                        this.pageData.tabIndex = keyarr[1] + 1;
                        needshowtabIndex = keyarr[1] + 1;
                        needshowcontentidx = keyarr[2];
                    }
                    if (this.oldSearchTxt != this.pageData.searchTxt) {
                        const panelidx = <any[]>this.myProxy.panelIdxs[(keyarr[1])]
                        if (panelidx.every((value: any, inex: number) => value != keyarr[2])) {
                            panelidx.push(keyarr[2])
                        }
                    }


                }
                this.replace(value[0].$el)
            }
            if (needshowtabIndex == -1 && needshowcontentidx == -1 && this.pageData.searchTxt) {
                this.pageData.tabIndex = 0;
            }

        }



        this.oldSearchTxt = this.pageData.searchTxt;

    }
    replacetitle(value: any) {

        if (this.oldSearchTxt) {
            const findidx = value.innerText.indexOf(this.oldSearchTxt)

            if (findidx != -1 && this.oldSearchTxt) {
                value.innerHTML = value.innerHTML.replaceAll(
                    `<span style="background-color:rgb(27, 121, 242); color:white">${this.oldSearchTxt}</span>`,
                    this.oldSearchTxt
                );

            }

        }
        if (this.pageData.searchTxt) {
            const findidx = value.innerText.indexOf(this.pageData.searchTxt)

            if (findidx != -1 && this.pageData.searchTxt) {
                value.innerHTML = value.innerHTML.replaceAll(
                    this.pageData.searchTxt,
                    `<span style="background-color:rgb(27, 121, 242); color:white">${this.pageData.searchTxt}</span>`
                    
                );

            }

        }

    }

    replace(value: any) {

        if (this.oldSearchTxt) {
            const findidx = value.innerText.indexOf(this.oldSearchTxt)

            if (findidx != -1 && this.oldSearchTxt) {
                value.innerHTML = value.innerHTML.replaceAll(
                    `<span style="background-color:rgb(27, 121, 242); color:white">${this.oldSearchTxt}</span>`,
                    this.oldSearchTxt
                );

            }

        }
        if (this.pageData.searchTxt) {
            const string = value.innerHTML;
            const pattern =  />([^<>\n&]+?)</g;
            const matches = string.match(pattern);
            const result = [];
            if (matches) {
                for (const match of matches) {
                    let res = match.replace(pattern, '$1')
                    const findidx = res.indexOf(this.pageData.searchTxt)
                    if (findidx != -1 && this.oldSearchTxt) {
                        const replaceres = res.replaceAll(
                            this.pageData.searchTxt,
                            `<span style="background-color:rgb(27, 121, 242); color:white">${this.pageData.searchTxt}</span>`
                        );
                        value.innerHTML = value.innerHTML.replaceAll(
                            res,
                            replaceres
                        );
                    }
                    
                }
               
            } 
            // for (let res of result) {
            //     const replaceres = res.replaceAll(
            //         this.pageData.searchTxt,
            //         `<span style="background-color:rgb(27, 121, 242); color:white">${this.pageData.searchTxt}</span>`
            //     );
            //     value.innerHTML = value.innerHTML.replaceAll(
            //         res,
            //         replaceres
            //     );
            // }

        }

    }


    @Watch("pageData.tabIndex")
    onWatchTabIndex() {
        setTimeout(() => {
            this.onWatchSearch();
        }, 200);
    }

    clickTopbtn(id: any) {
        this.pageData.tabIndex = id;
        if (id > 3) {
            const el = document.getElementById("btnsheet")
            if (el) {
                el.scrollLeft = 100
            }

        } else if (id == 1) {
            const el = document.getElementById("btnsheet")
            if (el) {
                el.scrollLeft = 0
            }
        }
    }
    destroyed() {
        super.destroyed();
    }
}
