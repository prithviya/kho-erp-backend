const BaseRepository = require("./base.repository");
const { Onboarding } = require("../model");

class OnboardingRepository extends BaseRepository {
    constructor() {
        super(Onboarding);
    }

    async findByCifId(cifid) {
        return await this.model.findOne({
            where: { cifid },
        });
    }

    async findSelectedCandidates() {
        return await this.model.findAll({
            where: { status: "Selected" },
            raw: true,
        });
    }
}

module.exports = new OnboardingRepository();