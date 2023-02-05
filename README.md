# web-ext-vite-template (wip)

experiment with browser extensions api and build system

```sh
pnpm i
pnpm build
cp -f src/manifest.json dist/manifest.json
pnpm dev-web-ext -t chromium

# TODO
pnpm dev
```

## todo

- dev
  - dummy entry to refer dev server endpoint
  - how to background script?
    - probably let bare esbuild take care of it independently since no hmr needed

## references

- https://github.com/mdn/webextensions-examples
