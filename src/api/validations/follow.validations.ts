import Joi from 'joi';

const validateFollow = (data: object) => {
  const scheme = Joi.object({
    follow: Joi.string().required(),
  });

  return scheme.validate(data);
};

export default {
  validateFollow,
};
