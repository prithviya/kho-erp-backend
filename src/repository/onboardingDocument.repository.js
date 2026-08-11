const BaseRepository = require("./base.repository");
const { OnboardingDocument } = require("../model");

class OnboardingDocumentRepository extends BaseRepository {
    constructor() {
        super(OnboardingDocument);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }

    async findByOnboardingInfoId(onboardinginfoid) {
        return await this.model.findAll({
            where: { onboardinginfoid },
        });
    }
}

module.exports = new OnboardingDocumentRepository();