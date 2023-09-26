import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    // keep ngrok happy
    // see https://github.com/sveltejs/kit/issues/8026#issuecomment-1605293431
    // plus https://stackoverflow.com/a/76018697/4711754
    // tldr: `vite dev` doesn't use node adapter that sets `PROTOCOL_HEADER`, `HOST_HEADER` and `ORIGIN` headers
    csrf: {
      checkOrigin: process.env.NODE_ENV === "development" ? false : true,
    },
  },
};

export default config;
