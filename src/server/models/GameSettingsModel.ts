import { model, Schema } from 'mongoose';

const GameSettingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  difficultyLevel: { type: Number, default: 4 },
  minValue: { type: Number, default: 0 },
  maxValue: { type: Number, default: 7 },
  timerSetting: { type: Number, default: 30000 },
  showTimer: { type: Boolean, default: false },
  maxGuesses: { type: Number, default: 10 },
});

const GameSettingModel = model('GameSetting', GameSettingSchema);

export default GameSettingModel;
