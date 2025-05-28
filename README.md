# @rad/env

## Scripts

| Script | Description |
|--------|-------------|
| `build` | `tsup ./src --outDir dist --clean --format esm,cjs --shims --dts --platform node` |
| `lint` | `eslint .` |
| `lint:fix` | `eslint --fix .` |
| `types` | `tsc -p tsconfig.typecheck.json` |

