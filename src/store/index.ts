import { createPinia } from "pinia";
let pinia = createPinia();
export { subscribeConfigStore, useConfigStore } from "./modules/config/index";
export { subscribeMultipleTabsStore, useMultipleTabs } from "./modules/multipleTab";
export { subscribeNavigateStore, useNavigateStore } from "./modules/navigate";
export { subscribeUserStore, useUserStore } from "./modules/user";
export { pinia };

