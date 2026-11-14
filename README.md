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

## Optional TURN relay

STUN is free but cannot connect every pair of networks. Add a TURN relay for reliable calls across restrictive Wi-Fi, VPNs, and mobile networks. The app reads these build-time environment variables:

```bash
VITE_TURN_URL=turn:your-turn-host:3478
VITE_TURN_USERNAME=your-username
VITE_TURN_CREDENTIAL=your-password
```

Copy `.env.example` to `.env` for local development. In Cloudflare Pages, add the same variables under **Settings → Environment variables** and redeploy. These values are delivered to the browser, so use short-lived TURN credentials when possible; they are not application secrets.

### Free or self-hosted options

- A TURN provider may offer a limited free quota. This is the easiest option, but relay bandwidth is metered.
- You can self-host [coturn](https://github.com/coturn/coturn) on a small VPS. Open UDP/TCP 3478 and the configured relay port range, then use a `turn:` URL and coturn username/password.
- A self-hosted TURN server still costs the VPS bandwidth fee. Do not rely on random public TURN credentials.
