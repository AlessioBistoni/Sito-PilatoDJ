# Istruzioni per il Deploy su GitHub e Vercel

## 1. Creare il Repository su GitHub

1. Vai su [GitHub](https://github.com) e accedi al tuo account
2. Clicca sul pulsante "+" in alto a destra e seleziona "New repository"
3. Scegli un nome per il repository (es: `pilato-dj-website`)
4. **NON** inizializzare il repository con README, .gitignore o licenza
5. Clicca su "Create repository"

## 2. Collegare il Repository Locale a GitHub

Dopo aver creato il repository, GitHub ti mostrerà le istruzioni. Esegui questi comandi nel terminale:

```bash
git remote add origin https://github.com/TUO_USERNAME/NOME_REPOSITORY.git
git push -u origin main
```

Sostituisci:
- `TUO_USERNAME` con il tuo username GitHub
- `NOME_REPOSITORY` con il nome del repository che hai scelto

## 3. Deploy su Vercel

### Opzione A: Tramite GitHub (Consigliato)

1. Vai su [Vercel](https://vercel.com) e accedi con il tuo account GitHub
2. Clicca su "Add New Project"
3. Seleziona il repository che hai appena creato
4. Vercel rileverà automaticamente che è un progetto Next.js
5. Lascia le impostazioni di default e clicca su "Deploy"
6. Vercel creerà automaticamente il deploy e ti darà un URL

### Opzione B: Tramite Vercel CLI

1. Installa Vercel CLI:
```bash
npm i -g vercel
```

2. Esegui il deploy:
```bash
vercel
```

3. Segui le istruzioni nel terminale

## 4. Configurazioni Importanti per Vercel

### Variabili d'Ambiente
⚠️ **IMPORTANTE**: Dopo il deploy, devi configurare Vercel Blob Storage e Vercel KV.

**Nota**: KV e Blob Storage sono disponibili tramite il **Marketplace** di Vercel (Storage → Marketplace), rendendo la configurazione più semplice!

Vedi il file `VERCEL_SETUP.md` per le istruzioni complete.

### Build Settings
Vercel rileverà automaticamente:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automatico)
- **Output Directory**: `.next` (automatico)

### Note Importanti

⚠️ **Storage delle Immagini**: 
- Le immagini caricate tramite l'admin panel vengono salvate su **Vercel Blob Storage**
- Le immagini sono persistenti e accessibili pubblicamente
- Non è necessario fare commit su GitHub per le immagini

⚠️ **Dati Persistenti**:
- I dati dell'admin (date, blog posts, gallery) sono salvati su **Vercel KV**
- I dati sono condivisi tra tutti gli utenti
- Le modifiche dall'admin si aggiornano automaticamente sul sito pubblico
- Il sito si aggiorna automaticamente ogni 5 secondi per mostrare le nuove modifiche

## 5. Aggiornamenti Futuri

Dopo ogni modifica:
1. Fai commit delle modifiche:
```bash
git add .
git commit -m "Descrizione delle modifiche"
```

2. Fai push su GitHub:
```bash
git push
```

3. Vercel aggiornerà automaticamente il sito (se hai collegato GitHub)

## Supporto

Per problemi o domande:
- [Documentazione Vercel](https://vercel.com/docs)
- [Documentazione Next.js](https://nextjs.org/docs)

