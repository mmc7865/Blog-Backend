require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT)
  connectDB();
});
