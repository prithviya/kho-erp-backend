module.exports = (sequelize, DataTypes) => {

    const Module = sequelize.define(
        "Module",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },

            code: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },

            route: {
                type: DataTypes.STRING(255)
            },

            icon: {
                type: DataTypes.STRING(100)
            },

            displayOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            parentId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "modules",
            timestamps: true,
            paranoid: true
        }
    );

    return Module;
};