import { Schema, model, models } from 'mongoose';

const AboutContentSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  heroImageUrl: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default models.AboutContent || model('AboutContent', AboutContentSchema);