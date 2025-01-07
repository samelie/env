import { Buffer } from "node:buffer";
import process from "node:process";
import dotenv from "dotenv-flow";

/**
 * Decodes a base64 encoded environment string and populates process.env
 * Format should be standard .env format after decoding (KEY=value)
 */
function decodeAndPopulateEnv(encodedVarName: string = "X_ENV"): void {
    // Get the encoded string from process.env
    const encodedEnv = process.env[encodedVarName];

    if (!encodedEnv) {
        throw new Error(`${encodedVarName} not found in process.env`);
    }

    try {
        // Decode base64 to string
        const decodedEnv = Buffer.from(encodedEnv, "base64").toString("utf-8");

        // Split into lines and filter out empty lines
        const envLines = decodedEnv.split("\n").filter(line => line.trim());

        // Process each line
        for (const line of envLines) {
        // Skip comments
            if (line.startsWith("#")) continue;

            // Find the first = symbol (supporting values that contain =)
            const firstEquals = line.indexOf("=");
            if (firstEquals === -1) continue;

            // Split into key and value
            const key = line.slice(0, firstEquals).trim();
            const value = line.slice(firstEquals + 1).trim();

            // Remove surrounding quotes if they exist
            const cleanValue = value.replace(/^["']|["']$/g, "");

            // Set in process.env if key is valid
            if (key) {
                process.env[key] = cleanValue;
            }
        }
    } catch (error) {
        // Type guard to check if error is an Error object
        if (error instanceof Error) {
            console.error("Error setting up environment");
        }
    }
}

// Example usage:
try {
    decodeAndPopulateEnv();
} catch (error) {
    // Type guard to check if error is an Error object
    if (error instanceof Error) {
        console.error("Error setting up environment:", error.message);
    } else {
        console.error("Error setting up environment:", String(error));
    }
    process.exit(1);
}

// Helper function to encode a .env file for testing
export function encodeEnvFile(envContent: string): string {
    return Buffer.from(envContent).toString("base64");
}

// Example of how to create an encoded env string for testing:
/*
  const testEnv = `
  DATABASE_URL=postgresql://user:pass@localhost:5432/db
  API_KEY=12345
  FEATURE_FLAGS={"flag1":true,"flag2":false}
  # This is a comment
  QUOTED_VALUE="hello world"
  MULTI_EQUALS=key=value=something
  `;

  const encoded = encodeEnvFile(testEnv);
  process.env.X_ENV = encoded;
  decodeAndPopulateEnv();
  */

export function load(absPath: string) {
    // const p = join(pkgRootDir, "../../", ".config");
    dotenv.config({ path: absPath });
}

export function getEnv(k: string) {
    return process.env[k];
}

export const isProd = getEnv("NODE_ENV") === "production";
