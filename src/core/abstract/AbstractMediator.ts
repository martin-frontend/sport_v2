export default class AbstractMediator extends puremvc.Mediator {
    setViewComponent(viewComponent: any) {
        super.setViewComponent(viewComponent);
        this.initViewData();
    }

    protected initViewData() {
        // 子类实现
    }

    getProxy(proxyClass: any): any {
        if (!this.facade.hasProxy(proxyClass.NAME)) {
            this.facade.registerProxy(new proxyClass(proxyClass.NAME));
        }
        return this.facade.retrieveProxy(proxyClass.NAME);
    }
}
