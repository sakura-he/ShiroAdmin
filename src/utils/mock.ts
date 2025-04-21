export function setupMock({ mock = true, setup }: { mock?: boolean; setup: () => void }) {
    if (import.meta.env.VITE_MOCKJS) {
        setup();
    }
}
export const successResponseWrap = (data: unknown) => {
    return {
        data,
        status: "ok",
        msg: "请求成功",
        code: 200,
    };
};

export const failResponseWrap = (data: unknown, msg: string, code = 400) => {
    return {
        data,
        status: "fail",
        msg,
        code,
    };
};
