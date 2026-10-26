'use strict';
const palettes=['blade','neuro','carbon'];
const params=new URLSearchParams(location.search);
function selectTheme(theme){
  if(!palettes.includes(theme))return;
  document.documentElement.dataset.theme=theme;
  document.querySelectorAll('[data-palette]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.palette===theme)));
}
selectTheme(params.get('theme')||'blade');
document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{
  const theme=button.dataset.palette;selectTheme(theme);
  const url=new URL(location.href);url.searchParams.set('theme',theme);history.replaceState(null,'',url);
}));
const printButton=document.getElementById('print');printButton.hidden=false;printButton.addEventListener('click',()=>window.print());
