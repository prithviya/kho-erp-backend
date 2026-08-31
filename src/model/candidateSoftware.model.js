module.exports = (sequelize, DataTypes) => {
    const CandidateSoftware = sequelize.define(
        "CandidateSoftware",
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
            toolName: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            proficiencyLevel: {
                type: DataTypes.ENUM("Excellent", "Good", "Average"),
                allowNull: false,
            },
        },
        {
            tableName: "candidate_software",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateSoftware;
};
