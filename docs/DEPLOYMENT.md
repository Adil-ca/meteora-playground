# Deployment handoff

The application is built and tested locally. No public deployment, source upload or X publication has been performed. Vercel CLI was not found during environment inspection; no credentials were read.

Workflow references: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports) and [Vercel deploy CLI](https://vercel.com/docs/cli/deploy). Reviewed 17 November 2026.

## Recommended: static Vercel deployment

The Next.js build uses `output: 'export'` and writes `out/`. There is no server runtime or database.

1. Choose the final project name and public HTTPS origin.
2. Set the non-secret build variable `NEXT_PUBLIC_SITE_URL` to that origin so Open Graph/Twitter image URLs resolve publicly.
3. Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`.
4. Review `out/`, the screenshots, disclaimers and competition copy.
5. **Final action requiring owner approval:** publish the reviewed `out/` directory as a public Vercel project. The CLI equivalent after installation/login/project selection is `vercel out --prod`. Do not run it until approval is given. A dashboard import of the source repo can instead use build command `npm run build` and output directory `out`.
6. Verify the deployed origin, `/#game`, `/#lab`, `/#explorer`, `/icon.svg` and `/assets/social-card.png`. Confirm there are no preview-only URLs in social metadata.
7. Append the real public link to the manually reviewed competition drafts and recheck X's character counter.

Vercel CLI login and source-repository creation are separate account actions; do not paste credentials into source files or chat. The project needs no API keys.

## Alternative static hosting

Any HTTPS static host capable of serving `out/index.html`, `out/_next/` and `out/assets/` works. Copy the complete export, preserving directories and MIME types. The three experiences use URL fragments, so they need no server route rewriting. Serve `404.html` for unknown paths if supported. Do not upload `.env` files, test traces, local-storage exports or the entire `node_modules` tree.

## Local review

`npm start` serves the export at `http://127.0.0.1:3000`. This is a local URL, not a shareable deployment. Stop an owned preview using Ctrl+C. If this Windows host's preview stalls, ensure `--no-clipboard` is present; the supplied script includes it. Optional `NO_UPDATE_CHECK=1` avoids the preview server's nonessential update lookup.
