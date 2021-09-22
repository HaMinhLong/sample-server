const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signUp = (req, res) => {
  const { username, email, password } = res.body;
  // Save User to Database
  User.create({
    id:
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
      100000000000,
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 8),
  })
    .then((user) => {
      res.json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Đăng ký tài khoản thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi đăng ký tài khoản!",
      });
    });
};

const signIn = (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    where: {
      username: username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          success: false,
          error: "Tài khoản không tồn tại!",
          message: "Tài khoản không tồn tại!",
        });
      }
      console.log("user", user);
      if (user.status === -2) {
        return res.status(200).json({
          success: false,
          error:
            "Tài khoản của ban chưa được kích hoạt. Vui lòng đổi mật khẩu đề kích hoạt tài khoản!",
          message:
            "Tài khoản của ban chưa được kích hoạt. Vui lòng đổi mật khẩu đề kích hoạt tài khoản!",
        });
      }
      if (user.status === 0 || user.status === -1) {
        return res.status(200).json({
          success: false,
          error: "Tài khoản của ban không được phép đăng nhập!",
          message: "Tài khoản của ban không được phép đăng nhập!",
        });
      }
      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(200).json({
          success: false,
          accessToken: null,
          error: "Vui lòng nhập đúng mật khẩu!",
          message: "Vui lòng nhập đúng mật khẩu!",
        });
      }

      var token = jwt.sign(
        { id: user.id, userGroupId: user.userGroupId },
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      res.status(200).json({
        results: {
          list: {
            id: user.id,
            username: user.username,
            userGroupId: user.userGroupId,
            email: user.email,
            accessToken: token,
          },
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi đăng nhập!",
      });
    });
};

module.exports = {
  signUp,
  signIn,
};
