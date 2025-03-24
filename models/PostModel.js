import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  image: {
    type: String, // URL ảnh
    default: '',
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }]
}, { timestamps: true }); 

postSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

export default mongoose.model('Post', postSchema);
