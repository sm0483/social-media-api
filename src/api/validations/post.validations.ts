import Joi from 'joi';

const validatePost = (data: object) => {
  const scheme = Joi.object({
     location: Joi.string().required(),
     description: Joi.string().required(),
  });

  return scheme.validate(data);
};

export default {
  validatePost,
};
