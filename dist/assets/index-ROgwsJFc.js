(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const w=document.querySelector("#app");if(!w)throw new Error("App mount point not found");w.innerHTML=`
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
          <button class="secondary-button" id="show-join">Join with invite <span>→</span></button>
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
`;const h=document.querySelector("#create-call"),g=document.querySelector("#show-join"),f=document.querySelector("#signal-view"),c=document.querySelector("#signal-content"),C=document.querySelector("#signal-label"),O=document.querySelector("#back-to-start"),S=document.querySelector("#call-view"),A=document.querySelector("#local-video"),E=document.querySelector("#remote-video"),D=document.querySelector("#waiting"),u=document.querySelector("#call-status-text"),N=[document.querySelector("#hang-up"),document.querySelector("#end-call")],p=document.querySelector("#toggle-mic"),v=document.querySelector("#toggle-camera");let r=null,a=null;const m=(e,t)=>e.classList.toggle("hidden",!t);async function L(){var e;if(!((e=navigator.mediaDevices)!=null&&e.getUserMedia))throw new Error("Camera and microphone access requires a secure HTTPS connection.");return navigator.mediaDevices.getUserMedia({video:!0,audio:!0})}function q(){const e=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});return e.ontrack=t=>{E.srcObject=t.streams[0],D.classList.add("hidden")},e.onconnectionstatechange=()=>{e.connectionState==="connected"&&(u.textContent="Connected securely",P()),e.connectionState==="disconnected"&&(u.textContent="Connection interrupted"),e.connectionState==="failed"&&(u.textContent="Connection failed")},a&&a.getTracks().forEach(t=>e.addTrack(t,a)),r=e,e}async function k(e){e.iceGatheringState!=="complete"&&await new Promise(t=>{const o=window.setTimeout(()=>{e.removeEventListener("icegatheringstatechange",s),t()},5e3);function s(){e.iceGatheringState==="complete"&&(window.clearTimeout(o),e.removeEventListener("icegatheringstatechange",s),t())}e.addEventListener("icegatheringstatechange",s)})}function x(e){return btoa(JSON.stringify(e))}function T(e){try{const t=JSON.parse(atob(e.trim()));if(t.type!=="offer"&&t.type!=="answer"||typeof t.sdp!="string")throw new Error;return{type:t.type,sdp:t.sdp}}catch{throw new Error("That invite is not valid. Copy the full invite and try again.")}}function P(){m(S,!0),document.body.classList.add("in-call"),A.srcObject=a}function y(e,t=""){m(f,!0),C.textContent=e==="offer"?"Create invite":"Join with invite",c.innerHTML=e==="offer"?`
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
    <button class="primary-button wide" id="create-answer">Join call <span class="button-arrow">↗</span></button>
  `}function d(e){const t=c.querySelector(".error-message");t==null||t.remove();const o=document.createElement("p");o.className="error-message",o.textContent=e,c.prepend(o)}async function j(){var e;try{h.disabled=!0,a=await L();const t=q(),o=await t.createOffer();await t.setLocalDescription(o),await k(t),y("offer",x({type:"offer",sdp:((e=t.localDescription)==null?void 0:e.sdp)??""}))}catch(t){d(t instanceof Error?t.message:"Could not access your camera and microphone.")}finally{h.disabled=!1}}async function M(){try{g.disabled=!0,a=await L(),y("answer")}catch(e){d(e instanceof Error?e.message:"Could not access your camera and microphone.")}finally{g.disabled=!1}}h.addEventListener("click",()=>void j());g.addEventListener("click",()=>void M());O.addEventListener("click",()=>{r==null||r.close(),a==null||a.getTracks().forEach(e=>e.stop()),r=null,a=null,m(f,!1)});c.addEventListener("click",e=>{const t=e.target;if(t.closest("#copy-invite")){const o=document.querySelector("#outgoing-signal");o&&(navigator.clipboard.writeText(o.value),t.closest("button").textContent="Copied ✓")}t.closest("#connect-answer")&&J(),t.closest("#create-answer")&&W()});async function J(){try{const e=document.querySelector("#incoming-answer");if(!(e!=null&&e.value.trim())||!r)throw new Error("Paste the other person's answer first.");await r.setRemoteDescription(T(e.value))}catch(e){d(e instanceof Error?e.message:"Could not connect the call.")}}async function W(){var e,t,o;try{const s=document.querySelector("#incoming-offer");if(!(s!=null&&s.value.trim()))throw new Error("Paste the caller's invite first.");const n=q();await n.setRemoteDescription(T(s.value));const i=await n.createAnswer();await n.setLocalDescription(i),await k(n),y("offer",x({type:"answer",sdp:((e=n.localDescription)==null?void 0:e.sdp)??""})),C.textContent="Send your answer";const l=c.querySelector("h2");l&&(l.textContent="Send your answer");const b=c.querySelector(".signal-instruction");b&&(b.textContent="Copy this answer and send it back to the caller. Your call will begin when they paste it."),(t=document.querySelector("#incoming-answer"))==null||t.remove(),(o=document.querySelector("#connect-answer"))==null||o.remove(),P()}catch(s){d(s instanceof Error?s.message:"Could not create an answer.")}}function B(){r==null||r.close(),a==null||a.getTracks().forEach(e=>e.stop()),r=null,a=null,E.srcObject=null,S.classList.add("hidden"),document.body.classList.remove("in-call"),f.classList.add("hidden"),c.innerHTML=""}N.forEach(e=>e.addEventListener("click",B));p.addEventListener("click",()=>{const e=a==null?void 0:a.getAudioTracks()[0];e&&(e.enabled=!e.enabled,p.classList.toggle("active",e.enabled),p.querySelector("span:last-child").textContent=e.enabled?"Mute":"Unmute")});v.addEventListener("click",()=>{const e=a==null?void 0:a.getVideoTracks()[0];e&&(e.enabled=!e.enabled,v.classList.toggle("active",e.enabled),v.querySelector("span:last-child").textContent=e.enabled?"Camera":"Camera off")});
