// Build-time only. VIZ_MODULE may point to an external @viz-js/viz installation.
const fs=require('node:fs');const path=require('node:path');
const {instance}=require(process.env.VIZ_MODULE||'@viz-js/viz');
(async()=>{
 const root=path.resolve(__dirname,'../assets/examples');
 const dot=fs.readFileSync(path.join(root,'schema.dot'),'utf8');
 const styled=dot.replace('rankdir=LR;', 'rankdir=LR; bgcolor="transparent"; pad="0.3"; nodesep="0.5";\n edge [color="#ff46bd",fontcolor="#b9aec9",fontname="monospace",fontsize=11];').replace('node [shape=box];','node [shape=box, style="rounded,filled", fillcolor="#1a112c", color="#28edff", fontcolor="#ece7f4", fontname="monospace", fontsize=13, margin="0.22,0.18"];');
 const viz=await instance();let svg=viz.renderString(styled,{format:'svg'});
 svg=svg.replace('<svg ', '<svg role="img" aria-labelledby="diagram-title" ').replace(/(<svg[^>]*>)/,'$1\n<title id="diagram-title">Schema biblioteca: loans fa riferimento a books e members</title>');
 fs.writeFileSync(path.join(root,'schema.svg'),svg);
 console.log('Rendered actual SQL Toolkit DOT with '+viz.graphvizVersion);
})().catch(e=>{console.error(e);process.exit(1)});
