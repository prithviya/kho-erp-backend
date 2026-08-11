const BaseRepository = require("./base.repository");
const { OnboardingBank } = require("../model");

class OnboardingBankRepository extends BaseRepository {
    constructor() {
        super(OnboardingBank);
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

module.exports = new OnboardingBankRepository();