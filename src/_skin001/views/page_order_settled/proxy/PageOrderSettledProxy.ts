export default class PageOrderSettledProxy extends puremvc.Proxy {
    static NAME = "PageOrderSettledProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
