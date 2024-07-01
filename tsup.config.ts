import {defineConfig} from "tsup";

export default defineConfig({
    entry: {
        "airkv" : 'src/index.ts'
    },
    splitting: false,
    sourcemap: true,  
    clean: true,
    dts: true,
    format: ["esm" , "cjs"]
});