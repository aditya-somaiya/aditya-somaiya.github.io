# Personal Portfolio on GitHub Pages

This is a minimal, fast portfolio starter. Host it at `https://<username>.github.io/` or on a custom domain.

## Quick Start
1) Rename the repo to `<username>.github.io` (for a user/organization site), or keep any name for a project site.
2) Push `main` and enable GitHub Pages → Source: `GitHub Actions` (uses the provided workflow).
3) (Optional) Put your custom domain in `CNAME` and point DNS:
   - `A` to 185.199.108.153 / .109 / .110 / .111 (GitHub Pages)
   - `CNAME` `www` → `<username>.github.io`
4) Edit content in `index.html` and `assets/*`. Commit and push.

## Local Dev
Just open `index.html` in your browser, or serve with Python:
```bash
python -m http.server 8000
```

## Blog / Posts
You can keep posts as Markdown in `/posts` and pre-render to HTML, or add Jekyll later.
