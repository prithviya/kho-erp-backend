const ventorServiceRepository = require("../repository/ventorService.repository");

exports.create = async (req, res) => {
    try {
        const data = await ventorServiceRepository.create(req.body);

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
};

exports.getAll = async (req, res) => {
    try {
        const data = await ventorServiceRepository.findAll();

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
};

exports.getById = async (req, res) => {
    try {
        const { vserid } = req.params;

        const data =
            await ventorServiceRepository.findById(vserid);

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
};

exports.getByVendor = async (req, res) => {
    try {
        const { vid } = req.params;

        const data =
            await ventorServiceRepository.findByVendor(vid);

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
};

exports.update = async (req, res) => {
    try {
        const { vserid } = req.params;

        const data =
            await ventorServiceRepository.update(
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
        console.error(
            "Update Vendor Service Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const { vserid } = req.params;

        const data =
            await ventorServiceRepository.remove(vserid);

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
        console.error(
            "Delete Vendor Service Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};