import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

export const updateUserProfile = async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string' || !username.trim()) {
    throw createHttpError(400, 'Username is required');
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { username: username.trim() },
    { returnDocument: 'after' },
  );

  res.status(200).json(updatedUser);
};

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: result.secure_url },
    { returnDocument: 'after' },
  );

  res.status(200).json({ url: updatedUser.avatar });
};
