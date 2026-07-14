module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },

      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },

      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      role: {
        type: DataTypes.STRING(255),
        defaultValue: 'CRM'
      },

      privileges: {
        type: DataTypes.STRING(255),
        defaultValue: 'create,edit'
      }
    },
    {
      tableName: 'users',

      timestamps: true,

      createdAt: 'created_at',

      updatedAt: 'updated_at'
    }
  );

  return User;
};