export default class PageOrderUnsettledProxy extends puremvc.Proxy {
    static NAME = "PageOrderUnsettledProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
