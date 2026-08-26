const ventorRepository =
    require("../repository/ventor.repository");

const createVentor = async (data) => {
    return await ventorRepository.create(data);
};

const getAllVentors = async () => {
    return await ventorRepository.findAll();
};

const getVentorById = async (vid) => {
    return await ventorRepository.findById(vid);
};

const updateVentor = async (vid, data) => {
    return await ventorRepository.update(vid, data);
};

const deleteVentor = async (vid) => {
    return await ventorRepository.remove(vid);
};

module.exports = {
    createVentor,
    getAllVentors,
    getVentorById,
    updateVentor,
    deleteVentor,
};