export default function (proxyClass: any): any {
    const facade = puremvc.Facade.getInstance();
    if (!facade.hasProxy(proxyClass.NAME)) {
        facade.registerProxy(new proxyClass(proxyClass.NAME));
    }
    return facade.retrieveProxy(proxyClass.NAME);
}
