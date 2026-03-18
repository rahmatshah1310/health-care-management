const { sequelize } = require("../models/index");

const testConnection = async () => {
  try {
    console.log("Attempting to connect to PostgreSQL...");
    console.log("connnction Deatails:", {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
    });

    await sequelize.authenticate();
    console.log("Succesfully connected to PostgreSQL database");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to PostgreSQL database");
    console.error("Error message: ", error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
};
