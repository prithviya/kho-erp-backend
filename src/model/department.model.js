module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define(
        "Department",
        {
            departid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            departname: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "departments",
            timestamps: true,
        }
    );

    return Department;
};