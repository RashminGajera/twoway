(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const C=document.querySelector("#app");if(!C)throw new Error("App mount point not found");C.innerHTML=`
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="TwoWay home">
        <span class="brand-mark"><span></span><span></span></span>
        <span>TwoWay</span>
      </a>
      <div class="secure-pill"><span class="pulse"></span> End-to-end encrypted</div>
    </header>

    <section class="intro">
      <p class="eyebrow">Private by design</p>
      <h1>A call for two.<br /><em>Nothing in between.</em></h1>
      <p class="lede">A lightweight video call that connects you directly to one other person. No accounts, no recording, no meeting data stored.</p>
    </section>

    <section class="call-card" aria-label="Start or join a call">
      <div class="setup-view">
        <div class="setup-copy">
          <div class="step-number">01</div>
          <h2>Start a private call</h2>
          <p>Choose your camera and microphone, then create a secure invite for the person you want to call.</p>
          <button class="primary-button" id="create-call">
            <span>Create call</span>
            <span class="button-arrow">↗</span>
          </button>
        </div>
        <div class="join-divider"><span>or</span></div>
        <div class="setup-copy join-copy">
          <div class="step-number">02</div>
          <h2>Join a call</h2>
          <p>Paste the invite from the other person. Your browser will connect directly to theirs.</p>
          <button class="secondary-button" id="show-join">Join a call <span>→</span></button>
        </div>
      </div>

      <div class="signal-view hidden" id="signal-view">
        <div class="signal-header">
          <button class="back-button" id="back-to-start">← Back</button>
          <span class="signal-label" id="signal-label">Create invite</span>
        </div>
        <div id="signal-content"></div>
      </div>
    </section>

    <section class="trust-row">
      <div><strong>Direct connection</strong><span>Your video travels peer to peer.</span></div>
      <div><strong>Encrypted in transit</strong><span>WebRTC DTLS-SRTP protects media.</span></div>
      <div><strong>No account needed</strong><span>Nothing to sign up for or remember.</span></div>
    </section>

    <footer><span>TwoWay · A quiet place to talk</span><span>Works best in Chrome, Edge, or Safari</span></footer>
  </main>

  <div class="call-view hidden" id="call-view">
    <div class="call-topbar">
      <div class="brand"><span class="brand-mark"><span></span><span></span></span><span>TwoWay</span></div>
      <div class="call-status"><span class="pulse"></span><span id="call-status-text">Connecting securely…</span></div>
      <button class="icon-button" id="hang-up" aria-label="End call">×</button>
    </div>
    <div class="video-grid">
      <div class="video-tile remote-tile"><video id="remote-video" autoplay playsinline></video><span class="tile-label">Other person</span><div class="waiting" id="waiting">Waiting for the other person to join…</div></div>
      <div class="video-tile local-tile"><video id="local-video" autoplay muted playsinline></video><span class="tile-label">You</span></div>
    </div>
    <div class="call-controls">
      <button class="control-button active" id="toggle-mic"><span class="control-icon">◖</span><span>Mute</span></button>
      <button class="control-button active" id="toggle-camera"><span class="control-icon">◉</span><span>Camera</span></button>
      <button class="control-button end-button" id="end-call"><span class="control-icon">×</span><span>End call</span></button>
    </div>
  </div>
`;const w=document.querySelector("#create-call"),b=document.querySelector("#show-join"),f=document.querySelector("#signal-view"),d=document.querySelector("#signal-content"),S=document.querySelector("#signal-label"),P=document.querySelector("#back-to-start"),L=document.querySelector("#call-view"),A=document.querySelector("#local-video"),k=document.querySelector("#remote-video"),N=document.querySelector("#waiting"),m=document.querySelector("#call-status-text"),O=[document.querySelector("#hang-up"),document.querySelector("#end-call")],h=document.querySelector("#toggle-mic"),v=document.querySelector("#toggle-camera");let s=null,o=null,y=!1,l=null;const g=(e,t)=>e.classList.toggle("hidden",!t);async function E(){var e;if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia))throw new Error("Camera and microphone access requires a secure HTTPS connection.");return navigator.mediaDevices.getUserMedia({video:!0,audio:!0})}function T(){const e=[{urls:"stun:stun.l.google.com:19302"}],t=new RTCPeerConnection({iceServers:e});return t.ontrack=n=>{k.srcObject=n.streams[0],N.classList.add("hidden")},t.onconnectionstatechange=()=>{t.connectionState==="connected"&&(m.textContent="Connected securely",R()),t.connectionState==="disconnected"&&(m.textContent="Connection interrupted"),t.connectionState==="failed"&&(m.textContent="Connection failed")},t.oniceconnectionstatechange=()=>{t.iceConnectionState==="checking"&&p("Connecting directly to the other person…"),(t.iceConnectionState==="connected"||t.iceConnectionState==="completed")&&p("Secure connection found."),t.iceConnectionState==="failed"&&p("Connection blocked by one of the networks. Both people may need to try another network."),t.iceConnectionState==="disconnected"&&p("Connection interrupted. Waiting for the network…")},o&&o.getTracks().forEach(n=>t.addTrack(n,o)),s=t,t}async function q(e){e.iceGatheringState!=="complete"&&await new Promise(t=>{const n=window.setTimeout(()=>{e.removeEventListener("icegatheringstatechange",r),t()},5e3);function r(){e.iceGatheringState==="complete"&&(window.clearTimeout(n),e.removeEventListener("icegatheringstatechange",r),t())}e.addEventListener("icegatheringstatechange",r)})}function j(e){return btoa(JSON.stringify(e))}function x(e){try{const t=JSON.parse(atob(e.trim()));if(t.type!=="offer"&&t.type!=="answer"||typeof t.sdp!="string")throw new Error;return{type:t.type,sdp:t.sdp}}catch{throw new Error("That invite is not valid. Copy the full invite and try again.")}}function R(){g(L,!0),document.body.classList.add("in-call"),A.srcObject=o}function p(e){const t=document.querySelector("#connection-note");t&&(t.textContent=e)}function u(e){const t=d.querySelector(".error-message");t==null||t.remove();const n=document.createElement("p");n.className="error-message",n.textContent=e,d.prepend(n)}async function I(){try{w.disabled=!0;const e=void 0;if(!e)throw new Error("Signaling is not configured. Add VITE_SIGNALING_URL in Cloudflare Pages.");o=await E();const t=crypto.randomUUID().replaceAll("-","").slice(0,10),n=T();M(t),l=new WebSocket(W(e,t));let r=!1;const a=async()=>{var c;if(r)return;r=!0;const i=await n.createOffer();await n.setLocalDescription(i),await q(n),l==null||l.send(JSON.stringify({type:"offer",sdp:(c=n.localDescription)==null?void 0:c.sdp})),p("Waiting for the other person to join…")};l.addEventListener("message",i=>{const c=JSON.parse(i.data);c.type==="peer-ready"&&a(),c.type==="answer"&&c.sdp&&(s==null?void 0:s.signalingState)==="have-local-offer"&&s.setRemoteDescription({type:"answer",sdp:c.sdp})})}catch(e){u(e instanceof Error?e.message:"Could not access your camera and microphone.")}finally{w.disabled=!1}}async function U(){try{b.disabled=!0,D(new URLSearchParams(window.location.search).get("room")??"")}catch(e){u(e instanceof Error?e.message:"Could not access your camera and microphone.")}finally{b.disabled=!1}}function M(e){const t=`${window.location.origin}${window.location.pathname}?room=${e}`;g(f,!0),S.textContent="Share call link",d.innerHTML=`
    <h2>Share this private link</h2>
    <p class="signal-instruction">Send this link to one person. Offer and answer exchange automatically.</p>
    <textarea class="signal-box compact-signal" id="room-link" readonly aria-label="Private call link">${t}</textarea>
    <button class="primary-button wide" id="copy-room-link">Copy call link <span class="button-arrow">↗</span></button>
    <p class="waiting-note"><span class="pulse"></span><span id="connection-note">Waiting for the other person to join…</span></p>
  `}function D(e){g(f,!0),S.textContent="Join call",d.innerHTML=`
    <h2>Join a private call</h2>
    <p class="signal-instruction">Paste the call link from the other person. The offer and answer will exchange automatically.</p>
    <input class="room-input" id="room-input" value="${e}" placeholder="Paste call link or room code" aria-label="Call link or room code" />
    <button class="primary-button wide" id="join-room">Join call <span class="button-arrow">↗</span></button>
    <p class="waiting-note"><span class="pulse"></span><span id="connection-note">Your camera and microphone will start after you join.</span></p>
  `}function J(e){try{return new URL(e.trim()).searchParams.get("room")??""}catch{return e.trim().replace(/[^a-zA-Z0-9]/g,"").slice(0,10)}}function W(e,t){const n=new URL(e);return n.protocol=n.protocol==="https:"?"wss:":"ws:",n.pathname=`${n.pathname.replace(/\/$/,"")}/room/${t}`,n.toString()}async function $(){const e=document.querySelector("#room-input");return(e?J(e.value):"")?u("Signaling is not configured. Add VITE_SIGNALING_URL in Cloudflare Pages."):u("Paste the call link first.")}w.addEventListener("click",()=>void I());b.addEventListener("click",()=>void U());P.addEventListener("click",()=>{l==null||l.close(),s==null||s.close(),o==null||o.getTracks().forEach(e=>e.stop()),s=null,o=null,g(f,!1)});d.addEventListener("click",e=>{const t=e.target;if(t.closest("#copy-invite")){const n=document.querySelector("#outgoing-signal");n&&(navigator.clipboard.writeText(n.value),t.closest("button").textContent="Copied ✓")}if(t.closest("#copy-room-link")){const n=document.querySelector("#room-link");n&&(navigator.clipboard.writeText(n.value),t.closest("button").textContent="Copied ✓")}t.closest("#join-room")&&$(),t.closest("#connect-answer")&&B(),t.closest("#create-answer")&&H()});async function B(){const e=document.querySelector("#connect-answer");if(!y)try{const t=document.querySelector("#incoming-answer");if(!(t!=null&&t.value.trim())||!s)throw new Error("Paste the other person's answer first.");if(s.signalingState!=="have-local-offer")throw new Error("This answer was already submitted. Start a new call to connect again.");y=!0,e&&(e.disabled=!0,e.innerHTML="Answer sent ✓"),await s.setRemoteDescription(x(t.value))}catch(t){u(t instanceof Error?t.message:"Could not connect the call."),y=!1,e&&(e.disabled=!1,e.innerHTML="Connect securely <span>→</span>")}}async function H(){var e;try{const t=document.querySelector("#incoming-offer");if(!(t!=null&&t.value.trim()))throw new Error("Paste the caller's invite first.");o||(o=await E());const n=T();await n.setRemoteDescription(x(t.value));const r=await n.createAnswer();await n.setLocalDescription(r),await q(n),g(f,!0),S.textContent="Send your answer",d.innerHTML=`
      <h2>Send your answer</h2>
      <p class="signal-instruction">Copy this code and send it back to the caller. Keep this page open while they connect.</p>
      <textarea class="signal-box compact-signal" id="outgoing-signal" readonly aria-label="Your call answer">${j({type:"answer",sdp:((e=n.localDescription)==null?void 0:e.sdp)??""})}</textarea>
      <button class="primary-button wide" id="copy-invite">Copy answer <span class="button-arrow">↗</span></button>
      <p class="waiting-note"><span class="pulse"></span><span id="connection-note">Waiting for Person A to connect…</span></p>
    `}catch(t){u(t instanceof Error?t.message:"Could not create an answer.")}}function V(){l==null||l.close(),s==null||s.close(),o==null||o.getTracks().forEach(e=>e.stop()),s=null,o=null,k.srcObject=null,L.classList.add("hidden"),document.body.classList.remove("in-call"),f.classList.add("hidden"),d.innerHTML=""}O.forEach(e=>e.addEventListener("click",V));h.addEventListener("click",()=>{const e=o==null?void 0:o.getAudioTracks()[0];e&&(e.enabled=!e.enabled,h.classList.toggle("active",e.enabled),h.querySelector("span:last-child").textContent=e.enabled?"Mute":"Unmute")});v.addEventListener("click",()=>{const e=o==null?void 0:o.getVideoTracks()[0];e&&(e.enabled=!e.enabled,v.classList.toggle("active",e.enabled),v.querySelector("span:last-child").textContent=e.enabled?"Camera":"Camera off")});
