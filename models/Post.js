import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true, uniqu: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: {
      type: Array,
      default: [],
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    imageUrl: { type: String },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Post', PostSchema);
