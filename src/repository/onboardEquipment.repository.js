const BaseRepository = require("./base.repository");
const { OnboardEquipment } = require("../model");

class OnboardEquipmentRepository extends BaseRepository {
    constructor() {
        super(OnboardEquipment);
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

module.exports = new OnboardEquipmentRepository();