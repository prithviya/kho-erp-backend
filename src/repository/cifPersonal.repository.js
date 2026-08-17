const BaseRepository = require("./base.repository");


const { CifPersonal, CifAcademic, CifExperience, CifLanguage, CifSoftware, CifSkill, CifReference } = require("../model");

class CifPersonalRepository extends BaseRepository {
    constructor() {
        super(CifPersonal);
    }

    async findByEmail(email) {
        return await this.model.findOne({
            where: { email },
        });
    }

    async findByPhoneNumber(phoneNumber) {
        return await this.model.findOne({
            where: { phoneNumber },
        });
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }
    async findByPersonId(personId) {
        return await this.model.findOne({
            where: {
                cifid: personId,
            },
            include: [
                {
                    model: CifAcademic,
                    as: "Academic",
                },
                {
                    model: CifExperience,
                    as: "Experience",
                },
                {
                    model: CifLanguage,
                    as: "Language",
                },
                {
                    model: CifSoftware,
                    as: "Software",
                },
                {
                    model: CifSkill,
                    as: "Skills",
                },
                {
                    model: CifReference,
                    as: "reference",
                },
            ],
        });
    }
}

module.exports = new CifPersonalRepository();