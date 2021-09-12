module.exports = {
  HOST: "localhost",
  USER: "halong",
  PASSWORD: "Na+89-K-2",
  DB: "authdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
