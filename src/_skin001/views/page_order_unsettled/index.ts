function show() {
    //@ts-ignore
    const $router = window["vm"].$router;
    $router.push("/page_order_unsettled");
}

export default { show };
