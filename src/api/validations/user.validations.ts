import Joi from 'joi';

const validateUserEdit = (data: object) => {
  const scheme = Joi.object({
    name: Joi.string().min(4),
    place: Joi.string().min(6),
    jobDescription: Joi.string().min(3),
  });

  return scheme.validate(data);
};

export default {
  validateUserEdit,
};
