import { homedir } from "os";
import { join } from "path";

export const BUNTEMP_DIR = join(homedir(), ".buntemp");
export const CD_PATH_FILE = join(BUNTEMP_DIR, ".cd-path");
