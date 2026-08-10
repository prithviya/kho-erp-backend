module.exports = (sequelize, DataTypes) => {
    const cifSoftware = sequelize.define(
        "cifSoftware",
        {
            softwareid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            cifid: {    
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cifPersonals",
                    key: "cifid"
                }
            },
            tools: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            levels: {
                type: DataTypes.ENUM("Excellent", "Good", "Average"),
                allowNull: false
            },
        },
        {
            tableName: "cifSoftwares",
            timestamps: true,
            paranoid: true
        }
    );
    return cifSoftware;
}