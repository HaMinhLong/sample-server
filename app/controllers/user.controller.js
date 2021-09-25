const db = require("../models");
const User = db.user;
const UserGroup = db.userGroup;
const Config = db.config;
const moment = require("moment");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "username",
        "password",
        "fullName",
        "email",
        "userGroupId",
        "mobile",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const username = filters.username || "";
  const userGroupId = filters.userGroupId || "";
  const fullName = filters.fullName || "";
  const email = filters.email || "";
  const mobile = filters.mobile || "";

  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);
  var options = {
    where: {
      [Op.and]: [
        { username: { [Op.like]: "%" + username + "%" } },
        { userGroupId: { [Op.like]: "%" + userGroupId + "%" } },
        { fullName: { [Op.like]: "%" + fullName + "%" } },
        { email: { [Op.like]: "%" + email + "%" } },
        { mobile: { [Op.like]: "%" + mobile + "%" } },
        { status: { [Op.like]: "%" + status + "%" } },
      ],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
    include: [
      {
        model: UserGroup,
        required: true,
        attributes: ["id", "userGroupName"],
      },
    ],
  };

  User.findAndCountAll(options)
    .then((result) => {
      res.status(200).json({
        results: {
          list: result.rows,
          pagination: {
            total: result.count,
            pageSize: size,
            current: current,
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
        message: "Xảy ra lỗi khi lấy danh sách!",
      });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  User.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: UserGroup,
        required: true,
        attributes: ["id", "userGroupName"],
      },
    ],
  })
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
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
        message: "Xảy ra lỗi khi lấy thông tin tài khoản!",
      });
    });
};

const create = async (req, res) => {
  const {
    id,
    username,
    password,
    fullName,
    email,
    mobile,
    userGroupId,
    status,
  } = req.body;
  const config = await Config.findAll({});
  const mailFrom =
    config && config[0] && config[0].email
      ? config[0].email
      : "a34526@thanglong.edu.vn";
  const passwordEmail =
    config && config[0] && config[0].password
      ? config[0].password
      : "Na+89-K-2";

  User.create({
    id:
      id ||
      Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
    username,
    password: bcrypt.hashSync(password, 8),
    status,
    fullName,
    email,
    mobile,
    userGroupId,
  })
    .then((user) => {
      var transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          auth: {
            user: mailFrom,
            pass: passwordEmail,
          },
        })
      );
      var mailOptions = {
        from: mailFrom,
        to: email,
        subject: "Thông tin đăng nhập",
        text: `Tên đăng nhập: ${username}, Mật khẩu: ${password}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(200).json({
            success: false,
            error: error,
            message: "Đã xảy ra lỗi khi gửi email!",
          });
        } else {
          res.status(200).json({
            results: {
              list: user,
              pagination: [],
            },
            success: true,
            error: info.response,
            message: "Tạo mới tài khoản thành công!",
          });
        }
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới tài khoản!",
      });
    });
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    usernameOld,
    fullName,
    email,
    mobile,
    userGroupId,
    status,
  } = req.body;
  const user = await User.findOne({
    where: { username: username },
  });
  if (user && username !== usernameOld) {
    res.status(200).json({
      success: false,
      error: "Tài khoản đã tồn tại!",
      message: "Tài khoản đã tồn tại!",
    });
  } else {
    User.update(
      {
        status: status,
        username: username,
        fullName: fullName,
        email: email,
        mobile: mobile,
        userGroupId: userGroupId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((user) => {
        res.status(200).json({
          results: {
            list: user,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật tài khoản thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật tài khoản!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  User.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật trạng thái thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật trạng thái!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  User.destroy({
    where: {
      id: id,
    },
  })
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa tài khoản thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi xóa tài khoản!",
      });
    });
};
const currentUser = (req, res) => {
  const { userId } = req;
  User.findByPk(userId).then((user) => {
    res.status(200).json({
      results: {
        list: user,
        pagination: [],
      },
      status: true,
      error: "",
      message: "",
    });
  });
};
const changePasswordLogin = (req, res) => {
  const { userId } = req;
  const { newPassword } = req.body;
  User.update(
    { password: bcrypt.hashSync(newPassword, 8), status: 1 },
    {
      where: {
        id: userId,
      },
    }
  )
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        status: true,
        error: "",
        message: "Đổi mật khẩu thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        status: false,
        error: err.message,
        message: "Xảy ra lỗi khi đổi mật khẩu!",
      });
    });
};
const changePasswordNotLogin = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!user) {
    res.status(200).json({
      status: false,
      error: "Tài khoản không tồn tại!",
      message: "Tài khoản không tồn tại!",
    });
  }

  var passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
  if (!passwordIsValid) {
    res.status(401).json({
      success: false,
      error: "Vui lòng nhập đúng mật khẩu!",
      message: "Vui lòng nhập đúng mật khẩu!",
    });
  }
  if (user && passwordIsValid) {
    User.update(
      { password: bcrypt.hashSync(newPassword, 8), status: 1 },
      {
        where: {
          username: username,
        },
      }
    )
      .then((user) => {
        res.status(200).json({
          results: {
            list: user,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Đổi mật khẩu thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi đổi mật khẩu!",
        });
      });
  }
};
const forgetPassword = async (req, res) => {
  const { emailTo, subject } = req.body;
  const user = await User.findOne({
    where: {
      email: emailTo,
    },
  });
  const config = await Config.findAll({});
  const mailFrom =
    config && config[0] && config[0].email
      ? config[0].email
      : "a34526@thanglong.edu.vn";
  const password =
    config && config[0] && config[0].password
      ? config[0].password
      : "Na+89-K-2";

  if (!user) {
    res.status(200).json({
      status: false,
      error: "Vui lòng nhập đúng email tài khoản của bạn!",
      message: "Vui lòng nhập đúng email tài khoản của bạn!",
    });
  } else {
    var transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: mailFrom,
          pass: password,
        },
      })
    );
    const passwordReset = Math.random().toString(36).substr(2, 10);
    var mailOptions = {
      from: mailFrom,
      to: emailTo,
      subject: subject,
      text: `Mật khẩu của bạn đã được thay đổi thành ${passwordReset}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(200).json({
          success: false,
          error: error,
          message: "Đã xảy ra lỗi khi gửi email tới bạn!",
        });
      } else {
        res.status(200).json({
          success: true,
          error: info.response,
          message: "Mật khẩu mới đã được gửi tới email của bạn!",
        });
        User.update(
          { password: bcrypt.hashSync(passwordReset, 8) },
          {
            where: {
              email: emailTo,
            },
          }
        );
      }
    });
  }
};

module.exports = {
  getList,
  getOne,
  create,
  updateRecord,
  updateStatus,
  deleteRecord,
  currentUser,
  changePasswordLogin,
  changePasswordNotLogin,
  forgetPassword,
};
