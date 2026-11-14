(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const h of i.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const C=document.querySelector("#app");if(!C)throw new Error("App mount point not found");C.innerHTML=`
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
`;const w=document.querySelector("#create-call"),b=document.querySelector("#show-join"),d=document.querySelector("#signal-view"),c=document.querySelector("#signal-content"),S=document.querySelector("#signal-label"),A=document.querySelector("#back-to-start"),E=document.querySelector("#call-view"),O=document.querySelector("#local-video"),L=document.querySelector("#remote-video"),M=document.querySelector("#waiting"),g=document.querySelector("#call-status-text"),N=[document.querySelector("#hang-up"),document.querySelector("#end-call")],f=document.querySelector("#toggle-mic"),v=document.querySelector("#toggle-camera");let s=null,a=null,y=!1;const u=(t,e)=>t.classList.toggle("hidden",!e);async function m(){var t;if(!((t=navigator.mediaDevices)!=null&&t.getUserMedia))throw new Error("Camera and microphone access requires a secure HTTPS connection.");return navigator.mediaDevices.getUserMedia({video:!0,audio:!0})}function k(){const t=[{urls:"stun:stun.l.google.com:19302"}],e=new RTCPeerConnection({iceServers:t});return e.ontrack=n=>{L.srcObject=n.streams[0],M.classList.add("hidden")},e.onconnectionstatechange=()=>{e.connectionState==="connected"&&(g.textContent="Connected securely",D()),e.connectionState==="disconnected"&&(g.textContent="Connection interrupted"),e.connectionState==="failed"&&(g.textContent="Connection failed")},e.oniceconnectionstatechange=()=>{e.iceConnectionState==="checking"&&l("Connecting directly to the other person…"),(e.iceConnectionState==="connected"||e.iceConnectionState==="completed")&&l("Secure connection found."),e.iceConnectionState==="failed"&&l("Connection blocked by one of the networks. Both people may need to try another network."),e.iceConnectionState==="disconnected"&&l("Connection interrupted. Waiting for the network…")},a&&a.getTracks().forEach(n=>e.addTrack(n,a)),s=e,e}async function T(t){t.iceGatheringState!=="complete"&&await new Promise(e=>{const n=window.setTimeout(()=>{t.removeEventListener("icegatheringstatechange",r),e()},5e3);function r(){t.iceGatheringState==="complete"&&(window.clearTimeout(n),t.removeEventListener("icegatheringstatechange",r),e())}t.addEventListener("icegatheringstatechange",r)})}function x(t){return btoa(JSON.stringify(t))}function q(t){try{const e=JSON.parse(atob(t.trim()));if(e.type!=="offer"&&e.type!=="answer"||typeof e.sdp!="string")throw new Error;return{type:e.type,sdp:e.sdp}}catch{throw new Error("That invite is not valid. Copy the full invite and try again.")}}function D(){u(E,!0),document.body.classList.add("in-call"),O.srcObject=a}function l(t){const e=document.querySelector("#connection-note");e&&(e.textContent=t)}function P(t,e=""){u(d,!0),S.textContent=t==="offer"?"Create invite":"Join with invite",c.innerHTML=t==="offer"?`
    <h2>Share this invite</h2>
    <p class="signal-instruction">Copy this code and send it to the person you want to call. Use a private channel like a direct message.</p>
    <textarea class="signal-box" id="outgoing-signal" readonly aria-label="Your call invite">${e}</textarea>
    <button class="primary-button wide" id="copy-invite">Copy invite <span class="button-arrow">↗</span></button>
    <div class="next-step"><span>01</span><p>After they open TwoWay, ask them to send their answer back here.</p></div>
    <textarea class="signal-box answer-box" id="incoming-answer" placeholder="Paste their answer here" aria-label="Answer from the other person"></textarea>
    <button class="secondary-button wide" id="connect-answer">Connect securely <span>→</span></button>
  `:`
    <h2>Paste your invite</h2>
    <p class="signal-instruction">Ask the caller to send you their invite, then paste it below. It is only used to establish this connection.</p>
    <textarea class="signal-box answer-box" id="incoming-offer" placeholder="Paste the caller's invite here" aria-label="Invite from the caller"></textarea>
    <button class="primary-button wide" id="create-answer">Generate my answer <span class="button-arrow">↗</span></button>
  `}function p(t){const e=c.querySelector(".error-message");e==null||e.remove();const n=document.createElement("p");n.className="error-message",n.textContent=t,c.prepend(n)}async function W(){var t;try{w.disabled=!0,a=await m();const e=k(),n=await e.createOffer();await e.setLocalDescription(n),await T(e),P("offer",x({type:"offer",sdp:((t=e.localDescription)==null?void 0:t.sdp)??""}))}catch(e){p(e instanceof Error?e.message:"Could not access your camera and microphone.")}finally{w.disabled=!1}}async function j(){try{b.disabled=!0,P("answer"),a=await m()}catch(t){p(t instanceof Error?t.message:"Could not access your camera and microphone.")}finally{b.disabled=!1}}w.addEventListener("click",()=>void W());b.addEventListener("click",()=>void j());A.addEventListener("click",()=>{s==null||s.close(),a==null||a.getTracks().forEach(t=>t.stop()),s=null,a=null,u(d,!1)});c.addEventListener("click",t=>{const e=t.target;if(e.closest("#copy-invite")){const n=document.querySelector("#outgoing-signal");n&&(navigator.clipboard.writeText(n.value),e.closest("button").textContent="Copied ✓")}e.closest("#connect-answer")&&B(),e.closest("#create-answer")&&H()});async function B(){const t=document.querySelector("#connect-answer");if(!y)try{const e=document.querySelector("#incoming-answer");if(!(e!=null&&e.value.trim())||!s)throw new Error("Paste the other person's answer first.");if(s.signalingState!=="have-local-offer")throw new Error("This answer was already submitted. Start a new call to connect again.");y=!0,t&&(t.disabled=!0,t.innerHTML="Answer sent ✓"),await s.setRemoteDescription(q(e.value))}catch(e){p(e instanceof Error?e.message:"Could not connect the call."),y=!1,t&&(t.disabled=!1,t.innerHTML="Connect securely <span>→</span>")}}async function H(){var t;try{const e=document.querySelector("#incoming-offer");if(!(e!=null&&e.value.trim()))throw new Error("Paste the caller's invite first.");a||(a=await m());const n=k();await n.setRemoteDescription(q(e.value));const r=await n.createAnswer();await n.setLocalDescription(r),await T(n),u(d,!0),S.textContent="Send your answer",c.innerHTML=`
      <h2>Send your answer</h2>
      <p class="signal-instruction">Copy this code and send it back to the caller. Keep this page open while they connect.</p>
      <textarea class="signal-box compact-signal" id="outgoing-signal" readonly aria-label="Your call answer">${x({type:"answer",sdp:((t=n.localDescription)==null?void 0:t.sdp)??""})}</textarea>
      <button class="primary-button wide" id="copy-invite">Copy answer <span class="button-arrow">↗</span></button>
      <p class="waiting-note"><span class="pulse"></span><span id="connection-note">Waiting for Person A to connect…</span></p>
    `}catch(e){p(e instanceof Error?e.message:"Could not create an answer.")}}function J(){s==null||s.close(),a==null||a.getTracks().forEach(t=>t.stop()),s=null,a=null,L.srcObject=null,E.classList.add("hidden"),document.body.classList.remove("in-call"),d.classList.add("hidden"),c.innerHTML=""}N.forEach(t=>t.addEventListener("click",J));f.addEventListener("click",()=>{const t=a==null?void 0:a.getAudioTracks()[0];t&&(t.enabled=!t.enabled,f.classList.toggle("active",t.enabled),f.querySelector("span:last-child").textContent=t.enabled?"Mute":"Unmute")});v.addEventListener("click",()=>{const t=a==null?void 0:a.getVideoTracks()[0];t&&(t.enabled=!t.enabled,v.classList.toggle("active",t.enabled),v.querySelector("span:last-child").textContent=t.enabled?"Camera":"Camera off")});
