'use strict';
const data=JSON.parse(document.getElementById('fir-data').textContent);
const slider=document.getElementById('sample-index');
const panel=document.querySelector('.sample-explorer');
slider.max=String(data.input.length-1);
function select(){
 const n=Number(slider.value);
 document.getElementById('sample-index-label').value=String(n);
 document.getElementById('sample-input').textContent=String(data.input[n]);
 document.getElementById('sample-output').textContent=String(data.output[n]);
 slider.setAttribute('aria-valuetext',`Campione ${n}, ingresso ${data.input[n]}, uscita ${data.output[n]}`);
}
slider.addEventListener('input',select);select();panel.hidden=false;
