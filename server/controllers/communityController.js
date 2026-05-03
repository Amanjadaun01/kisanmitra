import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const getPosts = async (req, res) => {
  const { district, crop, type, page = 1 } = req.query;
  const query = {};
  if (district) query.district = district;
  if (crop) query.crop = crop;
  if (type) query.type = type;
  const limit = 8;
  const posts = await Post.find(query)
    .populate('author', 'name district primaryCrop')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * limit)
    .limit(limit);
  const ids = posts.map((post) => post._id);
  const comments = await Comment.find({ post: { $in: ids } }).populate('author', 'name').sort({ createdAt: 1 });
  const byPost = comments.reduce((acc, comment) => {
    acc[comment.post] = acc[comment.post] || [];
    acc[comment.post].push(comment);
    return acc;
  }, {});
  res.json(posts.map((post) => ({ ...post.toObject(), comments: byPost[post._id] || [] })));
};

export const createPost = async (req, res) => {
  const { district, crop, content, type } = req.body;
  if (!content || content.length < 5) return res.status(400).json({ message: 'Please write a useful post.' });
  const post = await Post.create({
    author: req.user._id,
    district: district || req.user.district,
    crop: crop || req.user.primaryCrop,
    content,
    type
  });
  res.status(201).json(await post.populate('author', 'name district primaryCrop'));
};

export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  const liked = post.likes.some((id) => id.equals(req.user._id));
  post.likes = liked ? post.likes.filter((id) => !id.equals(req.user._id)) : [...post.likes, req.user._id];
  await post.save();
  res.json({ likes: post.likes.length, liked: !liked });
};

export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  if (!req.body.content) return res.status(400).json({ message: 'Comment cannot be empty.' });
  const comment = await Comment.create({ post: post._id, author: req.user._id, content: req.body.content });
  res.status(201).json(await comment.populate('author', 'name'));
};

export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  if (req.user.role !== 'admin' && !post.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'You can delete only your own post.' });
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted.' });
};
