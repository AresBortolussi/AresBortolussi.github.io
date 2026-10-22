# Ares Bortolussi — portfolio

Portfolio statico in italiano, senza runtime server, framework o risorse esterne. HTML semantico, CSS responsive, JavaScript progressivo. Tutti i contenuti rimangono leggibili senza JavaScript; filtri e tema si attivano solo quando lo script è disponibile.

## Anteprima

`python3 -m http.server 8080` e aprire http://localhost:8080.

## Manutenzione

- `index.html`: biografia, progetti, stati e contatti.
- `assets/modern/site.css`: palette, layout e breakpoint.
- `assets/modern/site.js`: filtri accessibili e preferenza locale del tema.
- `docs/CONTENT.md`: perimetro editoriale e aggiornamenti.

Nessun analytics, cookie di tracciamento, font remoto o modulo che raccoglie dati. Il contatto usa il client email dell’utente. La preferenza del tema è salvata nel browser quando consentito.

La revisione è proposta in un branch: il sito pubblico cambia solo con il merge. Gli asset e il vecchio CV restano nella storia del repository e non sono presentati come aggiornati.
