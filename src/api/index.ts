import { useUserStore } from "@/store";
import { Message, Typography } from "@arco-design/web-vue";
import axios, { AxiosHeaders } from "axios";
import NProgress from "nprogress";

export interface HttpResponse<T = any> {
    status: number;
    msg: string;
    code: number;
    data: T;
}

function createRequest() {
    let instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 5000,
    });
    return instance;
}

export let request = createRequest();
request.interceptors.request.use(
    (config) => {
        // 添加token拦截器
        let userStore = useUserStore();
        const token = userStore.token;
        if (token) {
            (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);
// add response interceptors
request.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res.code != 200) {
          
            Message.error({
                content: res.message || res.code,
                duration: 1000,
            });
            return Promise.reject(res);
        }
        if (res.code === 400) {
            Message.success({
                content: "1",
                duration: 1000,
            });
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        if (error.response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
             
            Message.error({
                content: () =>
                    h(
                        Typography,
                        {
                            style: {
                                color: "red",
                                maxWidth: "50vw",
                            },
                            resetOnHover: true,
                        },
                        error.response.data.message ||
                            `响应错误,错误码:${error.response.code || error.response.status}`,
                    ),
                duration: 3000,
            });
        } else if (error.request) {
            // 请求已经成功发起，但没有收到响应
            // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
            // 而在node.js中是 http.ClientRequest 的实例
         
            Message.error({
                content: () =>
                    h(
                        Typography,
                        {
                            style: {
                                color: "red",
                                maxWidth: "50vw",
                            },
                            resetOnHover: true,
                        },
                        error.message || "Request Error",
                    ),
                duration: 3000,
            });
        } else {
            Message.error({
                content: () =>
                    h(
                        Typography,
                        {
                            style: {
                                color: "red",
                                maxWidth: "50vw",
                            },
                            resetOnHover: true,
                        },
                        error.message,
                    ),
                duration: 3000,
            });
            // 发送请求时出了点问题
            console.log("Error", error.message);
        }

        return Promise.reject(error);
    },
);
// 请求时添加进度条
request.interceptors.request.use((value) => {
    NProgress.start();
    NProgress.configure({
        showSpinner: false,
    });
    return value;
});
// 请求结束时完成进度条
request.interceptors.response.use(
    (res) => {
        NProgress.done();
        return res;
    },
    (err) => {
        NProgress.done();
        return Promise.reject(err);
    },
);
