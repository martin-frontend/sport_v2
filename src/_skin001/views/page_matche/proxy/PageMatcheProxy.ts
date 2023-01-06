export default class PageMatcheProxy extends puremvc.Proxy {
    static NAME = "PageMatcheProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
