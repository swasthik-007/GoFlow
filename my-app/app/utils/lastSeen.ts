import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "../data/lastSeen.json");

export function getLastSeenId(): string | null {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content).lastEmailId || null;
}

export function setLastSeenId(id: string) {
  fs.writeFileSync(filePath, JSON.stringify({ lastEmailId: id }));
}
