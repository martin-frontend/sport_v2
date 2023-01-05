export default class EventDispatcher {
    private eventMap: Array<ListenerVO> = [];

    addEventListener(type: string, listener: any, thisObject: any) {
        if (!this.hasListener(type, listener, thisObject)) {
            this.eventMap.push({ type, listener, thisObject });
        }
    }
    removeEventListener(type: string, listener: any, thisObject: any) {
        const idx = this.eventMap.findIndex((item) => item.type == type && item.listener == listener && item.thisObject == thisObject);
        if (idx >= 0) {
            this.eventMap.splice(idx, 1);
        }
    }
    dispatchEvent(type: string, ...args: any[]) {
        for (const item of this.eventMap) {
            if (item.type == type) {
                item.listener.apply(item.thisObject, args);
            }
        }
    }

    hasListener(type: string, listener: any, thisObject: any): boolean {
        const len = this.eventMap.length;
        for (const item of this.eventMap) {
            if ((item.type == type && item.listener == listener, item.thisObject == thisObject)) {
                return true;
            }
        }
        return false;
    }

    removeAllListeners() {
        this.eventMap.length = 0;
    }
}

export interface ListenerVO {
    type: string;
    listener: any;
    thisObject: any;
}
