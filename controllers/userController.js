import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const Register = async (req, res) => {
  const { username, email, password, avatarUrl } = req.body;

  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng", success: false });
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      avatarUrl,
    });

    await newUser.save();

    // Tạo token
    const token = generateToken(newUser._id);

    return res.status(201).json({
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
      },
      token,
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đăng ký thất bại. Vui lòng thử lại.', success: false });
  }
};

export const Login = async (req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({message: 'email đã tồn tại', success: false});
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu không đúng', success: false });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
        },
        token,
        success: true,
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đăng ký thất bại. Vui lòng thử lại.', success: false });
    }
}

export const getCurrentUser = (req, res) => {
    if (!req.user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
  
    res.status(200).json(req.user);
  };

  export const updateUser = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });
  
      const { username, email, password } = req.body;
      const updatedData = {};
  
      if (username) updatedData.username = username;
      if (email) updatedData.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(password, salt);
      }
  
      if (req.file) {
        updatedData.avatarUrl = req.file?.path || '';
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password');
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Cập nhật người dùng thất bại:', error);
      res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
  }; 
  