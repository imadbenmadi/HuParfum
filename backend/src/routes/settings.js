// Settings Routes
// CRUD operations for website settings

const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { protectAdmin } = require("../middlewares/auth");

// Admin protected routes
router.get("/", protectAdmin, settingsController.getAllSettings);
router.get("/:key", protectAdmin, settingsController.getSetting);
router.get(
    "/category/:category",
    protectAdmin,
    settingsController.getSettingsByCategory
);
router.put("/:key", protectAdmin, settingsController.updateSetting);
router.patch("/:key", protectAdmin, settingsController.updateSettingFields);
router.post("/:key/reset", protectAdmin, settingsController.resetSetting);
router.delete("/:key", protectAdmin, settingsController.deleteSetting);

module.exports = router;
