export default class PageHomeProxy extends puremvc.Proxy {
    static NAME = "PageHomeProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
