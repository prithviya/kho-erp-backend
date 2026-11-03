module.exports = (sequelize, DataTypes) => sequelize.define(
    "ProjectLibraryFile",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        projectOnboardId: { type: DataTypes.INTEGER, allowNull: false },
        folderId: { type: DataTypes.INTEGER, allowNull: true },
        originalName: { type: DataTypes.STRING(255), allowNull: false },
        storedName: { type: DataTypes.STRING(100), allowNull: false },
        mimeType: { type: DataTypes.STRING(120), allowNull: false },
        size: { type: DataTypes.BIGINT, allowNull: false },
        uploadedBy: { type: DataTypes.INTEGER, allowNull: false }
    },
    { tableName: "project_library_files", timestamps: true }
);
