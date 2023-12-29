export default function (blur: boolean, page: string = "page", mask: boolean = false) {
    const pageDiv = document.getElementById(page);
    const maskDiv: any = document.getElementById("mask");
    if (pageDiv) {
        pageDiv.style.filter = blur ? "blur(4px)" : "none";
        if (blur) {
            document.documentElement.style.overflow = "hidden";
            //@ts-ignore
            document.body.scroll = "no";

            if (!mask) return;
            if (!maskDiv) {
                createMask(pageDiv);
            } else {
                maskDiv.style.display = "block";
            }
        } else {
            document.documentElement.style.overflow = "scroll";
            //@ts-ignore
            document.body.scroll = "yes";

            if (maskDiv && mask) {
                maskDiv.style.display = "none";
            }
        }
    }
}

function createMask(pageDiv: any) {
    let createDiv: any = document.createElement("div");
    createDiv.id = "mask";
    createDiv.style.width = "100vw";
    createDiv.style.height = "100vh";
    createDiv.style.zIndex = "1";
    createDiv.style.position = "fixed";
    createDiv.style.top = "0";
    pageDiv.appendChild(createDiv);
}
