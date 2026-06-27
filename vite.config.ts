import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { createHighlighter } from 'shiki';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const theme = 'poimandres';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'bash', 'html', 'css']
});

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') || /\.(md|svx)$/.test(filename)
						? undefined
						: true
			},
			adapter: adapter(),
			preprocess: [
				mdsvex({
					extensions: ['.md'],
					layout: {
						_: path.resolve(__dirname, 'src/mdsvex.svelte')
					},
					highlight: {
						highlighter: (code, lang = 'text') => {
							const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
							return `{@html \`${html}\`}`;
						}
					}
				})
			],
			extensions: ['.svelte', '.svx', '.md']
		})
	]
});
