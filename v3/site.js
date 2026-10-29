'use strict';
const palettes = ['blade', 'neuro', 'carbon'];
const params = new URLSearchParams(location.search);
function selectTheme(theme) {
  if (!palettes.includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-palette]').forEach(button =>
    button.setAttribute('aria-pressed', String(button.dataset.palette === theme)));
}
selectTheme(params.get('theme') || 'carbon');
document.querySelectorAll('[data-palette]').forEach(button => button.addEventListener('click', () => {
  const theme = button.dataset.palette;
  selectTheme(theme);
  const url = new URL(location.href);
  url.searchParams.set('theme', theme);
  history.replaceState(null, '', url);
}));
const printButton = document.getElementById('print');
if (printButton) {
  printButton.hidden = false;
  printButton.addEventListener('click', () => window.print());
}

// All decisions are readable in source order until enhancement is ready.
const decisionTabs = document.querySelector('.decision-tabs');
if (decisionTabs) {
  const buttons = [...decisionTabs.querySelectorAll('[data-decision]')];
  const panels = [...document.querySelectorAll('[data-decision-panel]')];
  function selectDecision(index, focus = false) {
    buttons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    if (focus) buttons[index].focus();
  }
  decisionTabs.setAttribute('role', 'tablist');
  const tabLayout = window.matchMedia('(max-width: 760px)');
  const orientTabs = () => decisionTabs.setAttribute('aria-orientation', tabLayout.matches ? 'vertical' : 'horizontal');
  orientTabs();
  tabLayout.addEventListener('change', orientTabs);
  buttons.forEach((button, i) => {
    button.setAttribute('role', 'tab');
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.tabIndex = 0;
    button.addEventListener('click', () => selectDecision(i));
    button.addEventListener('keydown', event => {
      const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[event.key];
      let next;
      if (delta) next = (i + delta + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      selectDecision(next, true);
    });
  });
  selectDecision(0);
  decisionTabs.hidden = false;
}

// Filters concern presentation only; print always includes the full CV.
const filterBar = document.querySelector('.cv-filters');
if (filterBar) {
  const entries = [...document.querySelectorAll('.cv-entry')];
  const status = document.querySelector('.filter-status');
  filterBar.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    entries.forEach(entry => {
      entry.hidden = filter !== 'all' && !entry.dataset.area.split(' ').includes(filter);
    });
    filterBar.querySelectorAll('button').forEach(item =>
      item.setAttribute('aria-pressed', String(item === button)));
    status.textContent = `${entries.filter(entry => !entry.hidden).length} esperienze · ${button.textContent}`;
  }));
  status.textContent = `${entries.length} esperienze · Tutto il percorso`;
  status.hidden = false;
  filterBar.hidden = false;
}

// Reading progress only; no scroll interception or storage.
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);
let scheduled = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0})`;
  scheduled = false;
}
function scheduleProgress() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
}
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress, { passive: true });
updateProgress();

// Method map: every stage has a concrete example and remains readable without JS.
const methodSteps = document.querySelector('.method-steps');
if (methodSteps) {
  const tabs = [...methodSteps.querySelectorAll('[data-method]')];
  const panels = [...document.querySelectorAll('[data-method-panel]')];
  function chooseStage(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    if (focus) tabs[index].focus();
  }
  methodSteps.setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => chooseStage(i));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      chooseStage(next, true);
    });
  });
  chooseStage(0);
  methodSteps.hidden = false;
}
