export default class SettingProxy extends puremvc.Proxy {
    static NAME = "SettingProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
    };
}
