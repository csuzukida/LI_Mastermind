import { model, Schema } from 'mongoose';

const GameSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  score: { type: Number, default: 0 },
  moves: { type: [String] },
  gameResult: { type: String, enum: ['win', 'lose'] },
});

const GameModel = model('Game', GameSchema);

export default GameModel;
