// Feature Management Routes
// API endpoints for feature flag management

const express = require("express");
const router = express.Router();
const featureController = require("../controllers/featureController");
const { body, param } = require("express-validator");

/**
 * Middleware: Verify admin access
 * (Assumes authenticated user is verified as admin)
 */
const requireAdmin = (req, res, next) => {
    // TODO: Implement admin verification
    // For now, assumes req.user.isAdmin exists
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({
            success: false,
            error: "Admin access required",
        });
    }
};

/**
 * GET /api/admin/features
 * List all features
 */
router.get("/", requireAdmin, featureController.getAllFeatures);

/**
 * GET /api/admin/features/:name
 * Get specific feature status
 */
router.get(
    "/:name",
    requireAdmin,
    param("name").trim().notEmpty().withMessage("Feature name is required"),
    featureController.getFeature
);

/**
 * PUT /api/admin/features/:name
 * Update feature status
 */
router.put(
    "/:name",
    requireAdmin,
    param("name").trim().notEmpty().withMessage("Feature name is required"),
    body("status")
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["required", "optional", "disabled"])
        .withMessage("Status must be: required, optional, or disabled"),
    featureController.updateFeatureStatus
);

/**
 * PUT /api/admin/features/:name/config
 * Update feature configuration
 */
router.put(
    "/:name/config",
    requireAdmin,
    param("name").trim().notEmpty().withMessage("Feature name is required"),
    body("config").isObject().withMessage("Config must be a valid object"),
    featureController.updateFeatureConfig
);

/**
 * DELETE /api/admin/features/:name
 * Delete feature (reset to default)
 */
router.delete(
    "/:name",
    requireAdmin,
    param("name").trim().notEmpty().withMessage("Feature name is required"),
    featureController.deleteFeature
);

/**
 * POST /api/admin/features/initialize
 * Initialize default features
 */
router.post("/initialize", requireAdmin, featureController.initializeFeatures);

/**
 * GET /api/features/check/:name
 * Check feature status (public endpoint for frontend)
 * No admin auth required - frontend needs to check features
 */
router.get("/check/:name", featureController.checkFeature);

module.exports = router;
