export default class MyBetProxy extends puremvc.Proxy {
    static NAME = "MyBetProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
