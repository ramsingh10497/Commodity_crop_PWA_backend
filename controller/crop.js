const db = require("../model");
const Crops = db.crops;

const getAllCrops = async (req, res) => {
  try {
    const crops = await Crops.findAll({
      where: null,
      order: [["id", "DESC"]],
    });
    if (crops.length > 0) {
      res.json({
        success: true,
        data: crops,
      });
    } else {
      res.json({
        success: false,
        data: [],
        message: "No crops found",
      });
    }
  } catch (err) {
    res.json({
      success: false,
      data: null,
      message: err.message || "Something went wrong",
    });
  }
};

module.exports = {
  getAllCrops,
};
