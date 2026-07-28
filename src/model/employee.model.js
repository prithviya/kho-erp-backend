module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        "Employee",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            empid: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            empname: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            empemail: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            empdeptid: {
                type: DataTypes.INTEGER,
            },
            empgroupid: {
                type: DataTypes.INTEGER,
            },
            reportheadid: {
                type: DataTypes.INTEGER,
            },
            empdob: {
                type: DataTypes.DATEONLY, 
                allowNull: false,
            },
            empjob: {
                type: DataTypes.DATEONLY, 
                allowNull: false,
            },
        },
        {
            tableName: "employees",
            timestamps: true, // createdAt & updatedAt
        }
    );

    return Employee;
};