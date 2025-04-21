 
import { failResponseWrap, successResponseWrap } from "@/utils/mock";
import { mock } from "mockjs";

// 注册user相关接口的mock
let setup = () => {
    // 模拟异步路由列表数据
    
    // 模拟用户信息
    mock(new RegExp("/api/user/info"), (options: any) => {
        const { token } = JSON.parse(options.body);
        if (!token) {
            return failResponseWrap(null, "登录过期", 401);
        }
        let data = {
            nick_name: "admin",
            id: 234234,
            phone: 13288887777, 
            permissions: ["admin.*"],
            gender: 1,
        };
        return successResponseWrap(data);
    });
};
export default function setupUserMock() {
    setup();
}
