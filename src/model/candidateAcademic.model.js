module.exports = (sequelize, DataTypes) => {
    const CandidateAcademic = sequelize.define(
        "CandidateAcademic",
        {
            academicid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
            degree: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            institution: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            university: {
                type: DataTypes.STRING(200),
                allowNull: false,
                field: "institution",
            },
            board: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            year: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            graduationYear: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "year",
            },
            percentage: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            grade: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "percentage",
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
        },
        {
            tableName: "candidate_education",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateAcademic;
};
