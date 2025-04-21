import { accountLoginByPasswordAPi, getAccountInfoApi } from "@/api/account";
import { ILoginData } from "@/api/user";
import { router } from "@/router";
import { LOGIN } from "@/router/routes/constant";
import { useMultipleTabs } from "@/store/modules/multipleTab";
import { useNavigateStore } from "@/store/modules/navigate";
import createCache, { removeStoreByPrefix } from "@/utils/cache";
import { defineStore } from "pinia";
const STORE_ID = "user";
let cache = createCache(STORE_ID);
interface IUserStoreType {
    token: string;
    userInfo: Record<string, any>;
    permissions: string[];
}
export const useUserStore = defineStore(STORE_ID, () => {
    const token = ref<string>(cache.getCache("token") || "");
    const userInfo = ref<Record<string, any>>({});
    const permissions = ref<string[]>([]);
    const roles = ref<string[]>([]);

    async function login(loginData: ILoginData) {
        try {
            const res = await accountLoginByPasswordAPi(loginData);
            token.value = res.data.token;
            await getUserInfo();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async function getUserInfo() {
        try {
            const res = await getAccountInfoApi();
            console.log("getAccountInfoApi", res);
            userInfo.value = res.data.user;
            permissions.value = res.data.permission;
            roles.value = res.data.roles;
            let navigateStore = useNavigateStore();
            // 请求异步路由数组
            await navigateStore.getAsyncMenu();
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    function reset() {
        token.value = "";
        userInfo.value = {};
        roles.value = [];
        permissions.value = [];
        removeStoreByPrefix(STORE_ID);
    }

    function logout() {
        const multipleTabsStore = useMultipleTabs();
        const navigateStore = useNavigateStore();
        // 删除store数据
        reset();

        multipleTabsStore.reset();
        navigateStore.reset();
        router.push({ name: LOGIN });
    }

    return {
        token,
        userInfo,
        permissions,
        roles,
        login,
        getUserInfo,
        reset,
        logout,
    };
});

type useUserStoreType = typeof useUserStore;
// 监听state指定键值改变并持久化到本地存储
export function subscribeUserStore(store: ReturnType<useUserStoreType>) {
    store.$subscribe(
        (mutation, state) => {
            cache.setCache("token", state.token);
        },
        { detached: true }
    );
}
