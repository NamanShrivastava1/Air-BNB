require("dotenv").config();
const app = require("./src/app.js");
const connectToDb = require("./src/config/db/db.js");
const PORT = process.env.PORT || 4000;

connectToDb();

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
