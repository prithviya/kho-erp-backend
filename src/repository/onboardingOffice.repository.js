const BaseRepository = require("./base.repository");
const { OnboardingOffice } = require("../model");

class OnboardingOfficeRepository extends BaseRepository {
    constructor() {
        super(OnboardingOffice);
    }

    async findByCifId(cifid) {
        return await this.model.findOne({
            where: { cifid },
        });
    }

    async findByOnboardingInfoId(onboardinginfoid) {
        return await this.model.findOne({
            where: { onboardinginfoid },
        });
    }
}

module.exports = new OnboardingOfficeRepository();