exports.postValidator = (req, res, next) => {
    try {
        req.check("title", "A post must have a title")
            .not()
            .isEmpty()
            .isLength({
                min: 6,
                max: 70,
            })
            .withMessage(
                "Post title can't be less than 6 characters and more than 70"
            );
        req.check("description", "A blog must have a body, a description")
            .not()
            .isEmpty()
            .isLength({
                min: 6,
                max: 2000,
            })
            .withMessage(
                "For performance reasons, a blog post cannot be more than 2000 characters long and less than 6 characters"
            );
        req.check("categories", "A post must have at least one tag/category")
            .not()
            .isEmpty();

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
        return res.status(500).send("Server error");
    }
};
