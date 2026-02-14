import { Schema, model, models } from 'mongoose';

const AnalyticsEventSchema = new Schema({
  type: { type: String, required: true },
  path: { type: String, required: true },
  referrer: { type: String },
  visitorId: { type: String, required: true },
  sessionId: { type: String, required: true },
  deviceType: { type: String, required: true },
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default models.AnalyticsEvent || model('AnalyticsEvent', AnalyticsEventSchema);