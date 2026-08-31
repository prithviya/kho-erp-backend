module.exports = (sequelize, DataTypes) => {
    const CandidateLanguage = sequelize.define(
        "CandidateLanguage",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            candidateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "candidates",
                    key: "id",
                },
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "candidateId",
            },
            languageName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            speakLevel: {
                type: DataTypes.ENUM("Basic", "Intermediate", "Fluent", "Native"),
                allowNull: false,
            },
            readLevel: {
                type: DataTypes.ENUM("Basic", "Intermediate", "Fluent", "Native"),
                allowNull: false,
            },
            writeLevel: {
                type: DataTypes.ENUM("Basic", "Intermediate", "Fluent", "Native"),
                allowNull: false,
            },
        },
        {
            tableName: "candidate_languages",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateLanguage;
};
