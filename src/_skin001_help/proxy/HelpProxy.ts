import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";
export default class HelpProxy extends puremvc.Proxy {
    static NAME = "HelpProxy";

    onRegister() {
    
    }
    panelIdxs=[<any>[],<any>[],<any>[],<any>[]];
    isloadSecLang = false;
    pageData = {
        tabIndex: 1,
        searchTxt: "",
        list:<any>[],
        pageInfo:{pageCurrent: 1, pageCount: 1, pageSize: 1, pageTotal: 1},
        type:<any>[[],[],[],[]]
    };

    api_helpcenter_list() {
        this.sendNotification(net.HttpType.api_helpcenter_list);
    }
    set_helpcenter_list(data:any){
        Object.assign(this.pageData,data)
        let idx = 0;
        for (let i of this.pageData.list){
            const typetemp = this.pageData.type.find((item:any) => item.id == i.type);
            typetemp.list = typetemp.list || [];
            typetemp.list.push(i);
            

        }
        for (let i of this.pageData.type){
            const idxs = i.list.map((k: any, i: number) => i);
            this.panelIdxs[idx] = idxs;
            idx++;
        }
        console.group("set_helpcenter_list>>>> ", "color:#0f0;");
        console.log(JSON.parse(JSON.stringify(this.pageData)));
        console.groupEnd();
        setTimeout(() => {
            this.panelIdxs=[[],[],[],[]];
        }, 1);
        setTimeout(() => {
            this.isloadSecLang = true;
        }, 25);
        
    }
    insetType1(data:any){
        
    }
}
