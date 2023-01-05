/**为URL附加参数 */
function getUrl(source: string, obj?: any): string {
    if (obj) {
        for (const key of Object.keys(obj)) {
            source = source.replace(`{${key}}`, obj[key]);
        }
    }
    return source;
}

const Utils = {
    getUrl,
};

export default Utils;
