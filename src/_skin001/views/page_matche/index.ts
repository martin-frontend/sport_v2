import Vue from "vue";

function show(id: number) {
    Vue.router.push(`/page_matche?id=${id}`);
}

export default { show };
