const ApiError = require("../utils/apiError");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,     // collect all errors
      allowUnknown: false,   // reject unknown fields (like strict)
      stripUnknown: true,    // remove unknown fields if any slipped in
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new ApiError(400, "Validation error", details));
    }

    req[property] = value;
    next();
  };
};

module.exports = validate;
