import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    posts.reverse();

    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Faile to get all post!',
    });
  }
};

export const getPopular = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .sort({ viewsCount: -1 })
      .exec();

    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to get popular posts!',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        new: true,
      }
    ).populate('user');

    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to get post!',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(500).json({
        message: 'Failed to remove post!',
      });
    }

    res.json({
      success: 'true',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to remove post!',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags?.split(','),
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error update post',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags?.split(','),
      user: req.userId,
    });

    const post = await doc.save();
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Faile to create post!',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((el) => el.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Faile to get tags!',
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId).populate(
      'comments.user',
      'fullName avatarUrl'
    );
    if (!post) {
      return res.status(404).json({ message: 'Пост не знайдено' });
    }

    res.status(200).json(post.comments);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

export const writeComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { user, text } = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Пост не знайдено' });
    }

    const newComment = { user, text };

    post.comments.push(newComment);
    await post.save();

    res
      .status(201)
      .json({ message: 'Коментар додано успішно', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
