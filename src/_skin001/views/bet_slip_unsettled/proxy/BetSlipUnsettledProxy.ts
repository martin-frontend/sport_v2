export default class BetSlipUnsettledProxy extends puremvc.Proxy {
    static NAME = "BetSlipUnsettledProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
