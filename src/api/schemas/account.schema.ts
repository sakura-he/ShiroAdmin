import { z } from 'zod';

// 登录参数
export const LoginParamsSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});
export type LoginParams = z.infer<typeof LoginParamsSchema>;

// 请求密码重置参数
export const RequestResetParamsSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});
export type RequestResetParams = z.infer<typeof RequestResetParamsSchema>;

// 验证重置 token 参数
export const VerifyResetParamsSchema = z.object({
  token: z.string().min(1, 'Token 不能为空'),
});
export type VerifyResetParams = z.infer<typeof VerifyResetParamsSchema>;

// 重置密码参数
export const ResetPasswordParamsSchema = z.object({
  token: z.string().min(1, 'Token 不能为空'),
  new_password: z.string().min(6, '密码至少 6 个字符'),
  confirm_password: z.string().min(1, '确认密码不能为空'),
}).refine(data => data.new_password === data.confirm_password, {
  message: '两次输入的密码不一致',
  path: ['confirm_password'],
});
export type ResetPasswordParams = z.infer<typeof ResetPasswordParamsSchema>;

// 修改密码参数（已登录用户）
export const ChangePasswordParamsSchema = z.object({
  old_password: z.string().min(1, '原密码不能为空'),
  new_password: z.string().min(6, '新密码至少 6 个字符'),
  confirm_password: z.string().min(1, '确认密码不能为空'),
}).refine(data => data.new_password === data.confirm_password, {
  message: '两次输入的密码不一致',
  path: ['confirm_password'],
});
export type ChangePasswordParams = z.infer<typeof ChangePasswordParamsSchema>;
