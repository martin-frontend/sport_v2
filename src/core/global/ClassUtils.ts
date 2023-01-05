/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
function hasClass(ele: HTMLElement, cls: string) {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
function addClass(ele: HTMLElement, cls: string) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
function removeClass(ele: HTMLElement, cls: string) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
    }
}

export default {
    hasClass,
    addClass,
    removeClass,
};
