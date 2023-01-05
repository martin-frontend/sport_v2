/**顶部菜单 */
export interface MenuNavVO {
    en: string;
    name: string;
    sport_id: number;
}
/**左侧菜单top */
export interface MenuSubTopVO {
    name: string;
    num: number;
    tag: string;
}
/**左侧菜单center */
export interface MenuSubCenterVO {
    country_code: string;
    country_name: string;
    icon: string;
    num: number;
    competitions: {
        competition_id: number;
        name: string;
    }[];
}
