// import fs from "fs";
// import path from "path";

// const file = path.join(__dirname, "../../Data/lastEmail.json");

// export const getLastEmailId = (): string | null => {
//   if (!fs.existsSync(file)) return null;
//   const raw = fs.readFileSync(file, "utf-8");
//   return JSON.parse(raw).lastEmailId || null;
// };

// export const setLastEmailId = (id: string) => {
//   fs.writeFileSync(file, JSON.stringify({ lastEmailId: id }));
// };
