const db = require("../models");
const Config = db.config;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 19];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  let attributesString = attributes.slice(1, attributes.length - 1);
  const attributesQuery = attributesString
    ? attributesString.split(",")
    : ["id", "email", "createdAt", "updatedAt"];
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  var options = {
    where: {
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: ranges[1],
  };

  const size = ranges[1] + 1 - ranges[0];
  const current = Math.floor((ranges[1] + 1) / size);
  Config.findAndCountAll(options)
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
      res.status(400).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy danh sách!",
      });
    });
};

const create = async (req, res) => {
  const { email, password } = req.body;
  const config = await Config.findOne({
    where: { email: email },
  });

  if (config) {
    res.status(400).json({
      success: false,
      error: "Cấu hình đã tồn tại!",
      message: "Cấu hình đã tồn tại!",
    });
  } else {
    Config.create({
      id:
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
      email,
      password,
    })
      .then((config) => {
        res.status(200).json({
          results: {
            list: config,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới cấu hình thành công!",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới cấu hình!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  Config.update(
    {
      email: email,
      password: password,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((config) => {
      res.status(200).json({
        results: {
          list: config,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật cấu hình thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật cấu hình!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  Config.destroy({
    where: {
      id: id,
    },
  })
    .then((config) => {
      res.status(200).json({
        results: {
          list: config,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa cấu hình thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa cấu hình!",
      });
    });
};
module.exports = {
  getList,
  create,
  updateRecord,
  deleteRecord,
};
