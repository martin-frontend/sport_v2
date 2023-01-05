import { Vue } from "vue-property-decorator";
import { js_utils } from "custer-js-utils";

export default class AbstractView extends Vue {
    private facade = puremvc.Facade.getInstance();
    private mediatorName!: string;
    private eventMaps: any = {};

    constructor(mediatorClass?: any) {
        super();
        if (mediatorClass) {
            this.mediatorName = js_utils.generateUUID();
            const mediator = new mediatorClass(this.mediatorName);
            mediator.setViewComponent(this);
            this.facade.registerMediator(mediator);
        }
    }

    addEventListener(type: string, listener: any, thisObject: any) {
        if (!this.eventMaps[type]) {
            this.eventMaps[type] = [];
        }
        for (const item of this.eventMaps[type]) {
            if (item.listener === listener && item.thisObject === thisObject) {
                return;
            }
        }
        this.eventMaps[type].push({ listener, thisObject });
    }

    removeEventListener(type: string, listener: any, thisObject: any) {
        if (this.eventMaps[type]) {
            for (const item of this.eventMaps[type]) {
                if (item.listener === listener && item.thisObject === thisObject) {
                    const idx = this.eventMaps[type].indexOf(item);
                    this.eventMaps[type].splice(idx, 1);
                    return;
                }
            }
        }
    }

    dispatchEvent(type: string, data?: any) {
        if (this.eventMaps[type]) {
            for (const item of this.eventMaps[type]) {
                item.listener.apply(item.thisObject, [data]);
            }
        }
    }

    getProxy(proxyClass: any): any {
        if (!this.facade.hasProxy(proxyClass.NAME)) {
            this.facade.registerProxy(new proxyClass(proxyClass.NAME));
        }
        return this.facade.retrieveProxy(proxyClass.NAME);
    }

    destroyed() {
        if (this.mediatorName) {
            this.facade.removeMediator(this.mediatorName);
        }
    }
}
