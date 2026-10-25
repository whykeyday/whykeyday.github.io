import { defineConfig } from 'astro/config';
export default defineConfig({site:'https://whykeyday.github.io',output:'static',outDir:'./dist',build:{format:'directory',assets:'bundles'}});
