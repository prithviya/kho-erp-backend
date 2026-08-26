module.exports=(sequelize, DataTypes) => {
    const VentorService = sequelize.define (
        "VentorService",
        {
            vserid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            vid:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {   
                    model: "ventors",
                    key: "vid"
                }
            },
            service_type:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "services",
                    key: "id"
                }
            },
            perpagecost:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            perdaycost:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {   
            tableName: "ventor_services",
            timestamps: true,
            paranoid: true
        }
    );
    return VentorService;
};