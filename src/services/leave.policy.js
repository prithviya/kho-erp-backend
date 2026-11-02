const PERMISSION_MONTHLY_ALLOCATION_HOURS = 6;
const PERMISSION_MONTHLY_USAGE_LIMIT_HOURS = 2;
const CASUAL_LEAVE_MONTHLY_ALLOCATION_DAYS = 1;
const CASUAL_LEAVE_CARRY_FORWARD_DAYS = 1;

function sumBooked(requests, field) {
    return requests.reduce((sum, request) => (
        ["PENDING", "APPROVED"].includes(String(request.status || "").toUpperCase())
            ? sum + Number(request[field] || 0)
            : sum
    ), 0);
}

function getPermissionMonthBalance(requests = []) {
    const bookedHours = sumBooked(requests, "requestedHours");
    const usedHours = requests.reduce((sum, request) => (
        String(request.status || "").toUpperCase() === "APPROVED"
            ? sum + Number(request.requestedHours || 0)
            : sum
    ), 0);

    return {
        allocatedHours: PERMISSION_MONTHLY_ALLOCATION_HOURS,
        usageLimitHours: PERMISSION_MONTHLY_USAGE_LIMIT_HOURS,
        usedHours: Number(usedHours.toFixed(2)),
        bookedHours: Number(bookedHours.toFixed(2)),
        pendingHours: Number(Math.max(0, bookedHours - usedHours).toFixed(2)),
        remainingHours: Number(Math.max(0, PERMISSION_MONTHLY_USAGE_LIMIT_HOURS - bookedHours).toFixed(2)),
    };
}

function getCasualLeaveMonthBalance(previousMonthRequests = [], currentMonthRequests = [], allowCarryForward = true) {
    const previousBookedDays = sumBooked(previousMonthRequests, "requestedDays");
    const bookedDays = sumBooked(currentMonthRequests, "requestedDays");
    const carryForwardDays = allowCarryForward && previousBookedDays === 0
        ? CASUAL_LEAVE_CARRY_FORWARD_DAYS
        : 0;
    const allocatedDays = CASUAL_LEAVE_MONTHLY_ALLOCATION_DAYS + carryForwardDays;

    return {
        monthlyAllocation: CASUAL_LEAVE_MONTHLY_ALLOCATION_DAYS,
        carryForwardDays,
        allocatedDays,
        bookedDays: Number(bookedDays.toFixed(2)),
        remainingDays: Number(Math.max(0, allocatedDays - bookedDays).toFixed(2)),
    };
}

module.exports = {
    PERMISSION_MONTHLY_ALLOCATION_HOURS,
    PERMISSION_MONTHLY_USAGE_LIMIT_HOURS,
    CASUAL_LEAVE_MONTHLY_ALLOCATION_DAYS,
    CASUAL_LEAVE_CARRY_FORWARD_DAYS,
    getPermissionMonthBalance,
    getCasualLeaveMonthBalance,
};
