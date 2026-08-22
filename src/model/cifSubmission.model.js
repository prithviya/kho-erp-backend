module.exports = (sequelize, DataTypes) => {
    const CifSubmission = sequelize.define(
        "cifSubmission",
        {
            cifappid:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model:"cif_personals",
                    key: "cifid"
                }
            },
            appliedStatus: {
                type: DataTypes.ENUM("Shortlist", "Reject", "Pending"),
                allowNull: false
            }
        },
        {
            tableName: "cif_submissions",
            timestamps: true,
            paranoid: true
        }
    );
    return CifSubmission;
}