export default class PageRacingHomeProxy extends puremvc.Proxy {
    static NAME = "PageRacingHomeProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
