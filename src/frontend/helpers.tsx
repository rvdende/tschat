export const getwebsocketurl = (): string => {
    let url = window.location.origin;
    return url.split("http").join("ws") + "/websocket";
};