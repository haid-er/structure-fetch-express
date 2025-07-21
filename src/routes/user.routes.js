const { fetchOrgChartJsonController, saveOrgChartDataController } = require("../controllers/user.controller");

const { upload } = require("../middlewares/multer.middleware");
const router = require("express").Router();


router.post("/fetch-json", upload.single("orgchart"), fetchOrgChartJsonController);

router.put("/save-data", saveOrgChartDataController);

module.exports = router;
