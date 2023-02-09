export default function (blur: boolean, page:string = "page") {
    const pageDiv = document.getElementById(page);
    if (pageDiv) {
        pageDiv.style.filter = blur ? "blur(4px)" : "none";
        if (blur) {
            document.documentElement.style.overflow = "hidden";
            //@ts-ignore
            document.body.scroll = "no";
        } else {
            document.documentElement.style.overflow = "scroll";
            //@ts-ignore
            document.body.scroll = "yes";
        }
    }
}
