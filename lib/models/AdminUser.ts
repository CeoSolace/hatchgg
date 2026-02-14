import mongoose, { Schema, model, models } from 'mongoose';

const AdminUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.AdminUser || model('AdminUser', AdminUserSchema);