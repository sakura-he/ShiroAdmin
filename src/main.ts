import "@/api";
import setupMock from "@/mock";
import { router } from "@/router/index";
import { default as ArcoVue, Message } from "@arco-design/web-vue";
import { createApp } from "vue";
import App from "./App.vue";
import { pinia } from "./store";

import "@arco-design/web-vue/dist/arco.css";
import "nprogress/nprogress.css";
import "@/styles/index.scss";
// 额外引入图标库
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import setupGlobalDirectives from "./directives";
async function bootstrap() {
    const app = createApp(App);
    Message._context = app._context;
    app.use(router);
    app.use(pinia);
    app.use(ArcoVue);
    app.use(ArcoVueIcon);
    // 安装全局指令
    setupGlobalDirectives(app);
    // 使用mockjs
    setupMock();
    await router.isReady();
    app.mount("#app");
}
bootstrap();
