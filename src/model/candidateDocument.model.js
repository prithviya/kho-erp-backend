module.exports = (sequelize, DataTypes) => {
    const CandidateDocument = sequelize.define(
        "CandidateDocument",
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
            documentType: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            fileName: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            fileUrl: {
                type: DataTypes.STRING(512),
                allowNull: true,
            },
        },
        {
            tableName: "candidate_documents",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateDocument;
};
