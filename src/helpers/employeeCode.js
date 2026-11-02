"use strict";

function normalizeEmployeeCode(value) {
    if (value === null || value === undefined) {
        return value;
    }

    return String(value).trim().replace(/-/g, "");
}

module.exports = {
    normalizeEmployeeCode,
};
