const db = require("../model");

const VentorService = db.VentorService;

const create = async (data) => {
    return await VentorService.create(data);
};

const findAll = async () => {
    return await VentorService.findAll({
        order: [["createdAt", "DESC"]],
    });
};

const findById = async (vserid) => {
    return await VentorService.findOne({
        where: { vserid },
    });
};

const findByVendor = async (vid) => {
    return await VentorService.findAll({
        where: { vid },
        order: [["createdAt", "DESC"]],
    });
};

const update = async (vserid, data) => {
    const service = await findById(vserid);

    if (!service) {
        return null;
    }

    return await service.update(data);
};

const remove = async (vserid) => {
    const service = await findById(vserid);

    if (!service) {
        return null;
    }

    await service.destroy();

    return service;
};

module.exports = {
    create,
    findAll,
    findById,
    findByVendor,
    update,
    remove,
};