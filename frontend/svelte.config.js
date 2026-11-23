console.log('LOADED SVELTE CONFIG: adapter-static');
import adapter from '@sveltejs/adapter-static';
console.log('USING ADAPTER STATIC');
const base = process.env.NODE_ENV === 'production' ? '/flyin42-editor' : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        paths: {
            base: base
        },
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: undefined,
            precompress: false,
            strict: true
        })
    }
};

export default config;