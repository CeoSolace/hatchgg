import { Schema, model, models } from 'mongoose';

const KnowledgeBaseArticleSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  keywords: { type: [String], default: [] },
  isPublished: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default models.KnowledgeBaseArticle || model('KnowledgeBaseArticle', KnowledgeBaseArticleSchema);