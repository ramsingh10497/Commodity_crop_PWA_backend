const multer = require("multer");
const db = require("../model");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const Reports = db.reports;
const Users = db.users;
const Crops = db.crops;

try {
  if (!fs.existsSync("./image_data")) {
    fs.mkdirSync("./image_data");
  }
} catch (err) {
  console.error(err);
}

try {
  if (!fs.existsSync("./reports_data")) {
    fs.mkdirSync("./reports_data");
  }
} catch (err) {
  console.error(err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    let newName = `${Date.now()}_${file.originalname}`;
    cb(null, newName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpg", "image/jpeg"].indexOf(file.mimetype) >= 0) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png .jpg and .jpeg are allowed"));
    }
  },
});

const generatePdf = async ({ result, path }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const pdf_path = `reports_data/${Date.now()}.pdf`;
      doc.pipe(fs.createWriteStream(pdf_path));
      doc.fontSize(27).text(result, 100, 100);

      // Adding an image in the pdf.

      doc.image(path, {
        fit: [300, 300],
        align: "center",
        valign: "center",
      });
      doc.end();
      resolve({
        success: true,
        pdf_path: pdf_path,
      });
    } catch (err) {
      console.log("ERROR", err);
      resolve({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  });
};

const generateReport = async (req, res) => {
  upload.single("cropImage")(req, res, async (err) => {
    if (err) {
      return res.json({
        success: false,
        data: null,
        message: err.message,
      });
    }
    try {
      const { cropId } = req.body;
      if (!cropId) {
        return res.json({
          success: false,
          data: null,
          message: "Crop id is required",
        });
      }
      if (!req.file) {
        return res.json({
          success: false,
          data: null,
          message: "Invalid or Blank File",
        });
      }
      const { encoding, path, size } = req.file;
      const { success, pdf_path, message } = await generatePdf({
        result: "This is your Cropped image.",
        path: path,
      });
      if (success) {
        const report = {
          result: "This is your Cropped image.",
          image_path: path,
          pdf_path: pdf_path,
          cropId: cropId,
          userId: 1,
        };
        const result = await Reports.create(report);

        return res.json({
          success: true,
          data: result,
        });
      } else {
        return res.json({
          success: false,
          data: null,
          message: message || "Not able to generate result",
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: null,
        message: err.message,
      });
    }
  });
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Reports.findAll({
      include: [
        {
          model: Crops,
          as: "crop",
          required: true,
        },
        {
          model: Users,
          as: "user",
          required: true,
        },
      ],
    });
    if (reports.length > 0) {
      res.json({
        success: true,
        data: reports,
      });
    } else {
      res.json({
        success: false,
        data: [],
        message: "No reports found",
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
  generateReport,
  getAllReports,
};
