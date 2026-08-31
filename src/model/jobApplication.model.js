module.exports = (sequelize, DataTypes) => {
    const JobApplication = sequelize.define(
        "JobApplication",
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
            openingId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "openings",
                    key: "jobid",
                },
            },
            status: {
                type: DataTypes.ENUM("APPLIED", "SHORTLISTED", "INTERVIEW", "REJECTED", "OFFERED", "JOINED"),
                allowNull: false,
                defaultValue: "APPLIED",
            },
            source: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "job_applications",
            timestamps: true,
            paranoid: true,
        }
    );

    return JobApplication;
};
