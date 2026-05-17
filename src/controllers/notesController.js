import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
    sortBy = '_id',
    sortOrder = 'asc',
   } = req.query;

  const skip = (page - 1) * perPage;

  const notesQuery = {};

  if (tag) {
    notesQuery.tag = tag;
  }

  if (search) {
    notesQuery.$text = { $search: search };
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(notesQuery),
    Note.find(
      notesQuery,
      search ? { score: { $meta: 'textScore' } } : {}
    )
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder}),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);


  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
	  throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    {returnDocument: 'after'}
  );

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};
