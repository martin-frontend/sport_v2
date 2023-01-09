export default class BetSlipSettledProxy extends puremvc.Proxy {
    static NAME = "BetSlipSettledProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
