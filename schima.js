const joi = require("joi");

module.exports = placeSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("null"),
    price: joi.number().required(),
    location: joi.string().required(),
    country: joi.string().required(),
});