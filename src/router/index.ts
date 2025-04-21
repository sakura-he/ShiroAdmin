import { createRouter, createWebHashHistory } from "vue-router";
import createRouterGuard from "./gruad";
import "./type.ts";
import { HOME_ROUTE, LOGIN_ROUTE } from "./routes/base";
let router = createRouter({
    history: createWebHashHistory(),
    // 预置的路由,包含登录页和404页
    routes: [HOME_ROUTE, LOGIN_ROUTE],
    scrollBehavior: () => ({ left: 0, top: 0 }),
});
createRouterGuard(router);
export { router };
