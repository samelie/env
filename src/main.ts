import { join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv-flow";
import { pkgUpSync } from "pkg-up";

const dirname = parse(fileURLToPath(import.meta.url)).dir;
// export const pkgRootDir = parse(pkgUpSync({ cwd: dirname }) || "").dir;

export function load(absPath:string) {
    // const p = join(pkgRootDir, "../../", ".config");
    dotenv.config({ path: absPath });
}


export function getEnv(k: string) {
    // eslint-disable-next-line node/prefer-global/process
    return process.env[k];
}

export const isProd = getEnv("NODE_ENV") === "production";
