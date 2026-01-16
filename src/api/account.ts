import { request } from "./index";
import type {
  LoginParams,
  RequestResetParams,
  VerifyResetParams,
  ResetPasswordParams,
  ChangePasswordParams,
} from "./schemas/account.schema";

// 获取用户菜单列表
export function getAccountMenuListApi() {
  return request("/account/menus", {
    method: "get",
  });
}

// 账户密码登录
export function accountLoginByPasswordApi(data: LoginParams) {
  return request("/account/login", {
    method: "post",
    data,
  });
}

// 获取账户信息
export function getAccountInfoApi() {
  return request({
    url: "/account/info",
    method: "get",
  });
}

// 请求密码重置（发送重置邮件）
export function requestPasswordResetApi(data: RequestResetParams) {
  return request({
    url: "/account/request_reset",
    method: "post",
    data,
  });
}

// 验证重置 token
export function verifyResetTokenApi(data: VerifyResetParams) {
  return request({
    url: "/account/verify_reset",
    method: "post",
    data,
  });
}

// 重置密码（使用 token）
export function resetPasswordApi(data: ResetPasswordParams) {
  return request({
    url: "/account/reset_password",
    method: "post",
    data,
  });
}

// 修改密码（已登录用户）
export function changePasswordApi(data: ChangePasswordParams) {
  return request({
    url: "/account/change_password",
    method: "post",
    data,
  });
}
