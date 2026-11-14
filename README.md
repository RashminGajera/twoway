# TwoWay

TwoWay is a lightweight, static video-call app for exactly two people. It uses browser-native WebRTC, so media is sent directly between peers and encrypted in transit with DTLS-SRTP.

## Run locally

```bash
npm install
npm run dev
```

Camera and microphone access require `localhost` or HTTPS.

## How a call works

1. One person chooses **Create call** and sends the generated invite through a private channel.
2. The other person chooses **Join with invite**, pastes the invite, and sends the answer back.
3. The caller pastes the answer. The media connection is then peer-to-peer.

The static site does not store accounts, invites, recordings, or call metadata. The invite is only a temporary WebRTC connection description, not a room or password. A small public STUN server is used only to help peers discover a network path; it does not carry the call media. Deploy the `dist` folder to any static HTTPS host such as GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

For production, serve the site over HTTPS and consider replacing the public STUN server with infrastructure you control.
