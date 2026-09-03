const BaseRepository = require("./base.repository");
const { Vendor } = require("../model");

class VendorRepository extends BaseRepository {
    constructor() {
        super(Vendor);
    }

    async findAll() {
        return await this.model.findAll();
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async findByName(vendorName) {
        return await this.model.findOne({
            where: { vendor_name: vendorName }
        });
    }

    async updateVendor(id, data) {
        const vendor = await this.model.findByPk(id);
        if (!vendor) {
            throw new Error("Vendor not found.");
        }
        return await vendor.update(data);
    }

    async delete(id) {
        const vendor = await this.model.findByPk(id);
        if (!vendor) {
            throw new Error("Vendor not found.");
        }
        return await vendor.destroy();
    }
}

module.exports = new VendorRepository();