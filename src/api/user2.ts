import { mapValues } from "es-toolkit/compat";
import { z } from "zod";
import { request } from "./index";
export enum UserEnumApi {
    ENABLE = 1,
    DISABLE = 2,
}
export const RolesSchema = z.object({
    user_id: z.number().optional(),
    roles: z.array(z.number()),
});
export const UserDetailFormSchema = z.object({
    id: z.number(),
    email: z.union([z.string(), z.null()]),
    username: z.string(),
    password: z.string(),
    avatar: z.union([z.string(), z.null()]),
    phone: z.union([z.string(), z.null()]),
    nickname: z.union([z.string(), z.null()]),
    remark: z.union([z.string(), z.null()]),
    status: z.nativeEnum(UserEnumApi),
    is_lock: z.boolean(),
    roles: z.array(z.number()),
});
export type UserDetailFormDto = z.infer<typeof UserDetailFormSchema>;

export const CreateUserFormSchema = z.object({
    email: z.union([z.string(), z.null()]),
    username: z.string(),
    password: z.string(),
    avatar: z.union([z.string(), z.null()]),
    phone: z.union([z.string(), z.null()]),
    nickname: z.union([z.string(), z.null()]),
    remark: z.union([z.string(), z.null()]),
    status: z.nativeEnum(UserEnumApi),
    is_lock: z.boolean(),
    roles: z.array(z.number()),
});
export type CreateUserFormDto = z.infer<typeof CreateUserFormSchema>;
export const UpdateUserFormSchema = z.object({
    id: z.number(),
    email: z.union([z.string(), z.null()]),
    password: z.union([z.string(), z.null()]),
    avatar: z.union([z.string(), z.null()]),
    phone: z.union([z.string(), z.null()]),
    nickname: z.union([z.string(), z.null()]),
    remark: z.union([z.string(), z.null()]),
    status: z.union([z.nativeEnum(UserEnumApi), z.null()]),
    is_lock: z.union([z.boolean(), z.null()]),
    roles: z.array(z.number()),
});
export type UpdateUserFormDto = z.infer<typeof UpdateUserFormSchema>;
export interface ILoginData {
    username: string;
    password: string;
}
export function login({ username, password }: ILoginData) {
    return request.post("/user/login", {
        username,
        password,
    });
}
export function createUserApi(data: CreateUserFormDto) {
    return request({
        method: "post",
        url: "/user/create_user",
        data: mapValues(data, (value) => {
            if (value === "") return null;
            return value;
        }),
    });
}
export function updateUserApi(id: number, data: UpdateUserFormDto) {
    return request({
        method: "post",
        url: "/user/update_user",
        params: { id },
        data: mapValues(data, (value) => {
            if (value === "") return null;
            return value;
        }),
    });
}
export function deleteUserApi(id: number) {
    return request({
        method: "post",
        url: "/user/delete_user",
        params: { id },
    });
}

export function getUserList() {
    return request.get("/user/get_user_list");
}
