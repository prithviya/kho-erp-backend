const express = require("express");
const router = express.Router();

const ventorServiceService = require("../services/ventorService.service");

// Create vendor service
router.post("/", async (req, res) => {
    try {
        const data = await ventorServiceService.createService(req.body);

        return res.status(201).json({
            success: true,
            message: "Vendor service created successfully.",
            data,
        });
    } catch (error) {
        console.error("Create Vendor Service Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Get all vendor services
router.get("/", async (req, res) => {
    try {
        const data =
            await ventorServiceService.getAllServices();

        return res.status(200).json({
            success: true,
            message: "Vendor services fetched successfully.",
            data,
        });
    } catch (error) {
        console.error("Get Vendor Services Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Get vendor services by vendor ID
router.get("/vendor/:vid", async (req, res) => {
    try {
        const { vid } = req.params;

        const data =
            await ventorServiceService.getServicesByVendor(vid);

        return res.status(200).json({
            success: true,
            message: "Vendor services fetched successfully.",
            data,
        });
    } catch (error) {
        console.error(
            "Get Vendor Services By Vendor Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Get vendor service by ID
router.get("/:vserid", async (req, res) => {
    try {
        const { vserid } = req.params;

        const data =
            await ventorServiceService.getServiceById(vserid);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Vendor service not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor service fetched successfully.",
            data,
        });
    } catch (error) {
        console.error("Get Vendor Service Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Update vendor service
router.put("/:vserid", async (req, res) => {
    try {
        const { vserid } = req.params;

        const data =
            await ventorServiceService.updateService(
                vserid,
                req.body
            );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Vendor service not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor service updated successfully.",
            data,
        });
    } catch (error) {
        console.error("Update Vendor Service Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Delete vendor service
router.delete("/:vserid", async (req, res) => {
    try {
        const { vserid } = req.params;

        const data =
            await ventorServiceService.deleteService(vserid);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Vendor service not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor service deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Vendor Service Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;