import {
  BaseError,
  getFieldNotFoundError,
} from 'errors';
import {
  ContainerTypes,
  ValidatedRequestSchema,
} from 'express-joi-validation';
import joi from 'joi';

import { Note } from '@prisma/client';

/* MAPPINGS FROM BACKEND TO FRONTEND
  comment_date - dateCreated
  visit_type - visitType
  code_desc - initialIssue
  comment_text - noteContent
  dean_full_name - authorId
*/

export const CreateNoteSchema = joi.object({
  authorId: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('authorId'), 400);
  }),
  studentUUID: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('studentUUID'), 400);
  }),
  noteContent: joi.string().required().error(() => {
    throw new BaseError(getFieldNotFoundError('noteContent'), 400);
  }),
  initialIssue: joi.string().optional(),
  dateCreated: joi.date().default(() => new Date()),
  visitType: joi.string().optional(),
});

export interface CreateNoteRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Note
}

export const UpdateNoteSchema = joi.object({
  noteContent: joi.string().optional(),
  initialIssue: joi.string().optional(),
  dateCreated: joi.date().optional(),
});

export interface UpdateNoteRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<Note>
}
