const params = new URLSearchParams(location.search);
const view = params.get('view') === 'slides' ? 'slides' : 'video';
const count = 11;
const requestedSlide = Number(params.get('slide'));
let current = Number.isInteger(requestedSlide) && requestedSlide >= 1 && requestedSlide <= count ? requestedSlide : 1;
const slide = document.querySelector('#slide');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const jump = document.querySelector('#jump');
for (let i = 1; i <= count; i++) {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = `Slide ${i}`;
  jump.append(option);
}
for (const name of ['video', 'slides']) {
  document.querySelector(`#${name}-panel`).hidden = name !== view;
  const tab = document.querySelector(`#${name}-tab`);
  if (name === view) tab.setAttribute('aria-current', 'page');
  else tab.removeAttribute('aria-current');
}
document.title = view === 'slides' ? 'InCreditble — Pitch deck' : 'InCreditble — Product demo';
function showSlide(value, updateUrl = true) {
  current = Math.max(1, Math.min(count, value));
  slide.src = `./slides/slide-${String(current).padStart(2, '0')}.png`;
  slide.alt = `InCreditble pitch deck — slide ${current} of ${count}`;
  document.querySelector('#counter').textContent = `${current} / ${count}`;
  prev.disabled = current === 1;
  next.disabled = current === count;
  jump.value = String(current);
  if (updateUrl) history.replaceState(null, '', `?view=slides&slide=${current}`);
  if (current < count) { const img = new Image(); img.src = `./slides/slide-${String(current+1).padStart(2,'0')}.png`; }
}
prev.addEventListener('click', () => showSlide(current - 1));
next.addEventListener('click', () => showSlide(current + 1));
jump.addEventListener('change', () => showSlide(Number(jump.value)));
document.addEventListener('keydown', (event) => {
  if (view !== 'slides' || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
showSlide(current, false);
