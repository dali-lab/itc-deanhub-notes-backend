// eslint-disable-next-line import/no-extraneous-dependencies
import DocumentNotFoundError from 'errors/DocumentNotFoundError';
import { BaseError } from 'errors';
import { removeNull } from 'util/removeNull';
import prisma from 'db/prisma_client';
import { Note } from '@prisma/client';

export interface NoteParams {
  authorId?: string;
  studentUUID?: string;
  noteContent?: string;
  initialIssue?: string;
  dateCreated?: Date;
}

const constructQuery = (params: NoteParams) => {
  return removeNull(params);
};

const getNotes = async (params: NoteParams): Promise<Note[]> => {
  const query = constructQuery(params);

  try {
    return await prisma.note.findMany({
      where: {
        ...query,
      },
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const getNote = async (id: string): Promise<Note> => {
  const note = await prisma.note.findUnique({
    where: {id: id},
  });

  if (!note) throw new DocumentNotFoundError(id);
  return note;
}

const updateNote = async (id: string, params: NoteParams): Promise<Note> => {
  const note = await prisma.note.update({
    where: { id: id },
    data: {
      ...params,
    },
  });

  if (!note) throw new DocumentNotFoundError(id);
  return note;
};

const deleteNote = async (id: string): Promise<Note> => {
  const deletedNote = await prisma.note.delete({
    where: {
      id: id,
    },
  });

  if (!deletedNote) throw new DocumentNotFoundError(id);
  return deletedNote;
};

const createNote = async (note: Pick<Note, "authorId" | "studentUUID" | "noteContent">): Promise<Note> => {
  try {
    return await prisma.note.create({
      data: {
        ...note,
      },
    });
  } catch (e: any) {
    throw e;
  }
};

const noteService = {
  createNote,
  getNote,
  getNotes,
  updateNote,
  deleteNote,
};

export default noteService;
