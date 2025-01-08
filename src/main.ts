import { Buffer } from "node:buffer";
import process from "node:process";
import dotenv from "dotenv-flow";

/**
 * Gets all environment variable keys containing X_ENV
 * Returns keys sorted by length and then alphabetically
 */
function getEncodedEnvKeys(): string[] {
    return Object.keys(process.env)
        .filter(key => key.includes("X_ENV"))
        .sort((a, b) => {
            // First sort by length
            if (a.length !== b.length) {
                return a.length - b.length;
            }
            // If lengths are equal, sort alphabetically
            return a.localeCompare(b);
        });
}

/**
 * Decodes a base64 encoded environment string and populates process.env
 * Format should be standard .env format after decoding (KEY=value)
 * @param encodedVarName - Optional specific environment variable to decode
 */
function decodeAndPopulateEnv(encodedVarName?: string): void {
    // Get the keys to process
    const keysToProcess = encodedVarName ? [encodedVarName] : getEncodedEnvKeys();

    for (const key of keysToProcess) {
        const encodedEnv = process.env[key];

        if (!encodedEnv) {
            console.error(`${key} not in process.env ... skipping ...`);
            continue;
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
                console.error(`Error setting up environment for ${key}:`, error.message);
            }
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

// Example of how to create multiple encoded env strings for testing:
/*
  const testEnv1 = `
  DATABASE_URL=postgresql://user:pass@localhost:5432/db
  API_KEY=12345
  `;

  const testEnv2 = `
  FEATURE_FLAGS={"flag1":true,"flag2":false}
  QUOTED_VALUE="hello world"
  `;

  process.env.FIRST_X_ENV = encodeEnvFile(testEnv1);
  process.env.SECOND_X_ENV = encodeEnvFile(testEnv2);
  decodeAndPopulateEnv(); // This will process both X_ENV variables
*/

export function load(absPath: string) {
    dotenv.config({ path: absPath });
}

export function getEnv(k: string) {
    return process.env[k];
}

export const isProd = getEnv("NODE_ENV") === "production";
