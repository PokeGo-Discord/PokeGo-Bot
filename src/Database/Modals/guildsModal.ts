import { timeStamp } from "console";
import { Document, model, Schema } from "mongoose";

export interface Guilds {
  guildId: string;
  lastSpawnDate: Date;
}

export const Guilds = new Schema({
  guildId: String,
  lastSpawnDate: Date,
});

export default model<Guilds>("Guilds", Guilds);