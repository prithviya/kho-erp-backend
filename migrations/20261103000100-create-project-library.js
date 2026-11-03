"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("project_library_folders", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            projectOnboardId: { type: Sequelize.INTEGER, allowNull: false },
            name: { type: Sequelize.STRING(120), allowNull: false },
            createdBy: { type: Sequelize.INTEGER, allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
        await queryInterface.addIndex("project_library_folders", ["projectOnboardId", "name"], {
            name: "project_library_folders_project_name",
            unique: true
        });

        await queryInterface.createTable("project_library_files", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            projectOnboardId: { type: Sequelize.INTEGER, allowNull: false },
            folderId: { type: Sequelize.INTEGER, allowNull: true },
            originalName: { type: Sequelize.STRING(255), allowNull: false },
            storedName: { type: Sequelize.STRING(100), allowNull: false },
            mimeType: { type: Sequelize.STRING(120), allowNull: false },
            size: { type: Sequelize.BIGINT, allowNull: false },
            uploadedBy: { type: Sequelize.INTEGER, allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
        await queryInterface.addIndex("project_library_files", ["projectOnboardId", "folderId"], {
            name: "project_library_files_project_folder"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("project_library_files");
        await queryInterface.dropTable("project_library_folders");
    }
};
