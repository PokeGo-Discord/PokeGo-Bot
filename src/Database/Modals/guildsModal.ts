import { model, Schema } from "mongoose";

export interface Guilds {
  guildId: string;
  lastSpawnDate: number;
  lastMessageDate: number;
}

export const Guilds = new Schema({
  guildId: String,
  lastSpawnDate: Number,
  lastMessageDate: Number,
});

export default model<Guilds>("Guilds", Guilds);