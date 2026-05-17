import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';

/* -------------------------------------------
   GET /notes — query validation
------------------------------------------- */

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
      'number.base': 'PerPage must be a number',
      'number.integer': 'PerPage must be an integer',
      'number.min': 'PerPage must be at least {#limit}',
      'number.max': 'PerPage must be at most {#limit}',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
      }),
    search: Joi.string().trim().allow('').messages({
      'string.base': 'Search must be a string',
    }),
    sortBy: Joi.string().valid("_id", "title", "content", "tag"),
    sortOrder: Joi.string().valid("asc", "desc"),
  }),
};

/* -------------------------------------------
   GET /notes/:noteId  +  DELETE /notes/:noteId
------------------------------------------- */

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId Validation'),
  }),
};

/* -------------------------------------------
   POST /notes — body validation
------------------------------------------- */

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must be at least 1 character long',
      'string.required': 'Title is required',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
      }),
  }),
};

/* -------------------------------------------
   PATCH /notes/:noteId — params + body
------------------------------------------- */

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string()
      .custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.message('Invalid id format');
        }
        return value;
      })
  }),

  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title must be at least {#limit} character long',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
      }),
  })
    .min(1)
    .messages({
      'object.min':
        'At least one field (title, content, or tag) must be provided for update',
    }),
};
