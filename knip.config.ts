import { defineKnipConfig } from "@adddog/config-defaults/knip.config";

export default defineKnipConfig({
    entry: ["src/index.ts", "src/**/__tests__/**/*.test.ts"],
    project: ["src/**/*.ts"]
});
