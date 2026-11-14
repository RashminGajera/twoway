import "./style.css";

type Signal = {
  type: RTCSdpType;
  sdp: string;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App mount point not found");
}

app.innerHTML = `
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
`;

const createButton = document.querySelector<HTMLButtonElement>("#create-call")!;
const showJoinButton = document.querySelector<HTMLButtonElement>("#show-join")!;
const signalView = document.querySelector<HTMLDivElement>("#signal-view")!;
const signalContent = document.querySelector<HTMLDivElement>("#signal-content")!;
const signalLabel = document.querySelector<HTMLSpanElement>("#signal-label")!;
const backButton = document.querySelector<HTMLButtonElement>("#back-to-start")!;
const callView = document.querySelector<HTMLDivElement>("#call-view")!;
const localVideo = document.querySelector<HTMLVideoElement>("#local-video")!;
const remoteVideo = document.querySelector<HTMLVideoElement>("#remote-video")!;
const waiting = document.querySelector<HTMLDivElement>("#waiting")!;
const callStatus = document.querySelector<HTMLSpanElement>("#call-status-text")!;
const hangUpButtons = [document.querySelector<HTMLButtonElement>("#hang-up")!, document.querySelector<HTMLButtonElement>("#end-call")!];
const micButton = document.querySelector<HTMLButtonElement>("#toggle-mic")!;
const cameraButton = document.querySelector<HTMLButtonElement>("#toggle-camera")!;

let peer: RTCPeerConnection | null = null;
let localStream: MediaStream | null = null;

const setVisible = (element: HTMLElement, visible: boolean) => element.classList.toggle("hidden", !visible);

async function getMedia(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera and microphone access requires a secure HTTPS connection.");
  }
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}

function createPeer(): RTCPeerConnection {
  const connection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });
  connection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    waiting.classList.add("hidden");
  };
  connection.onconnectionstatechange = () => {
    if (connection.connectionState === "connected") {
      callStatus.textContent = "Connected securely";
      showCall();
    }
    if (connection.connectionState === "disconnected") callStatus.textContent = "Connection interrupted";
    if (connection.connectionState === "failed") callStatus.textContent = "Connection failed";
  };
  if (localStream) localStream.getTracks().forEach((track) => connection.addTrack(track, localStream!));
  peer = connection;
  return connection;
}

async function waitForIce(connection: RTCPeerConnection): Promise<void> {
  if (connection.iceGatheringState === "complete") return;
  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(() => {
      connection.removeEventListener("icegatheringstatechange", checkState);
      resolve();
    }, 5000);
    function checkState() {
      if (connection.iceGatheringState === "complete") {
        window.clearTimeout(timeout);
        connection.removeEventListener("icegatheringstatechange", checkState);
        resolve();
      }
    }
    connection.addEventListener("icegatheringstatechange", checkState);
  });
}

function signalText(signal: Signal): string {
  return btoa(JSON.stringify(signal));
}

function parseSignal(value: string): Signal {
  try {
    const signal = JSON.parse(atob(value.trim())) as Partial<Signal>;
    if ((signal.type !== "offer" && signal.type !== "answer") || typeof signal.sdp !== "string") throw new Error();
    return { type: signal.type, sdp: signal.sdp };
  } catch {
    throw new Error("That invite is not valid. Copy the full invite and try again.");
  }
}

function showCall() {
  setVisible(callView, true);
  document.body.classList.add("in-call");
  localVideo.srcObject = localStream;
}

function renderSignalStep(mode: "offer" | "answer", invite = "") {
  setVisible(signalView, true);
  signalLabel.textContent = mode === "offer" ? "Create invite" : "Join with invite";
  signalContent.innerHTML = mode === "offer" ? `
    <h2>Share this invite</h2>
    <p class="signal-instruction">Copy this code and send it to the person you want to call. Use a private channel like a direct message.</p>
    <textarea class="signal-box" id="outgoing-signal" readonly aria-label="Your call invite">${invite}</textarea>
    <button class="primary-button wide" id="copy-invite">Copy invite <span class="button-arrow">↗</span></button>
    <div class="next-step"><span>01</span><p>After they open TwoWay, ask them to send their answer back here.</p></div>
    <textarea class="signal-box answer-box" id="incoming-answer" placeholder="Paste their answer here" aria-label="Answer from the other person"></textarea>
    <button class="secondary-button wide" id="connect-answer">Connect securely <span>→</span></button>
  ` : `
    <h2>Paste your invite</h2>
    <p class="signal-instruction">Ask the caller to send you their invite, then paste it below. It is only used to establish this connection.</p>
    <textarea class="signal-box answer-box" id="incoming-offer" placeholder="Paste the caller's invite here" aria-label="Invite from the caller"></textarea>
    <button class="primary-button wide" id="create-answer">Join call <span class="button-arrow">↗</span></button>
  `;
}

function showError(message: string) {
  const existing = signalContent.querySelector(".error-message");
  existing?.remove();
  const error = document.createElement("p");
  error.className = "error-message";
  error.textContent = message;
  signalContent.prepend(error);
}

async function startCaller() {
  try {
    createButton.disabled = true;
    localStream = await getMedia();
    const connection = createPeer();
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    await waitForIce(connection);
    renderSignalStep("offer", signalText({ type: "offer", sdp: connection.localDescription?.sdp ?? "" }));
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not access your camera and microphone.");
  } finally {
    createButton.disabled = false;
  }
}

async function startJoiner() {
  try {
    showJoinButton.disabled = true;
    localStream = await getMedia();
    renderSignalStep("answer");
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not access your camera and microphone.");
  } finally {
    showJoinButton.disabled = false;
  }
}

createButton.addEventListener("click", () => void startCaller());
showJoinButton.addEventListener("click", () => void startJoiner());
backButton.addEventListener("click", () => {
  peer?.close();
  localStream?.getTracks().forEach((track) => track.stop());
  peer = null;
  localStream = null;
  setVisible(signalView, false);
});

signalContent.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.closest("#copy-invite")) {
    const output = document.querySelector<HTMLTextAreaElement>("#outgoing-signal");
    if (output) {
      void navigator.clipboard.writeText(output.value);
      target.closest("button")!.textContent = "Copied ✓";
    }
  }
  if (target.closest("#connect-answer")) void connectCaller();
  if (target.closest("#create-answer")) void createAnswer();
});

async function connectCaller() {
  try {
    const input = document.querySelector<HTMLTextAreaElement>("#incoming-answer");
    if (!input?.value.trim() || !peer) throw new Error("Paste the other person's answer first.");
    await peer.setRemoteDescription(parseSignal(input.value));
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not connect the call.");
  }
}

async function createAnswer() {
  try {
    const input = document.querySelector<HTMLTextAreaElement>("#incoming-offer");
    if (!input?.value.trim()) throw new Error("Paste the caller's invite first.");
    const connection = createPeer();
    await connection.setRemoteDescription(parseSignal(input.value));
    const answer = await connection.createAnswer();
    await connection.setLocalDescription(answer);
    await waitForIce(connection);
    renderSignalStep("offer", signalText({ type: "answer", sdp: connection.localDescription?.sdp ?? "" }));
    signalLabel.textContent = "Send your answer";
    const heading = signalContent.querySelector("h2");
    if (heading) heading.textContent = "Send your answer";
    const instruction = signalContent.querySelector(".signal-instruction");
    if (instruction) instruction.textContent = "Copy this answer and send it back to the caller. Your call will begin when they paste it.";
    document.querySelector<HTMLTextAreaElement>("#incoming-answer")?.remove();
    document.querySelector<HTMLButtonElement>("#connect-answer")?.remove();
    showCall();
  } catch (error) {
    showError(error instanceof Error ? error.message : "Could not create an answer.");
  }
}

function endCall() {
  peer?.close();
  localStream?.getTracks().forEach((track) => track.stop());
  peer = null;
  localStream = null;
  remoteVideo.srcObject = null;
  callView.classList.add("hidden");
  document.body.classList.remove("in-call");
  signalView.classList.add("hidden");
  signalContent.innerHTML = "";
}

hangUpButtons.forEach((button) => button.addEventListener("click", endCall));
micButton.addEventListener("click", () => {
  const track = localStream?.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  micButton.classList.toggle("active", track.enabled);
  micButton.querySelector("span:last-child")!.textContent = track.enabled ? "Mute" : "Unmute";
});
cameraButton.addEventListener("click", () => {
  const track = localStream?.getVideoTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  cameraButton.classList.toggle("active", track.enabled);
  cameraButton.querySelector("span:last-child")!.textContent = track.enabled ? "Camera" : "Camera off";
});
