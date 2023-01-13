import LangUtil from "@/core/global/LangUtil";

export const EnumFixOrderStatus: { [status: number]: string } = {
    0: LangUtil("确认中"), //确认中
    1: LangUtil("确认成功"), //确认成功
    3: LangUtil("已拒绝"), //拒绝
    4: LangUtil("已取消"), //拒绝
    5: LangUtil("无效"), //无效
};
