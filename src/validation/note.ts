import joi from 'joi';
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation';
import { Note } from '@prisma/client';
import { BaseError, getFieldNotFoundError } from 'errors';

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
