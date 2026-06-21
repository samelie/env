import { defineKnipConfig } from "@adddog/monorepo-consistency";

export default defineKnipConfig({
    project: ["src/**/*.ts"],
}, {
    ignoreDependencies: [
        "@adddog/monorepo-consistency",
    ],
    ignoreBinaries: [
        "knip",
        "tsx",
    ],
});
