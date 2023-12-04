export default class PageRacingDetailProxy extends puremvc.Proxy {
    static NAME = "PageRacingDetailProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
