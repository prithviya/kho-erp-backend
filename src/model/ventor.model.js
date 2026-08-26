module.exports = (sequelize, DataTypes) => {
    const Ventor = sequelize.define(
        "Ventor",{
            vid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            ventor_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            ventor_email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true   
                }
            },
            ventor_phone:{
                type: DataTypes.STRING(15),
                allowNull: false,  
            },
            ventor_company:{
                type: DataTypes.STRING(100),
                allowNull: false
            },
            service_name:{
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "service_categories",
                    key: "id"
                }
            },
            service_type:{
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "services",
                    key: "id"
                }
            },
        },
        {
            tableName: "ventors",
            timestamps: true,
            paranoid: true
        }
    )
    return Ventor;
}