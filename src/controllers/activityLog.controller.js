const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const activityLogService = require("../services/activityLog.service");

exports.list = asyncHandler(async (req, res) => {
    const data = await activityLogService.list(req.query);
    return ApiResponse.success(res, "Activity logs fetched successfully.", data);
});

exports.filterOptions = asyncHandler(async (req, res) => {
    const data = await activityLogService.filterOptions();
    return ApiResponse.success(res, "Activity log filters fetched successfully.", data);
});

exports.exportExcel = asyncHandler(async (req, res) => {
    const ExcelJS = require("exceljs");
    const rows = await activityLogService.exportRows(req.query);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("History Log");
    sheet.columns = [
        { header: "Date", key: "date", width: 14 },
        { header: "Time", key: "time", width: 12 },
        { header: "Employee", key: "employee", width: 28 },
        { header: "Action", key: "action", width: 16 },
        { header: "Project", key: "project", width: 32 },
        { header: "Module", key: "module", width: 18 },
        { header: "Details", key: "details", width: 70 },
        { header: "IP Address", key: "ip", width: 18 }
    ];
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    // Prefix leading formula characters so the cell is never evaluated by Excel.
    const safe = (value) => (/^[=+\-@]/.test(String(value || "")) ? `'${value}` : value || "");
    rows.forEach((row) => sheet.addRow({
        date: row.localDate,
        time: row.localTime,
        employee: safe(row.actorName),
        action: row.action,
        project: safe(row.projectName),
        module: row.module,
        details: safe(row.description),
        ip: row.ipAddress || ""
    }));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="history-log-${new Date().toISOString().slice(0, 10)}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
});
