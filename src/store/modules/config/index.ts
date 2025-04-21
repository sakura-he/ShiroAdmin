import defaultSetting from "@/config/setting.json";
import useColorMode from "@/hooks/useColorMode";
import createCache from "@/utils/cache";
import { setThemeColor as _setThemeColor } from "@/utils/themeColor";
import { defineStore } from "pinia";
import { ConfigStore, deviceEnum } from "./types";
const STORE_ID = "config_store";
let cache = createCache(STORE_ID);
let { isDarkMode } = useColorMode();
export const useConfigStore = defineStore(STORE_ID, () => {
    let _config = cache.getCache("config") || defaultSetting;
    setupInit(_config);
    let config = ref<ConfigStore>(_config);
    function updateMenuWidth(width: number) {
        config.value.menuWidth = width;
    }
    function setDevice(device: deviceEnum) {
        config.value.device = device;
    }
    function setThemeColor(color: string) {
        config.value.themeColor = color;
        // 当配置对象的颜色改变后,
        _setThemeColor(color, isDarkMode.value);
    }
    function updateColorWeek(value: boolean) {
        config.value.colorWeak = value;
        updateColorWeek(value);
    }
    function updateTranslucent(value: boolean) {
        config.value.translucent = value;
        setTranslucent(value);
    }
    return {
        config,
        updateMenuWidth,
        setDevice,
        setThemeColor,
        updateColorWeek,
        updateTranslucent,
    };
});

type useConfigStoreType = typeof useConfigStore;
// 监听state指定键值改变并持久化到本地存储
export function subscribeConfigStore(store: ReturnType<useConfigStoreType>) {
    store.$subscribe(
        (mutation, state) => {
            cache.setCache("config", state.config);
        },
        { detached: true, immediate: true }
    );
}
function updateColorWeek(value: boolean) {
    document.documentElement.style.filter = value ? "invert(80%)" : "none";
}
function setTranslucent(value: boolean) {
    value
        ? document.body.removeAttribute("not-translucent")
        : document.body.setAttribute("not-translucent", "");
}
function setupInit(config: ConfigStore) {
    // 初始化颜色
    _setThemeColor(config.themeColor, isDarkMode.value);
    updateColorWeek(config.colorWeak);
    setTranslucent(config.translucent);
}
