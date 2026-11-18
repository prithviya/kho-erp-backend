"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("group_chats", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            name: { type: Sequelize.STRING(100), allowNull: false },
            profileImage: { type: Sequelize.STRING(512), allowNull: true },
            createdBy: { type: Sequelize.INTEGER, allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE, allowNull: true },
        });
        await queryInterface.createTable("group_chat_members", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            groupId: { type: Sequelize.INTEGER, allowNull: false },
            userId: { type: Sequelize.INTEGER, allowNull: false },
            addedBy: { type: Sequelize.INTEGER, allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
        });
        await queryInterface.createTable("group_chat_messages", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            groupId: { type: Sequelize.INTEGER, allowNull: false },
            senderId: { type: Sequelize.INTEGER, allowNull: true },
            message: { type: Sequelize.TEXT, allowNull: false, defaultValue: "" },
            isSystem: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            isPinned: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            mentionedUserIds: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
            attachments: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE, allowNull: true },
        });
        await queryInterface.addIndex("group_chat_members", ["groupId", "userId"], {
            unique: true,
            name: "uq_group_chat_members_group_user",
        });
        await queryInterface.addIndex("group_chat_members", ["userId", "groupId"], {
            name: "idx_group_chat_members_user_group",
        });
        await queryInterface.addIndex("group_chat_messages", ["groupId", "createdAt"], {
            name: "idx_group_chat_messages_group_created",
        });
        await queryInterface.addIndex("group_chat_messages", ["senderId", "createdAt"], {
            name: "idx_group_chat_messages_sender_created",
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("group_chat_messages");
        await queryInterface.dropTable("group_chat_members");
        await queryInterface.dropTable("group_chats");
    },
};
