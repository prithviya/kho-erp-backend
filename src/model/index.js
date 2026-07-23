const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,

        dialect: process.env.DB_TYPE, // postgres or mysql

        logging: false,

        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};
db.User = require('./user.model')(sequelize, DataTypes);
db.UserRole = require('./userRole.model')(sequelize, DataTypes);
db.Role = require('./role.model')(sequelize, DataTypes);
db.Permission = require('./permission.model')(sequelize, DataTypes);
db.RolePermission = require('./rolePermission.model')(sequelize, DataTypes);
db.Module = require('./module.model')(sequelize, DataTypes);
db.RefreshToken = require("./refreshToken.model")(sequelize, DataTypes);
db.PasswordResetToken = require("./passwordResetToken.model")(sequelize, DataTypes);

db.User.hasMany(db.PasswordResetToken, {
    foreignKey: "userId",
    as: "passwordResetTokens"
});

db.PasswordResetToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});
db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens"
});

db.RefreshToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});
db.User.belongsToMany(db.Role, {
    through: db.UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles"
});

db.Role.belongsToMany(db.User, {
    through: db.UserRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users"
});

db.Role.belongsToMany(db.Permission, {
    through: db.RolePermission,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions"
});

db.Permission.belongsToMany(db.Role, {
    through: db.RolePermission,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles"
});

db.Module.hasMany(db.Permission, {
    foreignKey: "moduleId"
});

db.Permission.belongsTo(db.Module, {
    foreignKey: "moduleId"
});

// SEQUELIZE
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;