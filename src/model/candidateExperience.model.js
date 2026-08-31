module.exports = (sequelize, DataTypes) => {
    const CandidateExperience = sequelize.define(
        "CandidateExperience",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            eid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "id",
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
            companyName: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            designation: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING(150),
                allowNull: false,
                field: "designation",
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            totalExperienceYears: {
                type: DataTypes.DECIMAL(4, 2),
                allowNull: true,
            },
            totalExperience: {
                type: DataTypes.DECIMAL(4, 2),
                allowNull: true,
                field: "totalExperienceYears",
            },
            reasonForLeaving: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            tableName: "candidate_experience",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateExperience;
};
