import { Document, model, Schema } from "mongoose";

export interface Guilds {
  guildId: string;
  spawnRemaining: Date
}

export const Guilds = new Schema({
  guildId: String,
  spawnRemaining: Date
});

export default model<Guilds>("Guilds", Guilds);