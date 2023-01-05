export default class RequestErrorCMD extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody();
    }
}
