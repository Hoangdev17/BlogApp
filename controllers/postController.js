import Post from '../models/PostModel.js';

//@desc get all posts
export const getAllPosts = async (req, res) => {
  try {
    const { search, author, tag } = req.query;

    const query = {
      deleted: false, // Chỉ lấy bài chưa bị xóa mềm
    };

    // Lọc theo author nếu có
    if (author) {
      query.author = author;
    }

    // Lọc theo tag nếu có
    if (tag) {
      query.tags = tag;
    }

    // Tìm kiếm theo title hoặc summary (không phân biệt hoa thường)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết.' });
  }
};


// @desc get post by id
export const getPostById = async (req,res) => {

    try {
        const post = await Post.findById(req.params.id).populate('author', 'username email').populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username avatarUrl' 
          }
        });
    
        if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    
        res.status(200).json(post);
      } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy bài viết.' });
      }
}

// @desc Create a new post (JWT required)
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const newPost = new Post({
      title,
      content,
      tags: tags || [],
      image: req.file?.path || '',  // Nếu dùng local path
      author: req.user._id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ message: 'Tạo bài viết thất bại.' });
  }
};


  // @desc Update post by ID
  export const updatePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
  
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Bạn không có quyền sửa bài viết này.' });
      }
  
      const { title, content, tags } = req.body;
      const updatedData = { title, content, tags };
  
      if (req.file) {
        updatedData.image = req.file?.path || ''; // đường dẫn ảnh mới
      }
  
      const updated = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Cập nhật bài viết thất bại.' });
    }
  };
  

// @desc Delete post by ID
export const deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
  
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này.' });
      }
  
      await post.delete();
      res.status(200).json({ message: 'Đã xóa bài viết thành công.' });
    } catch (error) {
      res.status(500).json({ message: 'Xóa bài viết thất bại.' });
    }
  };

  // @desc add comment to Post
  export const addCommentToPost = async (req, res) => {
    const { id } = req.params; 
    const { content } = req.body;
    const userId = req.user._id;
  
    if (!content) {
      return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    }
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      }
  
      const comment = {
        user: userId,
        content,
      };
  
      post.comments.push(comment);
      await post.save();
  
      res.status(201).json({ message: 'Bình luận đã được thêm', comment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Thêm bình luận thất bại' });
    }
  };

// @desc delete comment
export const deleteCommentFromPost = async (req, res) => {
    const { id, commentId } = req.params;
    const userId = req.user._id;
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      }
  
      const comment = post.comments.id(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Không tìm thấy bình luận' });
      }
  
      if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
      }
  
      post.comments.pull(commentId);
      await post.save();
  
      res.status(200).json({ message: 'Bình luận đã được xoá' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Xoá bình luận thất bại' });
    }
  };

// @desc like post 
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
      post.dislikes.pull(userId);
    }

    await post.save();

    // Trả về toàn bộ post sau khi cập nhật
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};


// @desc dislike post
export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) return res.status(404).json({ message: "Bài viết không tồn tại" });

    if (post.dislikes.includes(userId)) {
      post.dislikes.pull(userId);
    } else {
      post.dislikes.push(userId);
      post.likes.pull(userId);
    }

    await post.save();

    // Trả về toàn bộ post sau khi cập nhật
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};

  
// @desc upload image
export const uploadImages = async (req,res) => {
    try {
        // Ảnh sau khi upload sẽ có URL từ req.file.path
        return res.status(200).json({
          url: req.file.path,
          public_id: req.file.filename,
        });
      } catch (err) {
        res.status(500).json({ message: 'Upload thất bại' });
      }
}
  