# Ares Bortolussi — Systems, AI & Technical Education

Portfolio professionale statico in italiano: Analyst & Architect in GSNET Italia, consulenza tecnico-scientifica, leadership tecnica, cybersecurity, formazione e progetti personali. La versione corrente usa una palette ciano/magenta su fondo scuro, con dettagli console e struttura da CV consultabile.

## Struttura

- `index.html`: home pubblicata su GitHub Pages, con esploratore delle decisioni.
- `percorso.html`: sintesi professionale con filtri per ambito; il PDF pubblico in `assets/cv/` deriva da questa pagina.
- `v3/style.css` e `v3/site.js`: layout responsive, palette e stampa/PDF tramite browser.
- `v3/index.html`: confronto delle palette Blade Runner, Neuromante e Altered Carbon.
- `note/`: tre brevi note sulle scelte tecniche, collegate agli esempi.
- `assets/examples/`: input inventati, output reali e diagramma generato; provenienza e rigenerazione nel README locale.
- `scripts/`: generazione degli esempi dai progetti e rendering SVG durante lo sviluppo.
- `progetti/`: schede pubbliche di SQL Toolkit, Visit Ledger ed Entropy Bridge; il codice dei tre progetti resta privato.
- `old1/` e `old2/`: copie complete delle due versioni precedenti; disponibili anche come branch omonimi.
- `docs/`: decisioni editoriali e di progetto.

Nessun backend, database, font remoto, analytics o tracciamento. Navigazione e contenuti sono fruibili senza JavaScript; lo script abilita il selettore palette nella pagina di confronto e il comando di stampa. Le schede distinguono stato del software e contesto del contributo, senza presentare attività in corso come prodotti aziendali consegnati.

## Verifica locale

`python3 -m http.server 8080`, quindi aprire `http://localhost:8080`. Controlli strutturali: `python3 -m unittest discover -s tests -v`. I test non sostituiscono una revisione di accessibilità con utenti reali.

Il nome del repository resta `AresBortolussi.github.io` per mantenere l'indirizzo GitHub Pages.

## Mappa del repository

La [mappa delle cartelle](DIRECTORY_MAP.md) collega le guide dei percorsi mantenuti.

La home include anche una mappa del metodo a cinque passaggi e percorsi di contatto
per consulenza, formazione e collaborazioni. Il caso SQL Toolkit collega decisioni
e risultati eseguiti sul dataset dimostrativo.
