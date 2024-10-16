import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
