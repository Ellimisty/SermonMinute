# 3 Minute Sermon

A modern desktop and web application for delivering short, inspired sermons.

## Features
- **Card Deck**: Draw from a collection of Bible verses and topics.
- **Timer**: 3-minute countdown with visual feedback.
- **Sermon Notes**: Capture your thoughts and submit them to `3minute@sermonminute.com`.

## Deployment

### Desktop (Tauri)
To run the desktop version, you need the Rust toolchain and MSVC Build Tools (on Windows).
```bash
npm install
npm run dev
```

### Web (Cloudflare Pages)
This project is ready for Cloudflare Pages.
1. Push this repository to GitHub.
2. In Cloudflare Pages, connect your repository.
3. Set **Build command** to: (Empty)
4. Set **Publish directory** to: `resources`

## Form Submission Note
Since this is a static site on Cloudflare, the "Sermon Notes" form uses a `mailto:` link by default. For a more seamless "Type and Send" experience, you can connect the form to a service like [Formspree](https://formspree.io) by changing the `action` attribute in `resources/index.html`.
