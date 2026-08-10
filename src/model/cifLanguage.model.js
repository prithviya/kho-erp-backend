module.exports = (sequelize, DataTypes) => {
    const cifLanguage = sequelize.define(
        "cifLanguage",
        {
            languageid: {
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
            Speak: {
                type: DataTypes.ENUM("basic", "intermediate", "fluent", "native"),
                allowNull: false
            },
            Read: {
                type: DataTypes.ENUM("basic", "intermediate", "fluent", "native"),
                allowNull: false
            },
            Write: {
                type: DataTypes.ENUM("basic", "intermediate", "fluent", "native"),
                allowNull: false
            },
        },
        {
            tableName: "cifLanguages",
            timestamps: true,
            paranoid: true
        }
    );
    return cifLanguage;
}