module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {}, { underscored: true });

  Follow.associate = (db) => {
    Follow.belongsTo(db.User, {
      as: 'UserFollower',
      foreignKey: {
        name: 'userFollower',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Follow.belongsTo(db.User, {
      as: 'UserBeingFollowed',
      foreignKey: {
        name: 'userBeingFollow',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return Follow;
};
