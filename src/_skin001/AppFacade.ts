import Vue from "vue";
import net from "@/net/setting";
import NetObserver from "@/proxy/NetObserver";
import GlobalVar from "@/core/global/GlobalVar";
import RequestStartCMD from "./command/RequestStartCMD";
import RequestEndCMD from "./command/RequestEndCMD";
import RequestErrorCMD from "./command/RequestErrorCMD";
import DialogBetResultMediator from "./views/dialog_bet_result/mediator/DialogBetResultMediator";
import MatcheMediator from "./views/matche/mediator/MatcheMediator";

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
        this.facade.sendNotification(net.HttpType.api_config);
    }

    initCommand() {
        this.facade.registerCommand(net.EventType.REQUEST_START, RequestStartCMD);
        this.facade.registerCommand(net.EventType.REQUEST_END, RequestEndCMD);
        this.facade.registerCommand(net.EventType.REQUEST_ERROR, RequestErrorCMD);
    }

    initMediator() {
        this.facade.registerMediator(new NetObserver(NetObserver.NAME));

        this.facade.registerMediator(new MatcheMediator(MatcheMediator.NAME));

        if (!Vue.vuetify.framework.breakpoint.mobile) {
            this.facade.registerMediator(new DialogBetResultMediator(DialogBetResultMediator.NAME));
        }
    }
}
