module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      Description: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImage: DataTypes.STRING,
      coverImage: DataTypes.STRING,
    },
    { underscored: true }
  );
  User.associate = (db) => {
    User.hasMany(db.Post, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },

      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    User.hasMany(db.Comment, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.Bookmark, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.Follow, {
      as: 'UserFollower',
      foreignKey: {
        name: 'userFollower',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.Follow, {
      as: 'UserBeingFollower',
      foreignKey: {
        name: 'userBeingFollow',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    User.hasMany(db.BidPrice, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return User;
};
