const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./model");
const Crops = db.crops;
require("dotenv").config();

const UserRouter = require("./routes/user");
const ReportRouter = require("./routes/report");
const CropRouter = require("./routes/crop");
const { dummyCrops } = require("./constants");

const PORT = process.env.PORT ?? 8000;

const app = express();
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(cors());

app.use("/images", express.static("images"));
app.use("/reports", express.static("reports"));

db.sequelize
  .sync({
    force: true,
  })
  .then(async () => {
    await Crops.bulkCreate(dummyCrops);
    console.log("Dummy Data Created successfully.");
  });

app.get("/", (req, res) => {
  return res.send("Backend Working properly");
});

app.use("/api/users", UserRouter);
app.use("/api/reports", ReportRouter);
app.use("/api/crops", CropRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
