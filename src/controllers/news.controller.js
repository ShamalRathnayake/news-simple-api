const News = require("../models/news.model");
const Joi = require("joi");

const newsSchema = Joi.object({
  _id: Joi.string().alphanum(),
  title: Joi.string().required(),
  imageUrl: Joi.string().uri().required(),
  category: Joi.string().required(),
  newsBody: Joi.string().required(),
});

const createNews = async (req, res) => {
  const { error } = newsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, imageUrl, category, newsBody } = req.body;

  try {
    const newNews = new News({
      title,
      imageUrl,
      category,
      newsBody,
      author: req.user._id,
    });
    await newNews.save();
    res
      .status(201)
      .json({ message: "News article created successfully.", data: newNews });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating news article.", error: err.message });
  }
};

const updateNews = async (req, res) => {
  const { error } = newsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { _id, title, imageUrl, category, newsBody } = req.body;

  try {
    const updatedNews = await News.findByIdAndUpdate(
      _id,
      { title, imageUrl, category, newsBody },
      { new: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ message: "News article not found." });
    }
    res.status(200).json({
      message: "News article updated successfully.",
      data: updatedNews,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating news article.", error: err.message });
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ message: "News article not found." });
    }
    res.status(200).json({ message: "News article deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting news article.", error: err.message });
  }
};

const getAllNews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const news = await News.find()
      .populate("author", "username email profileImageUrl")
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    const total = await News.countDocuments();

    res.status(200).json({
      data: news,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving news articles.", error: err.message });
  }
};

module.exports = {
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
};
