const { default: mongoose } = require("mongoose");
const { DB_NAME, MONGO_URI } = process.env;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `MONGODB CONNECTION SUCCESSFUL ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB CONNECTION FAILED", error);
    process.exit(1);
  }
};

module.exports = connectDB;
