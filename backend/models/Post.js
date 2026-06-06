const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' },
    text: {
      type: String,
      maxlength: [1000, 'Post text cannot exceed 1000 characters'],
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: [{ type: String }], // usernames of people who liked
    comments: [commentSchema],
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Validate that at least text or image is present
postSchema.pre('save', function (next) {
  if (!this.text && !this.image) {
    return next(new Error('Post must have either text or image'));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
