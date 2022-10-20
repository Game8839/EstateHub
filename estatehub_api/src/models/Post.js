module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      area: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      position: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      currentPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      image: {
        type: DataTypes.STRING,
      },
      document: {
        type: DataTypes.STRING,
      },
      isTranferFee: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultVallue: false,
        validate: {
          notEmpty: true,
        },
      },
      estateType: {
        type: DataTypes.ENUM('ns4', 'ns3k', 'ns3', 'spk01'),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'dealclosed', 'dealfail'),
        allowNull: false,
        defaultValue: 'active',
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      underscored: true,
    }
  );
  Post.associate = (db) => {
    Post.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.hasMany(db.Comment, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Post.hasMany(db.Bookmark, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
    Post.hasMany(db.BidPrice, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };
  return Post;
};
