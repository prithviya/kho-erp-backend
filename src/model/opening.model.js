module.exports = (sequelize, DataTypes) => {
    const Opening = sequelize.define(
        "opening",
        {
            jobid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            code: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: true
            },

            jobTitle: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            departmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "departments",
                    key: "id"
                }
            },

            openingCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },

            requiredSkills: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

            minExperience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0
                }
            },

            jobDescription: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            tableName: "openings",
            timestamps: true,
            paranoid: true
        }
    );

    return Opening;
};