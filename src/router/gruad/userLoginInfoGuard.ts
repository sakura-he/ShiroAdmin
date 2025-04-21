import { WHITE_LIST } from "@/router/routes/constant";
import { useUserStore } from "@/store";
import { useNavigateStore } from "@/store/modules/navigate";
import { Message } from "@arco-design/web-vue";
import { Router } from "vue-router";
import { HOME, LOGIN } from "../routes/constant";
// 用户登录验证
export default function setupUserLoginInfoGuard(router: Router) {
    router.beforeEach(async (to, from) => {
        
        let userStore = useUserStore();
        let navigateStore = useNavigateStore();
        // 已登录用户
        if (userStore.token) {
            if (to.name === LOGIN) {
                return {
                    name: HOME,
                };
            }
            if (navigateStore.asyncMenuList.length) {
                // 添加过路由了,继续跳转
                console.log("已经加载路由");
                return true;
            } else {
                console.log("么有加载路由");
                await userStore.getUserInfo();
                return { ...to, replace: true };
            }
        }
        // 以下是未登录用户跳转逻辑
        // 当没有显式指定预置路由的 requiresAuth 字段则直接通过
        if (!to.meta.requiresAuth) {
            return true;
        }
        // 白名单路由直接跳转
        if (WHITE_LIST.findIndex((item) => item === to.name) >= 0) {
            console.log("白名单");
            return true;
        }
        // 没有命中上面规则跳转登录
        Message.error({
            content: "请登陆后访问",
        });
        return {
            name: "login",
            query: { toUrl: to.fullPath },
            replace: true,
        };
    });
}
