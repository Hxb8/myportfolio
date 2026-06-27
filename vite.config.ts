import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { createHighlighter } from 'shiki';

const theme = 'poimandres';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'bash', 'html', 'css'] // list whatever langs you actually use in code blocks
});

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			preprocess: [
				mdsvex({
					extensions: ['.md'],
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
