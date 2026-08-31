module.exports = (sequelize, DataTypes) => {
    const CandidateSkill = sequelize.define(
        "CandidateSkill",
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
            skillName: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            skillLevel: {
                type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced", "Expert"),
                allowNull: false,
            },
            experienceYears: {
                type: DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            provider: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            tableName: "candidate_skills",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateSkill;
};
