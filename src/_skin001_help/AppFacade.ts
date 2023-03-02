import net from "@/net/setting";
import NetObserver from "@/proxy/NetObserver";
import GlobalVar from "@/core/global/GlobalVar";
import RequestStartCMD from "../_skin001/command/RequestStartCMD";
import RequestEndCMD from "../_skin001/command/RequestEndCMD";
import RequestErrorCMD from "../_skin001/command/RequestErrorCMD";

export default class AppFacade {
    private static inst: AppFacade;
    static getInstance(): AppFacade {
        return this.inst || (this.inst = new AppFacade());
    }

    private facade = puremvc.Facade.getInstance();

    startup() {
        GlobalVar.loading = true;
        net.initCommand();
        this.initCommand();
        this.initMediator();
      //  this.facade.sendNotification(net.HttpType.api_config);
    }

    initCommand() {
        this.facade.registerCommand(net.EventType.REQUEST_START, RequestStartCMD);
        this.facade.registerCommand(net.EventType.REQUEST_END, RequestEndCMD);
        this.facade.registerCommand(net.EventType.REQUEST_ERROR, RequestErrorCMD);
    }

    initMediator() {
        this.facade.registerMediator(new NetObserver(NetObserver.NAME));
    }
}
