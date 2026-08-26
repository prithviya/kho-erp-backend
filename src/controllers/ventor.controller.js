const ventorRepository = require("../repository/ventor.repository");

const db = require("../model");
const VentorService = db.VentorService;

exports.create = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const ventor = await ventorRepository.create(req.body, { transaction });
        
        if (req.body.services && Array.isArray(req.body.services)) {
            const servicesData = req.body.services.map(s => ({
                ...s,
                vid: ventor.vid
            }));
            await VentorService.bulkCreate(servicesData, { transaction });
        }

        await transaction.commit();
        
        const newVentor = await ventorRepository.findById(ventor.vid);

        return res.status(201).json({
            success: true,
            message: "Ventor created successfully.",
            data: newVentor,
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Create Ventor Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const ventors = await ventorRepository.findAll();

        return res.status(200).json({
            success: true,
            message: "Ventors fetched successfully.",
            data: ventors,
        });
    } catch (error) {
        console.error("Get Ventors Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const { vid } = req.params;

        const ventor = await ventorRepository.findById(vid);

        if (!ventor) {
            return res.status(404).json({
                success: false,
                message: "Ventor not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ventor fetched successfully.",
            data: ventor,
        });
    } catch (error) {
        console.error("Get Ventor Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.update = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { vid } = req.params;

        const ventor = await ventorRepository.findById(vid);
        if (!ventor) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Ventor not found.",
            });
        }

        await ventor.update(req.body, { transaction });

        if (req.body.services && Array.isArray(req.body.services)) {
            // Remove old services
            await VentorService.destroy({ where: { vid }, transaction });
            
            // Insert new services
            const servicesData = req.body.services.map(s => ({
                ...s,
                vid: ventor.vid
            }));
            await VentorService.bulkCreate(servicesData, { transaction });
        }

        await transaction.commit();
        
        const updatedVentor = await ventorRepository.findById(vid);

        return res.status(200).json({
            success: true,
            message: "Ventor updated successfully.",
            data: updatedVentor,
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Update Ventor Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.remove = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { vid } = req.params;

        const ventor = await ventorRepository.findById(vid);
        if (!ventor) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Ventor not found.",
            });
        }

        await VentorService.destroy({ where: { vid }, transaction });
        await ventor.destroy({ transaction });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Ventor deleted successfully.",
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Delete Ventor Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};