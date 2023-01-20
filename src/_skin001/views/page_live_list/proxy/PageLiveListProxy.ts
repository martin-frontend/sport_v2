export default class PageLiveListProxy extends puremvc.Proxy {
    static NAME = "PageLiveListProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
