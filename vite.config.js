import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { glob } from "glob";

// dynamically build all assets in the pages dir
let js_files = glob.sync("resources/js/pages/**/*.jsx", []);

let style_files = ["resources/css/app.css"];

export default defineConfig({
    plugins: [
        laravel({
            input: [...js_files, ...style_files],
            refresh: true,
        }),
        react(),
    ],
    build:{
        minify: true,
        sourcemap: false,
        cssMinify:true,

        rollupOptions:{
            output:{
                compact: true,
                manualChunks: (path)=>{
                    if(path.includes('primereact')){
                        return 'primereact'
                    }else if(path.includes('daisyui')){
                        return 'daisyui'
                    }else if(path.includes('axios')){
                        return 'axios'
                    }else if(path.includes('flowbite')){
                        return 'flowbite'
                    }else if(path.includes('lucide-react')){
                        return 'lucide-react'
                    }else if(path.includes('node_modules')){
                        return 'vendor'
                    }
                }
            }
        }
    },
    clearScreen: true,
});
