import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseError } from 'errors';
import { getSuccessfulDeletionMessage } from 'util/constants';
import { CreateNoteRequest, UpdateNoteRequest } from 'validation/note';
import { noteService } from 'services';

const createNote: RequestHandler = async (req: ValidatedRequest<CreateNoteRequest>, res, next) => {
  try {
    const savedNote = await noteService.createNote(req.body);
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await noteService.getNotes({
      ...req.query,
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

const getNote: RequestHandler = async (req, res, next) => {
  try {
    const note = await noteService.getNote(req.params.id);
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

const updateNote: RequestHandler = async (req: ValidatedRequest<UpdateNoteRequest>, res, next) => {
  try {
    // ! Don't let user update protected fields
    // TODO: what fields should be protected?
    const { noteContent, initialIssue, dateCreated } = req.body;

    // make sure fields are not null
    const note = await noteService.updateNote(req.params.id, {
      noteContent: noteContent ?? undefined,
      initialIssue: initialIssue ?? undefined,
      dateCreated: dateCreated ?? undefined,
    });
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.id);
    res.status(200).json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const noteController = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};

export default noteController;
