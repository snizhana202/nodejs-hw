// src/models/note.js

import { Schema } from 'mongoose';
import { model } from 'mongoose';
import { TAGS } from '../constants/tags';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      default: 'Todo',
      trim: true,
      enum: TAGS,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteSchema.index({ tag: 1 });
noteSchema.index({ title: 'text', content: 'text' });

export const Note = model('Note', noteSchema);
