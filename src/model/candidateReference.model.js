module.exports = (sequelize, DataTypes) => {
    const CandidateReference = sequelize.define(
        "CandidateReference",
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
            referenceName: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            referenceEmail: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            referencePhone: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            consentConfirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "candidate_references",
            timestamps: true,
            paranoid: true,
        }
    );

    return CandidateReference;
};
