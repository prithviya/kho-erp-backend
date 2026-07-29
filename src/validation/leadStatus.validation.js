exports.create = {
    name: {
        notEmpty: {
            errorMessage: "Name is required."
        }
    },
    code: {
        notEmpty: {
            errorMessage: "Code is required."
        }
    }
};