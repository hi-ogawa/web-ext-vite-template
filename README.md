# web-ext-vite-template (wip)

experiment with browser extensions api and build system

```sh
pnpm i
pnpm dev
npx web-ext run -s src/dev -t chromium

pnpm build
npx web-ext run -s dist -t chromium
```

## todo

- dev
  - dummy entry to refer dev server endpoint
  - how to background script?
    - probably let bare esbuild take care of it independently since no hmr needed

## references

- https://github.com/mdn/webextensions-examples
