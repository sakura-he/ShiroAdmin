x<template>
    <div class="container">
        <!-- <div class="logo">11</div> -->
        <div class="tw-fixed tw-z-40 tw-top-5 tw-left-5">
            <!-- 颜色模式切换 -->
            <ColorModeSwitch
                v-slot="icon"
                ref="ColorModeSwitchRef"
            >
                <a-button shape="circle">
                    <DynamicIcon
                        :icon="icon.icon"
                        class="tw-text-title-1"
                    />
                </a-button>
            </ColorModeSwitch>
        </div>
        <div class="banner">
            <a-carousel
                class="swiper"
                :default-current="2"
                @change="handleChange"
                indicator-type="slider"
                :auto-play="true"
                :show-arrow="'never'"
            >
                <a-carousel-item
                    v-for="image in images"
                    class="swiper__item"
                >
                    <img
                        :src="image"
                        :style="{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }"
                    />
                </a-carousel-item>
            </a-carousel>
        </div>
        <div class="content">
            <div
                class="form tw-w-11/12 tw-pointer-events-auto tw-mx-auto sm:tw-max-w-[340px] tw-py-10 tw-px-6 tw-box-border tw-bg-fill-transparent-4 tw-rounded tw-backdrop-blur-[20px] md:tw-mr-[10%]"
            >
                <div class="tw-mb-4">
                    <div class="logo">
                        <img
                            class="logo_img"
                            src="@/assets/logo2.svg"
                            alt=""
                        />
                    </div>

                    <div
                        class="login__sub-title tw-text-c-2 tw-text-title-3 tw-font-bold tw-text-center tw-leading-tight tw-select-none tw-pb-2"
                    >
                        欢迎使用
                    </div>
                    <div class="login__err-msg"></div>
                </div>

                <PageTransition
                    in-name="fade-in"
                    out-name="fade-out"
                    mode="out-in"
                >
                    <!-- 登录表单1 -->
                    <a-form
                        layout="vertical"
                        :model="form"
                        class="login__form"
                        v-if="loginType === LOGIN_TYPE_ENUM.user"
                    >
                        <a-form-item field="11">
                            <a-input
                                v-model="form.username"
                                placeholder="用户名"
                                id="username"
                            >
                                <template #prefix>
                                    <icon-user />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item field="post">
                            <a-input-password
                                v-model="form.userpw"
                                placeholder="密码"
                            >
                                <template #prefix>
                                    <icon-lock />
                                </template>
                            </a-input-password>
                        </a-form-item>

                        <a-form-item field="isRemenber">
                            <a-checkbox v-model="form.isRemenber">记住密码</a-checkbox>
                            <a-button
                                html-type="submit"
                                class="tw-ml-auto"
                                type="text"
                                size="mini"
                            >
                                忘记密码
                            </a-button>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                html-type="submit"
                                long
                                type="primary"
                                @click="onLogin"
                                :loading="loading"
                            >
                                登录
                            </a-button>
                        </a-form-item>
                    </a-form>
                    <!-- 登录表单2 -->
                    <a-form
                        layout="vertical"
                        :model="form"
                        class="login__form"
                        v-if="loginType === LOGIN_TYPE_ENUM.phone"
                    >
                        <a-form-item field="11">
                            <a-input
                                v-model="form.username"
                                placeholder="手机号"
                                id="username"
                            >
                                <template #prefix>
                                    <icon-mobile />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item field="post">
                            <a-input-group class="tw-w-full">
                                <a-input
                                    v-model="form.userpw"
                                    placeholder="验证码"
                                >
                                    <template #prefix>
                                        <icon-message />
                                    </template>
                                </a-input>
                                <a-button
                                    :loading="loading"
                                    @click="getPhoneCode"
                                    :disabled="count != 0"
                                >
                                    {{ count === 0 ? "获取验证码" : `${count} 秒后重试` }}
                                </a-button>
                            </a-input-group>
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                html-type="submit"
                                long
                                type="primary"
                                @click="onLogin"
                                :loading="loading"
                            >
                                手机号登录
                            </a-button>
                        </a-form-item>
                    </a-form>
                </PageTransition>

                <div>
                    <a-space class="tw-text-[20px] tw-text-c-2">
                        <span class="tw-text-body-3 tw-text-c-1">其他登录方式:</span>
                        <icon-user
                            class="hover:tw-text-p-6 hover:tw-cursor-pointer"
                            v-if="loginType !== LOGIN_TYPE_ENUM.user"
                            @click="switchLoginType(LOGIN_TYPE_ENUM.user)"
                        />
                        <icon-mobile
                            class="hover:tw-text-p-6 hover:tw-cursor-pointer"
                            v-if="loginType !== LOGIN_TYPE_ENUM.phone"
                            @click="switchLoginType(LOGIN_TYPE_ENUM.phone)"
                        />
                        <icon-wechat
                            class="hover:tw-text-p-6 hover:tw-cursor-pointer"
                            v-if="loginType !== LOGIN_TYPE_ENUM.wechat"
                            @click="switchLoginType(LOGIN_TYPE_ENUM.wechat)"
                        />
                        <icon-github
                            class="hover:tw-text-p-6 hover:tw-cursor-pointer"
                            v-if="loginType !== LOGIN_TYPE_ENUM.github"
                            @click="switchLoginType(LOGIN_TYPE_ENUM.github)"
                        />
                        <icon-google
                            class="hover:tw-text-p-6 hover:tw-cursor-pointer"
                            v-if="loginType !== LOGIN_TYPE_ENUM.google"
                            @click="switchLoginType(LOGIN_TYPE_ENUM.google)"
                        />
                        <icon-twitter
                            class="hover:tw-text-p-6 hover:tw-cursor-pointer"
                            v-if="loginType !== LOGIN_TYPE_ENUM.twitter"
                            @click="switchLoginType(LOGIN_TYPE_ENUM.twitter)"
                        />
                    </a-space>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import login1 from "@/assets/login1.jpg";
import login2 from "@/assets/login2.jpg";
import login3 from "@/assets/login3.jpg";
import DynamicIcon from "@/components/DynamicIcon.vue";
import { useCountDown } from "@/hooks/useCountDown";
import ColorModeSwitch from "@/layout/components/ColorModeSwitch.vue";
import PageTransition from "@/layout/components/PageTransition.vue";
import { HOME } from "@/router/routes/constant";
import { useUserStore } from "@/store";
import useLoading from "@/utils/useLoading";
import { Message } from "@arco-design/web-vue";
import { useRoute, useRouter } from "vue-router";
    defineOptions({
        name: "Login",
    });
    let userStore = useUserStore();
    let router = useRouter();
    let route = useRoute();
    let { loading, setLoading } = useLoading(false);
    let { count, start, reset, setCount } = useCountDown({ end: 0, interval: 1000 });
    enum LOGIN_TYPE_ENUM {
        "user" = 0,
        "phone" = 1,
        "wechat" = 2,
        "github" = 3,
        "google" = 4,
        "twitter" = 5,
    }
    // 当前登录方式
    let loginType = ref(LOGIN_TYPE_ENUM.user); // 默认账号密码登录
    const images = [login1, login2, login3];
    const handleChange = (value: number) => {};
    let form = reactive({
        username: "",
        userpw: "",
        agree: false,
        isRemenber: false,
    });
    // 切换登录方式
    function switchLoginType(type: LOGIN_TYPE_ENUM) {
        loginType.value = type;
    }
    // 登录
    function onLogin() {
        // 防止重复点击登录
        if (loading.value) return;
        setLoading(true);
        userStore
            .login({
                username: form.username,
                password: form.userpw,
            })
            .then(() => {
                if (route.query.toUrl) {
                    Message.success("登录成功!正在跳转登录前的页面");
                    router.replace({
                        path: <string>route.query.toUrl,
                    });
                } else {
                    Message.success("欢迎使用");
                    router.replace({
                        name: HOME,
                        replace: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    // 获取手机验证码
    function getPhoneCode() {
        if (count.value <= 0) {
            start(60);
        }
    }
</script>
<style lang="scss" scoped>
    .logo {
        width: 100%;
        height: 80px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .logo_img {
            height: 100%;
            object-fit: contain;
        }
    }
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
    }

    .banner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: #f3f5f8;
    }

    .content {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .swiper {
        height: 100%;

        .siwper__item {
            height: 100%;
        }
    }
</style>
