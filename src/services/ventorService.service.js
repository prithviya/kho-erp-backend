const ventorServiceRepository = require("../repository/ventorService.repository");

const createService = async (data) => {
    return await ventorServiceRepository.create(data);
};

const getAllServices = async () => {
    return await ventorServiceRepository.findAll();
};

const getServiceById = async (vserid) => {
    return await ventorServiceRepository.findById(vserid);
};

const getServicesByVendor = async (vid) => {
    return await ventorServiceRepository.findByVendor(vid);
};

const updateService = async (vserid, data) => {
    return await ventorServiceRepository.update(vserid, data);
};

const deleteService = async (vserid) => {
    return await ventorServiceRepository.remove(vserid);
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    getServicesByVendor,
    updateService,
    deleteService,
};