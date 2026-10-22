# Collaudo della revisione

22 ottobre 2026. Verifica locale su Chromium 153 con Playwright 1.64.1 e axe-core, viewport 1440×1000 e 390×1000.

- Quattro controlli automatici su intestazioni, riferimenti locali, identificativi, metadata e assenza di dipendenze runtime esterne: superati.
- Sei schede presenti senza JavaScript; controlli aggiuntivi nascosti quando JavaScript non è disponibile.
- Filtri e ripristino della selezione: verificati; tre risultati per AI/dati.
- Tema chiaro/scuro e aggiornamento dello stato accessibile: verificati.
- Nessun errore JavaScript o overflow orizzontale a entrambe le larghezze.
- Nessuna violazione rilevata dai controlli automatici axe WCAG 2 A/AA nei due temi e nelle due larghezze, dopo correzione dei contrasti.
- Immagini desktop/mobile ispezionate. Questi controlli non costituiscono una certificazione di accessibilità o un test completo con screen reader.

Esecuzione dei controlli statici: `python3 -m unittest discover -s tests -v`. Il browser non ha verificato l’invio di email né una nuova pubblicazione GitHub Pages. Il merge della pull request è separato dalla preparazione della revisione.

![Anteprima desktop](previews/desktop.jpg)
