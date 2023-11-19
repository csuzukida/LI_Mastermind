import mongoose, { model, Schema } from 'mongoose';

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017';

// connect to MongoDB
(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(URI, {
      dbName: 'linkedin-mastermind',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
})();

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  created_at: { type: Date, default: Date.now },
});

const UserModel = model('User', UserSchema);

export default UserModel;
