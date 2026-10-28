/* eslint-disable no-console */
// Usage: node scripts/backfillRolePermissions.js          (dry run, no changes)
//        node scripts/backfillRolePermissions.js --apply  (writes grants; back up the database first)
require("dotenv").config();

const db = require("../src/model");
const roleService = require("../src/services/role.service");

async function run() {
    const apply = process.argv.includes("--apply");
    try {
        await db.sequelize.authenticate();
        const result = await roleService.backfillLegacyRoles({ dryRun: !apply });
        console.log(apply ? "[backfill] applied" : "[backfill] dry run (use --apply to write)");
        console.table(result.roles);
        await db.sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error("[backfill] failed", error);
        process.exit(1);
    }
}

run();
