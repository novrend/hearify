'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Playlist, {foreignKey: 'UserId'})
    }
    get greetings() {
      let today = new Date()
      let curHr = today.getHours()
      if (curHr < 12) {
        return 'Good morning '
      } else if (curHr < 18) {
        return 'Good afternoon '
      } else {
        return 'Good evening '
      }
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Username already taken"
      },
      allowNull: false,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "Only alphanumeric characters"
        },
        notNull: {
          args: true,
          msg: "Username cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Username cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Email already taken"
      },
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Email invalid"
        },
        notNull: {
          args: true,
          msg: "Email cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Email cannot be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Password cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Password cannot be empty"
        },
        len : {
          args: [6,32],
          msg: "Minimum 6 characters and maximum 32 characters"
        },
        validatePassword(password) {
          if (!(password.match(/[a-zA-Z]/) && password.match(/[0-9]/))) {
            throw new Error("Password must contain letter and number")
          }
        },
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    modelName: 'User',
  });
  return User;
};