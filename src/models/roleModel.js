const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.hasMany(models.User, { foreignKey: 'id', as: 'users' });
    }
  }

  Role.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role_desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Role;
};
