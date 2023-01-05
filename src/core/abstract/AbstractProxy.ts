export default class AbstractProxy extends puremvc.Proxy {
    getProxy(proxyClass: any): any {
        if (!this.facade.hasProxy(proxyClass.NAME)) {
            this.facade.registerProxy(new proxyClass(proxyClass.NAME));
        }
        return this.facade.retrieveProxy(proxyClass.NAME);
    }
}
