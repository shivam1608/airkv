import {defineConfig} from "tsup";

export default defineConfig({
    entry: ['src/airkv.ts'],
    splitting: false,
    sourcemap: true,  
    clean: true,
    dts: true,
    format: ["esm" , "cjs"]
});