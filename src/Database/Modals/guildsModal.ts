import { model, Schema } from "mongoose";

export interface Guilds {
  guildId: string;
  lastSpawnDate: number;
}

export const Guilds = new Schema({
  guildId: String,
  lastSpawnDate: Number,
});

export default model<Guilds>("Guilds", Guilds);