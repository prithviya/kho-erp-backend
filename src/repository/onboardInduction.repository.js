const BaseRepository = require("./base.repository");
const { OnboardInduction } = require("../model");

class OnboardInductionRepository extends BaseRepository {
    constructor() {
        super(OnboardInduction);
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

module.exports = new OnboardInductionRepository();