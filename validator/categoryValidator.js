exports.categoryValidator = async (req, res, next) => {
    try {
        req.check('title', 'Title cannot be empty')
            .not()
            .isEmpty()
            .isLength({
                min: 6,
                max: 32,
            })
            .withMessage(
                'Category title cannot be lees than 6 characters and more that 32'
            );
        req.check('about', 'Category description (about) cannot be empty')
            .not()
            .isEmpty()
            .isLength({
                min: 6,
                max: 48,
            })
            .withMessage(
                'Category description (about) cannot be lees than 6 characters and more that 48'
            );

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
