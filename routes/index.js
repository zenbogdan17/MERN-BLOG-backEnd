import express from 'express';
import multer from 'multer';

import { UserController, PostController } from '../controllers/index.js';
import { checkAuth, handlerValidationErrors } from '../utils/index.js';
import {
  loginValidations,
  postCreateValidation,
  registerValidation,
} from '../validations.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    cd(null, 'uploads');
  },
  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});
const uploads = multer({ storage });

// Routes
router.post(
  '/auth/register',
  registerValidation,
  handlerValidationErrors,
  UserController.register
);
router.post(
  '/auth/login',
  loginValidations,
  handlerValidationErrors,
  UserController.login
);
router.get('/auth/me', checkAuth, UserController.getMe);

router.post('/upload', checkAuth, uploads.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
router.post(
  '/uploadAvatar',
  checkAuth,
  uploads.single('avatar'),

  UserController.uploadAvatar
);

router.get('/tags', PostController.getLastTags);
router.get('/posts/tags', PostController.getLastTags);
router.get('/posts', PostController.getAll);
router.get('/posts/popular', PostController.getPopular);
router.get('/posts/:id/comments', PostController.getComments);
router.post('/posts/:id/writeComment', PostController.writeComment);
router.get('/posts/:id', PostController.getOne);
router.post('/posts', checkAuth, postCreateValidation, PostController.create);
router.delete('/posts/:id', checkAuth, PostController.remove);
router.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  PostController.update
);

export default router;
