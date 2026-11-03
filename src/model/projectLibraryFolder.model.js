module.exports = (sequelize, DataTypes) => sequelize.define(
    "ProjectLibraryFolder",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        projectOnboardId: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING(120), allowNull: false },
        createdBy: { type: DataTypes.INTEGER, allowNull: false }
    },
    { tableName: "project_library_folders", timestamps: true }
);
