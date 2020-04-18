exports.userSignupValidator = (req, res, next) => {
    try {
        req.check('name', 'Name is required').notEmpty();
        req.check('email', 'email must be between 3 to 32 characters')
            .matches(/.+\@.+\..+/)
            .withMessage('Email must contain @')
            .isLength({
                min: 4,
                max: 32,
            });
        req.check('password', 'Password is required').notEmpty();
        req.check('password')
            .isLength({ min: 6 })
            .withMessage('Password must contain at least 6 characters')
            .matches(/\d/)
            .withMessage('Password must contain a number');

        const errors = req.validationErrors();

        if (errors) {
            let errorMessages = {
                errors: [],
            };

            errors.map((error) =>
                errorMessages.errors.push({ msg: error.msg })
            );
            return res.status(400).json(errorMessages);
        }

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};

exports.userSigninValidator = (req, res, next) => {
    try {
        req.check('email', 'Please include a valid email').isEmail();
        req.check('password', 'Password is required').exists();

        const errors = req.validationErrors();

        if (errors) {
            let errorMessages = {
                errors: [],
            };

            errors.map((error) =>
                errorMessages.errors.push({ msg: error.msg })
            );
            return res.status(400).json(errorMessages);
        }
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};
