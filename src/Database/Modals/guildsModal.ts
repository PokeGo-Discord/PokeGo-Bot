import { timeStamp } from "console";
import { Document, model, Schema } from "mongoose";

export interface Guilds {
  guildId: string;
  lastSpawnDate: Date;
  messageCooldown: Date;
}

export const Guilds = new Schema({
  guildId: String,
  lastSpawnDate: Date,
  messageCooldown: { type : Date, default: Date.now }
});

export default model<Guilds>("Guilds", Guilds);