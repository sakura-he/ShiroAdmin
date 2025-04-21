import Mock from "mockjs";
import setupUserMock from "./user";
import setupWorkplaceMock from "./dashboard/workplace";
import setupMonitorMock from "./dashboard/monitor";
import setupSystemMock from "./system";
import setupDemoTable from "./demo-table";
export default function setupMock() {
    setupUserMock();
    setupWorkplaceMock();
    setupMonitorMock();
    setupSystemMock();
    setupDemoTable();
}
Mock.setup({
    timeout: 500,
});
