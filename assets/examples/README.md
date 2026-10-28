# Esempi eseguiti per il portfolio

Tutti gli input sono inventati per questa dimostrazione. Non provengono da
archivi personali, clienti, ristoranti reali o misure FPGA.

- `library.sql`: schema dimostrativo SQLite, tre tabelle e due FK. Import,
  validazione, piano, DDL, documentazione e DOT sono output di SQL Toolkit.
- `schema.svg`: rendering del DOT effettivo tramite Graphviz 16.1.0
  (@viz-js/viz), con soli attributi grafici aggiunti per la palette del sito.
- `visits.csv`: sei visite inventate. JSON e testo sono output effettivi del
  motore C Visit Ledger, usando esplicitamente `--reader c`.
- `fir-samples.json`: campioni deterministici calcolati dalla libreria C e
  verificati contro il VHDL esistente con le asserzioni GHDL. Non è un benchmark
  di latenza, potenza, throughput o entropia fisica.
- `manifest.json`: commit sorgenti, strumenti, comandi e impronte degli artefatti.

## Rigenerazione

Dal checkout del portfolio, con i tre progetti affiancati nella cartella padre:

```
python3 scripts/generate_examples.py --projects .. --ghdl /percorso/al/ghdl
```

Servono i sorgenti dei tre progetti (attualmente privati), la CLI SQL Toolkit
installata in sql-toolkit/.venv, un compilatore C e GHDL. Il lettore Visit Ledger
e la libreria FIR sono compilati in una directory temporanea. Gli input della
dimostrazione sono definiti nello script; nessun dataset dell'utente viene letto.

Per il rendering SVG, con @viz-js/viz installato come strumento di sviluppo:

```
VIZ_MODULE=/percorso/a/node_modules/@viz-js/viz node scripts/render_erd.cjs
```

La libreria Graphviz è usata durante la generazione, non caricata nel browser.
Il sito resta statico. Il controllo interattivo FIR scorre risultati già verificati;
la tabella completa è disponibile anche senza JavaScript.
