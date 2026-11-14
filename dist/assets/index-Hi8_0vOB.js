(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const m=document.querySelector("#app");if(!m)throw new Error("App mount point not found");m.innerHTML=`
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
`;const y=document.querySelector("#create-call"),b=document.querySelector("#show-join"),l=document.querySelector("#signal-view"),c=document.querySelector("#signal-content"),C=document.querySelector("#signal-label"),P=document.querySelector("#back-to-start"),S=document.querySelector("#call-view"),A=document.querySelector("#local-video"),E=document.querySelector("#remote-video"),O=document.querySelector("#waiting"),g=document.querySelector("#call-status-text"),M=[document.querySelector("#hang-up"),document.querySelector("#end-call")],v=document.querySelector("#toggle-mic"),h=document.querySelector("#toggle-camera");let o=null,n=null,f=!1;const d=(e,t)=>e.classList.toggle("hidden",!t);async function w(){var e;if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia))throw new Error("Camera and microphone access requires a secure HTTPS connection.");return navigator.mediaDevices.getUserMedia({video:!0,audio:!0})}function L(){const e=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});return e.ontrack=t=>{E.srcObject=t.streams[0],O.classList.add("hidden")},e.onconnectionstatechange=()=>{e.connectionState==="connected"&&(g.textContent="Connected securely",D()),e.connectionState==="disconnected"&&(g.textContent="Connection interrupted"),e.connectionState==="failed"&&(g.textContent="Connection failed")},n&&n.getTracks().forEach(t=>e.addTrack(t,n)),o=e,e}async function T(e){e.iceGatheringState!=="complete"&&await new Promise(t=>{const a=window.setTimeout(()=>{e.removeEventListener("icegatheringstatechange",r),t()},5e3);function r(){e.iceGatheringState==="complete"&&(window.clearTimeout(a),e.removeEventListener("icegatheringstatechange",r),t())}e.addEventListener("icegatheringstatechange",r)})}function x(e){return btoa(JSON.stringify(e))}function k(e){try{const t=JSON.parse(atob(e.trim()));if(t.type!=="offer"&&t.type!=="answer"||typeof t.sdp!="string")throw new Error;return{type:t.type,sdp:t.sdp}}catch{throw new Error("That invite is not valid. Copy the full invite and try again.")}}function D(){d(S,!0),document.body.classList.add("in-call"),A.srcObject=n}function q(e,t=""){d(l,!0),C.textContent=e==="offer"?"Create invite":"Join with invite",c.innerHTML=e==="offer"?`
    <h2>Share this invite</h2>
    <p class="signal-instruction">Copy this code and send it to the person you want to call. Use a private channel like a direct message.</p>
    <textarea class="signal-box" id="outgoing-signal" readonly aria-label="Your call invite">${t}</textarea>
    <button class="primary-button wide" id="copy-invite">Copy invite <span class="button-arrow">↗</span></button>
    <div class="next-step"><span>01</span><p>After they open TwoWay, ask them to send their answer back here.</p></div>
    <textarea class="signal-box answer-box" id="incoming-answer" placeholder="Paste their answer here" aria-label="Answer from the other person"></textarea>
    <button class="secondary-button wide" id="connect-answer">Connect securely <span>→</span></button>
  `:`
    <h2>Paste your invite</h2>
    <p class="signal-instruction">Ask the caller to send you their invite, then paste it below. It is only used to establish this connection.</p>
    <textarea class="signal-box answer-box" id="incoming-offer" placeholder="Paste the caller's invite here" aria-label="Invite from the caller"></textarea>
    <button class="primary-button wide" id="create-answer">Generate my answer <span class="button-arrow">↗</span></button>
  `}function u(e){const t=c.querySelector(".error-message");t==null||t.remove();const a=document.createElement("p");a.className="error-message",a.textContent=e,c.prepend(a)}async function N(){var e;try{y.disabled=!0,n=await w();const t=L(),a=await t.createOffer();await t.setLocalDescription(a),await T(t),q("offer",x({type:"offer",sdp:((e=t.localDescription)==null?void 0:e.sdp)??""}))}catch(t){u(t instanceof Error?t.message:"Could not access your camera and microphone.")}finally{y.disabled=!1}}async function j(){try{b.disabled=!0,q("answer"),n=await w()}catch(e){u(e instanceof Error?e.message:"Could not access your camera and microphone.")}finally{b.disabled=!1}}y.addEventListener("click",()=>void N());b.addEventListener("click",()=>void j());P.addEventListener("click",()=>{o==null||o.close(),n==null||n.getTracks().forEach(e=>e.stop()),o=null,n=null,d(l,!1)});c.addEventListener("click",e=>{const t=e.target;if(t.closest("#copy-invite")){const a=document.querySelector("#outgoing-signal");a&&(navigator.clipboard.writeText(a.value),t.closest("button").textContent="Copied ✓")}t.closest("#connect-answer")&&W(),t.closest("#create-answer")&&B()});async function W(){const e=document.querySelector("#connect-answer");if(!f)try{const t=document.querySelector("#incoming-answer");if(!(t!=null&&t.value.trim())||!o)throw new Error("Paste the other person's answer first.");if(o.signalingState!=="have-local-offer")throw new Error("This answer was already submitted. Start a new call to connect again.");f=!0,e&&(e.disabled=!0,e.innerHTML="Answer sent ✓"),await o.setRemoteDescription(k(t.value))}catch(t){u(t instanceof Error?t.message:"Could not connect the call."),f=!1,e&&(e.disabled=!1,e.innerHTML="Connect securely <span>→</span>")}}async function B(){var e;try{const t=document.querySelector("#incoming-offer");if(!(t!=null&&t.value.trim()))throw new Error("Paste the caller's invite first.");n||(n=await w());const a=L();await a.setRemoteDescription(k(t.value));const r=await a.createAnswer();await a.setLocalDescription(r),await T(a),d(l,!0),C.textContent="Send your answer",c.innerHTML=`
      <h2>Send your answer</h2>
      <p class="signal-instruction">Copy this code and send it back to the caller. Keep this page open while they connect.</p>
      <textarea class="signal-box compact-signal" id="outgoing-signal" readonly aria-label="Your call answer">${x({type:"answer",sdp:((e=a.localDescription)==null?void 0:e.sdp)??""})}</textarea>
      <button class="primary-button wide" id="copy-invite">Copy answer <span class="button-arrow">↗</span></button>
      <p class="waiting-note"><span class="pulse"></span> Waiting for Person A to connect…</p>
    `}catch(t){u(t instanceof Error?t.message:"Could not create an answer.")}}function H(){o==null||o.close(),n==null||n.getTracks().forEach(e=>e.stop()),o=null,n=null,E.srcObject=null,S.classList.add("hidden"),document.body.classList.remove("in-call"),l.classList.add("hidden"),c.innerHTML=""}M.forEach(e=>e.addEventListener("click",H));v.addEventListener("click",()=>{const e=n==null?void 0:n.getAudioTracks()[0];e&&(e.enabled=!e.enabled,v.classList.toggle("active",e.enabled),v.querySelector("span:last-child").textContent=e.enabled?"Mute":"Unmute")});h.addEventListener("click",()=>{const e=n==null?void 0:n.getVideoTracks()[0];e&&(e.enabled=!e.enabled,h.classList.toggle("active",e.enabled),h.querySelector("span:last-child").textContent=e.enabled?"Camera":"Camera off")});
