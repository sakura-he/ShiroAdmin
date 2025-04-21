<template>
    <div class="page_container">
        <NaPageHeader
            full
            title="权限测试"
            subtitle="或许可以用来检测用户是否年满 18 周岁"
            :show-back="false"
        />
        <div class="page_main tw-flex-1 tw-bg-cbg-1 tw-p-6">
            <a-typography>
                <a-typography-paragraph>
                    <a-typography-text bold>
                        设置权限示例:
                        <a-typography-text code>
                            "Perm:demo.demo.demo" [Perm:demo.demo.demo,Role:super_admin]
                            "Role:super_admin || Role:test || (Role:user && Perm:demo.demo.demo)"
                        </a-typography-text>
                    </a-typography-text>
                </a-typography-paragraph>
            </a-typography>
            <a-alert class="tw-mb-2">
                前端: 下面按钮所有角色能看到
                <a-typography-text code>ShiroAuth组件 :permissions="[]"</a-typography-text>
            </a-alert>
            <ShiroAuth :permissions="[]">
                <a-space
                    class="tw-mb-4"
                    wrap
                >
                    <a-space direction="vertical">
                        <a-typography-text code>
                            :disabled="!hasPermission('Role:test&&Role:super_admin')"
                        </a-typography-text>
                        <a-button
                            type="primary"
                            long
                            :disabled="!hasPermission('Role:test&&Role:super_admin')"
                        >
                            <template #icon>
                                <icon-delete />
                            </template>
                            限定 [test && super_admin] 角色可以删除
                        </a-button>
                    </a-space>
                    <ShiroAuth>
                        <a-space direction="vertical">
                            <a-typography-text code>
                                :disabled="!hasPermission('!Perm:demo.permission.handle_warning')"
                            </a-typography-text>
                            <a-button
                                type="primary"
                                status="warning"
                                :disabled="!hasPermission('!Perm:demo.permission.handle_warning')"
                            >
                                警告 (在警告变成错误前一般不会有人去处理, 一个悲伤的故事)
                            </a-button>
                        </a-space>
                    </ShiroAuth>
                    <a-space direction="vertical">
                        <a-typography-text code>
                            :disabled="!hasPermission(['Role:TWT','Perm:demo.permission.age17'])"
                        </a-typography-text>
                        <a-button
                            type="primary"
                            status="success"
                            :disabled="!hasPermission(['Role:TWT', 'Perm:demo.permission.age17'])"
                            long
                        >
                            原神~启动! (拥有提瓦特角色,且年满 12+ 用户允许启动)
                        </a-button>
                    </a-space>
                    <a-space direction="vertical">
                        <a-typography-text code>
                            :disabled="!hasPermission('Perm:demo.permission.age18')
                        </a-typography-text>
                        <a-button
                            type="primary"
                            long
                            status="danger"
                            :disabled="!hasPermission('Perm:demo.permission.age18')"
                        >
                            <template #icon>
                                <icon-exclamation-polygon-fill />
                            </template>
                            我已年满 18 周岁, 继续访问 (3)
                        </a-button>
                    </a-space>
                </a-space>
            </ShiroAuth>
            <a-alert class="tw-mb-2">
                前端: 限定 [user] 角色显示
                <a-typography-text code>
                    ShiroAuth组件 :permissions="['Role:user']"
                </a-typography-text>
            </a-alert>
            <ShiroAuth :permissions="['Role:user']">
                <a-space class="tw-mb-4">
                    <a-button type="primary">编辑</a-button>

                    <a-button type="primary">增加</a-button>

                    <a-button type="primary">删除</a-button>

                    <a-button type="primary">测试按钮</a-button>
                </a-space>
            </ShiroAuth>
            <a-alert class="tw-mb-2">后端: 接口权限测试</a-alert>
            <a-space class="tw-mb-4">
                <ShiroAuth>
                    <a-space direction="vertical">
                        <a-typography-text code>
                            @AttachPermissions('( Perm:demo.index.index && Role:superadmin ) ||
                            Role:test') @UseGuards(JwtGuard) @Get('test')
                        </a-typography-text>
                        <a-button
                            type="primary"
                            long
                            @click="testPermission1"
                        >
                            拥有 [demo.index.index] 权限且为 [super_admin] 角色, 或者拥有 [test]
                            角色可以访问该接口
                        </a-button>
                    </a-space>
                </ShiroAuth>
            </a-space>
            <a-card
                :style="{ width: '100%' }"
                title="当前用户角色"
                class="tw-mb-2"
            >
                <a-typography-text
                    code
                    v-for="role in roles"
                    :key="role"
                >
                    {{ role }}
                </a-typography-text>
            </a-card>
            <a-card
                :style="{ width: '100%' }"
                title="当前用户权限"
            >
                <a-typography-text
                    code
                    v-for="perm in permissions"
                    :key="perm"
                >
                    {{ perm }}
                </a-typography-text>
            </a-card>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { demoPermissionTestApi } from "@/api/demo/permission";
import { useUserStore } from "@/store";
import { hasPermission } from "@/utils/permission";
    defineOptions({
        name: "PermissionTest",
    });
    let isAuth = computed(() => {
        return hasPermission(["system.menu.export"]);
    });
    const userStore = useUserStore();
    const roles = computed(() => userStore.roles);
    const permissions = computed(() => userStore.permissions);
    async function testPermission1() {
        await demoPermissionTestApi(1);
    }
</script>
<style lang="scss" scoped>
    .page_container {
        display: flex;
        flex-direction: column;
        width: 100%;

        box-sizing: border-box;
    }
    .page_main {
    }
</style>
