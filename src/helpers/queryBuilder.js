const { Op } = require("sequelize");

class QueryBuilder {

    static buildSearch(search, fields = []) {

        if (!search)
            return {};

        return {

            [Op.or]: fields.map(field => ({
                [field]: {
                    [Op.like]: `%${search}%`
                }
            }))

        };

    }

    static buildSorting(query) {

        const sortBy = query.sortBy || "id";

        const order = query.order || "DESC";

        return [[sortBy, order]];

    }

}

module.exports = QueryBuilder;