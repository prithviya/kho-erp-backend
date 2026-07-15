const BaseRepository = require("./base.repository");
const { Module } = require("../model");

class ModuleRepository extends BaseRepository {

    constructor() {
        super(Module);
    }

    findByCode(code) {
        return Module.findOne({
            where: { code }
        });
    }

}

module.exports = new ModuleRepository();