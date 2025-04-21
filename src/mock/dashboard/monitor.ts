import { mock, Random } from "mockjs";
import { setupMock, successResponseWrap, failResponseWrap } from "@/utils/mock";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
dayjs.extend(customParseFormat);
dayjs.extend(dayOfYear);

let setup = () => {
    // monitor 初始数据
    mock(new RegExp("api/monitor/index"), (options: any) => {
        let data: { [props: string]: any } = {};
        data.user = {
            nick_name: "admin",
            work: {
                underway: 10,
                done: 34,
                undone: 26,
                total: 70,
            },
        };
        data.slide = [];
        data.shortcut = [];
        data.timeline = [];
        for (let i = 0; i <= 7; i++) {
            data.timeline.push({
                time: Random.time("MM-dd"),
                user_name: "admin",
                create_time: Random.time("MM-dd"),
                action: Random.integer(0, 4),
                team: Random.cname(),
                project_name: Random.cname,
                team_id: 1,
                project_id: 3,
                user_id: 1221,
            });
        }

        return successResponseWrap(data);
    });

    // 销售额模拟数据
    mock(new RegExp("api/monitor/sale"), (options) => {
        type chartDataType = {
            date: string;
            value: number;
        };
        enum dateTypeEnum {
            month = 3,
            week = 2,
            day = 1,
        }
        let chartData: Array<Record<string, any>> = [];
        var url = new URL(options.url);
        let reqDateType: dateTypeEnum = Number.parseInt(
            url.searchParams.get("type") || dateTypeEnum["day"].toString(),
        );
        switch (reqDateType) {
            case dateTypeEnum["day"]:
                for (let index = 0; index <= dayjs().hour(); index++) {
                    let data: chartDataType = {} as chartDataType;
                    if (index === dayjs().hour()) {
                        data.date = dayjs().format("HH:mm");
                    } else data.date = dayjs().hour(index).minute(59).format("HH:59");
                    data.value = Random.integer(0, 30);
                    chartData.push(data);
                }
                break;

            case dateTypeEnum["week"]:
                for (let index = 1; index <= 7; index++) {
                    let currentDay = 7 - index;
                    chartData.push({
                        date: dayjs()
                            .dayOfYear(dayjs().dayOfYear() - currentDay)
                            .format("MM-DD"),
                        value: Random.integer(0, 300),
                    });
                }
                break;
            case dateTypeEnum["month"]:
                for (let index = 1; index <= dayjs().date(); index++) {
                    chartData.push({
                        date: dayjs().date(index).format("MM-DD"),
                        value: Random.integer(0, 300),
                    });
                }
                break;
        }
        let data: Record<string, any> = {};
        data.chartData = chartData;
        return successResponseWrap(data);
    });
};
export default function setupMonitorMock() {
    setup();
}
