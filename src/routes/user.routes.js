const { fetchOrgChartJsonController, saveOrgChartDataController } = require("../controllers/user.controller");
const {
} = require("../validators/auth.schema");
const { upload } = require("../middlewares/multer.middleware");
const router = require("express").Router();

// router.post(
//   "/update-avatar",
//   upload.single("avatar"),
//   verifyJWT,
//   updateUserAvatar
// );

router.post("/fetch-json", upload.single("orgchart"), fetchOrgChartJsonController);

router.put("/save-data", saveOrgChartDataController);

module.exports = router;
