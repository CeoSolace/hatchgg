import { Schema, model, models } from 'mongoose';

const MerchItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.MerchItem || model('MerchItem', MerchItemSchema);