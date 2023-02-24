import LangUtil from "@/core/global/LangUtil";

export const EmnuBetMessage: { [status: number]: string } = {
    0: LangUtil("确认中"),
    1: LangUtil("确认成功"),
    3: LangUtil("已拒绝"),
    4: LangUtil("已取消"),
    5: LangUtil("无效"),
    8: LangUtil("准异常"), //准异常
};
