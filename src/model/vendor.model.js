module.exports = (sequelize, DataTypes) => {
    const Ventor = sequelize.define(
        "Ventor",
        {
            vendorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },

            vendor_name: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            vendor_email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },

            vendor_contact: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            vendor_company_name: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },

            vendor_address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            gst_registered: {
                type: DataTypes.ENUM("yes", "no"),
                allowNull: false,
                defaultValue: "no",
            },

            gst_number: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },

            status: {
                type: DataTypes.ENUM("active", "inactive"),
                allowNull: false,
                defaultValue: "active",
            },

            services: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            tableName: "vendors",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return Ventor;
};