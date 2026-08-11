module.exports = (sequelize, DataTypes) => {
    const Recruitment = sequelize.define(
        "Recruitment",
        {
            rid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cif_personals",
                    key: "cifid",
                },
            },

            // Interview Details
            interviewDateTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            interviewMode: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },

            // Internal Feedback & Review Process
            hrScreeningFeedback: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            technicalInterviewFeedback: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            mdFeedback: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            // Final Decision
            recruitmentStatus: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },

            statusChangeNote: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "recruitments",
            timestamps: true,
            paranoid: true,
        }
    );

    return Recruitment;
};