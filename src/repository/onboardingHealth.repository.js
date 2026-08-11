const BaseRepository = require("./base.repository");
const { OnboardingHealth } = require("../model");

class OnboardingHealthRepository extends BaseRepository {
    constructor() {
        super(OnboardingHealth);
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

module.exports = new OnboardingHealthRepository();