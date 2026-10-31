import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({base:'/fate/',plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url)),'next/link':fileURLToPath(new URL('./src/Link.tsx',import.meta.url))}},build:{outDir:'../fate',emptyOutDir:false}});
