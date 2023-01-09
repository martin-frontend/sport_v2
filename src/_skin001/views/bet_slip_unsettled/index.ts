function show() {
    //@ts-ignore
    const $router = window["vm"].$router;
    $router.push("/bet_slip_unsettled");
}

export default { show };
