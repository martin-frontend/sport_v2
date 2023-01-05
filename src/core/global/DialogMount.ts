import Vue from "vue";

const map: any = [];

export default function (pageClass: any, bKeep: boolean = true) {
    const vuetify = Vue.vuetify;
    const dialog_container = document.getElementById("dialog_container");
    if (bKeep) {
        if (map.indexOf(pageClass) == -1) {
            map.push(pageClass);
            if (dialog_container) {
                dialog_container.innerHTML = "";
                const page: any = new (Vue.extend(pageClass))({ vuetify });
                dialog_container.appendChild(page.$mount().$el);
            }
        }
    } else {
        if (dialog_container) {
            dialog_container.innerHTML = "";
            const page: any = new (Vue.extend(pageClass))({ vuetify });
            dialog_container.appendChild(page.$mount().$el);
        }
    }
}
