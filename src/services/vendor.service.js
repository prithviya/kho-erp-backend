const BaseService = require("./base.service");
const repository = require("../repository/vendor.repository");

class VendorService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const name = data.vendor_name || data.name;
        if (name) {
            const existingVendor = await repository.findByName(name);
            if (existingVendor) {
                throw new Error("Vendor name already exists.");
            }
        }
        return super.create(data);
    }

    async getAll() {
        return repository.findAll();
    }

    async getById(id) {
        const vendor = await repository.findById(id);
        if (!vendor) {
            throw new Error("Vendor not found.");
        }
        return vendor;
    }

    async update(id, data) {
        const vendor = await repository.findById(id);
        if (!vendor) {
            throw new Error("Vendor not found.");
        }

        const newName = data.vendor_name || data.name;
        if (newName && newName !== vendor.vendor_name) {
            const existingVendor = await repository.findByName(newName);
            if (existingVendor) {
                throw new Error("Vendor name already exists.");
            }
        }

        return repository.updateVendor(id, data);
    }

    async delete(id) {
        return repository.delete(id);
    }
}

module.exports = new VendorService();