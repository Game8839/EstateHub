module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {}, { underscored: true });
  Bookmark.associate = (db) => {
    Bookmark.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Bookmark.belongsTo(db.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return Bookmark;
};
