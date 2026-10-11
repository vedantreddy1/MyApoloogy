'use strict';

const modal = document.getElementById('modalLayer');
const resultLayer = document.getElementById('resultLayer');
const openButton = document.getElementById('openApology');
const closeButton = document.getElementById('closeDialog');
const yesButton = document.getElementById('yesBtn');
const noButton = document.getElementById('noBtn');
const spaceButton = document.getElementById('spaceBtn');
const zone = document.getElementById('choiceZone');
const underNote = document.getElementById('underNote');
const finishButton = document.getElementById('finishBtn');
let dodgeCount = 0;
let lastFocus = null;

function showModal() {
  lastFocus = document.activeElement;
  resultLayer.hidden = true;
  resultLayer.classList.remove('open');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  resetNoButton();
  requestAnimationFrame(() => closeButton.focus());
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  (lastFocus || openButton).focus();
}
function resetNoButton() {
  dodgeCount = 0;
  noButton.classList.remove('dodging');
  noButton.style.left = '';
  noButton.style.top = '';
  noButton.style.transform = '';
  noButton.textContent = 'Not yet';
  underNote.textContent = 'No pressure, really. Take your time.';
}
// The button dodges twice for a playful effect. After that, it stays
// fully clickable: accepting an apology must always be a real choice.
function dodgeNo() {
  dodgeCount += 1;
  noButton.classList.add('dodging');
  const zoneRect = zone.getBoundingClientRect();
  const btnWidth = noButton.offsetWidth;
  const btnHeight = noButton.offsetHeight;
  const maxX = Math.max(0, zoneRect.width - btnWidth - 4);
  const maxY = Math.max(0, zoneRect.height - btnHeight - 4);
  const places = [
    {x: maxX * .72, y: maxY * .95},
    {x: maxX * .05, y: maxY * .85},
  ];
  const spot = places[Math.min(dodgeCount - 1, places.length - 1)];
  noButton.style.left = `${spot.x}px`;
  noButton.style.top = `${spot.y}px`;
  noButton.textContent = dodgeCount === 1 ? 'Are you sure? 👀' : 'Okay, your choice ♡';
  underNote.textContent = dodgeCount === 1 ? 'Oops, that button is feeling shy 🙈' : 'I promise, the choice is yours.';
}
function showResult(accepted) {
  const deliveryStatus = document.getElementById('deliveryStatus');
  deliveryStatus.classList.remove('error');
  deliveryStatus.textContent = 'Sending your choice…';
  closeModal();
  const title = document.getElementById('resultTitle');
  const eyebrow = document.getElementById('resultEyebrow');
  const message = document.getElementById('resultMessage');
  const icon = document.getElementById('resultIcon');
  const confetti = document.getElementById('confetti');
  confetti.replaceChildren();
  if (accepted) {
    eyebrow.textContent = 'a little happier now';
    title.innerHTML = 'Thank you <em>so much.</em>';
    message.textContent = "It means a lot that you heard me out. Fifteen years of friendship hold so many memories, and I hope we can make better ones too. No rush, no pressure. I'll listen whenever you're ready. ♡";
    icon.textContent = '♥';
    for (let i = 0; i < 34; i++) {
      const piece = document.createElement('span');
      piece.style.setProperty('--x', `${Math.random() * 100}%`);
      piece.style.setProperty('--size', `${4 + Math.random() * 7}px`);
      piece.style.setProperty('--color', ['#d76d8f','#f1b6bd','#f0d0a6','#c69bc2'][i % 4]);
      piece.style.setProperty('--radius', i % 3 === 0 ? '50%' : '2px');
      piece.style.setProperty('--duration', `${2 + Math.random() * 2}s`);
      piece.style.setProperty('--delay', `${Math.random() * 1}s`);
      confetti.appendChild(piece);
    }
  } else {
    eyebrow.textContent = 'i understand';
    title.innerHTML = 'Take your <em>time.</em>';
    message.textContent = "Thank you for reading this. I respect how you feel, and I'm not asking you to change your mind. Wishing you nothing but good things. ♡";
    icon.textContent = '♡';
  }
  resultLayer.hidden = false;
  requestAnimationFrame(() => {
    resultLayer.classList.add('open');
    document.body.style.overflow = 'hidden';
    finishButton.focus();
  });
}
function closeResult() {
  resultLayer.classList.remove('open');
  document.body.style.overflow = '';
  openButton.focus();
  setTimeout(() => { if (!resultLayer.classList.contains('open')) resultLayer.hidden = true; }, 320);
}
async function sendChoice(choice) {
  const status = document.getElementById('deliveryStatus');
  try {
    const response = await fetch('/api/response', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({choice})
    });
    if (!response.ok) throw new Error('Notification request failed');
    status.textContent = 'Your choice was sent. Thank you for being honest. ♡';
  } catch (_) {
    status.textContent = 'Your choice could not be sent, but it is still respected. You can tell me directly if you want.';
    status.classList.add('error');
  }
}
function choose(choice) {
  showResult(choice === 'yes');
  sendChoice(choice);
}
openButton.addEventListener('click', showModal);
closeButton.addEventListener('click', closeModal);
yesButton.addEventListener('click', () => choose('yes'));
noButton.addEventListener('click', () => {
  if (dodgeCount < 2 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) dodgeNo();
  else choose('not_yet');
});
spaceButton.addEventListener('click', () => choose('space'));
finishButton.addEventListener('click', closeResult);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
resultLayer.addEventListener('click', e => { if (e.target === resultLayer) closeResult(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!resultLayer.hidden && resultLayer.classList.contains('open')) closeResult();
    else if (modal.classList.contains('open')) closeModal();
  }
});
// Open the pop-up automatically on first load, after a tiny visual pause.
window.addEventListener('load', () => setTimeout(showModal, 450), {once:true});
