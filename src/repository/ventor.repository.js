const db = require("../model");

const Ventor = db.Ventor;

const create = async (data, options = {}) => {
    return await Ventor.create(data, options);
};

const findAll = async () => {
    return await Ventor.findAll({
        include: ["services"],
        order: [["createdAt", "DESC"]],
    });
};

const findById = async (vid) => {
    return await Ventor.findOne({
        where: { vid },
        include: ["services"],
    });
};

const update = async (vid, data) => {
    const ventor = await findById(vid);

    if (!ventor) {
        return null;
    }

    return await ventor.update(data);
};

const remove = async (vid) => {
    const ventor = await findById(vid);

    if (!ventor) {
        return null;
    }

    await ventor.destroy();

    return ventor;
};

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove,
};