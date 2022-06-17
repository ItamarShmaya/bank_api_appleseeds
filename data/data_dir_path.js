import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const DATA_DIR_PATH = __dirname;
export const ACCOUNTS_PATH = path.join(DATA_DIR_PATH, "./accounts.json");
export const USERS_PATH = path.join(DATA_DIR_PATH, "./users.json");
