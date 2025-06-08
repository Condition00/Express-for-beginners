export const createUserValidationSchema = {
    name: {
        isLength: {
            options: { min: 5,
                       max: 32,
                     },
            errorMessage: 'Name must be between 1 and 32 characters long.',
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty.',
        },
        isString: {
            errorMessage: 'Name must be a string.',
        },
    },
    displayName: {
        isLength: {
            options: { min: 3,
                       max: 32,
                     },
            errorMessage: 'Display name must be between 1 and 32 characters long.',
        },
        notEmpty: {
            errorMessage: 'Display name cannot be empty.',
        },
        isString: {
            errorMessage: 'Display name must be a string.',
        },
    },
};
