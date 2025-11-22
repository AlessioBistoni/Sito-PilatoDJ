# Setup Vercel per Francesco Pilato DJ Website

Questa guida ti aiuterà a configurare Vercel Blob Storage e Vercel Postgres per il sito.

## Prerequisiti

1. Account Vercel (gratuito)
2. Progetto già deployato su Vercel (o pronto per il deploy)

## Nota sul Marketplace

⚠️ **Importante**: 
- **Blob Storage** è disponibile tramite il **Marketplace** di Vercel (metodo consigliato)
- **Postgres** è disponibile tramite il **Marketplace** di Vercel (metodo consigliato)
- Entrambi possono essere configurati facilmente dal Marketplace

## Step 1: Configurare Vercel Blob Storage

Vercel Blob Storage è necessario per salvare le immagini caricate dall'admin panel.

### Metodo tramite Marketplace (Consigliato)

1. Vai sul tuo progetto su [Vercel Dashboard](https://vercel.com/dashboard)
2. Vai su **Storage** → **Marketplace** (o cerca "Marketplace" nella barra laterale)
3. Cerca **"Blob"** o **"Vercel Blob"**
4. Clicca su **Add** o **Install**
5. Scegli un nome (es: `pilato-dj-blob`)
6. Seleziona il piano (il piano gratuito include 1 GB)
7. Clicca **Create** o **Add**

### Metodo Alternativo (se il Marketplace non è disponibile)

1. Vai su **Settings** → **Storage**
2. Clicca su **Create Database** o **Add Storage**
3. Seleziona **Blob**
4. Scegli un nome (es: `pilato-dj-blob`)
5. Clicca **Create**

### Ottenere le Variabili d'Ambiente

Dopo aver creato il Blob Storage:

1. Vai su **Settings** → **Environment Variables**
2. Vercel dovrebbe aver già aggiunto automaticamente:
   - `BLOB_READ_WRITE_TOKEN` (o simile)

Se non vedi queste variabili, vai su **Storage** → **Blob** → **Settings** e copia il token.

## Step 2: Configurare Vercel Postgres

Vercel Postgres è necessario per salvare i dati (date, gallery, blog posts).

### Metodo tramite Marketplace (Consigliato)

1. Vai sul tuo progetto su [Vercel Dashboard](https://vercel.com/dashboard)
2. Vai su **Storage** → **Marketplace** (o cerca "Marketplace" nella barra laterale)
3. Cerca **"Postgres"** o **"Vercel Postgres"**
4. Clicca su **Add** o **Install**
5. Scegli un nome (es: `pilato-dj-postgres`)
6. Seleziona il piano (il piano gratuito include 256 MB)
7. Clicca **Create** o **Add**

### Metodo Alternativo (se il Marketplace non è disponibile)

1. Vai su **Settings** → **Storage**
2. Clicca su **Create Database** o **Add Storage**
3. Seleziona **Postgres**
4. Scegli un nome (es: `pilato-dj-postgres`)
5. Clicca **Create**

### Ottenere le Variabili d'Ambiente

Dopo aver creato Postgres:

1. Vai su **Settings** → **Environment Variables**
2. Vercel dovrebbe aver già aggiunto automaticamente:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

Se non vedi queste variabili, vai su **Storage** → **Postgres** → **Settings** e copia i valori.

### Inizializzazione Automatica

⚠️ **Nota**: La tabella `app_data` verrà creata automaticamente alla prima richiesta API. Non è necessario crearla manualmente.

## Step 3: Verificare le Variabili d'Ambiente

Assicurati che nel tuo progetto Vercel ci siano queste variabili d'ambiente:

### Per Blob Storage:
- `BLOB_READ_WRITE_TOKEN` (o il nome che Vercel ha assegnato)

### Per Postgres:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (opzionale)
- `POSTGRES_URL_NON_POOLING` (opzionale)

## Step 4: Rideployare il Progetto

Dopo aver configurato Blob Storage e KV:

1. Vai su **Deployments**
2. Clicca sui tre puntini (...) dell'ultimo deployment
3. Seleziona **Redeploy**
4. Oppure fai un nuovo commit e push su GitHub (se hai il collegamento automatico)

## Step 5: Testare

1. Vai sul tuo sito deployato
2. Accedi all'admin panel: `https://tuo-sito.vercel.app/admin`
3. Prova ad aggiungere:
   - Una nuova data
   - Un'immagine nella gallery
   - Un post nel blog
4. Verifica che i dati persistano dopo un refresh della pagina

## Troubleshooting

### Errore: "BLOB_READ_WRITE_TOKEN is not defined"

- Verifica che la variabile d'ambiente sia impostata in Vercel
- Assicurati di aver fatto redeploy dopo aver aggiunto le variabili

### Errore: "POSTGRES_URL is not defined"

- Verifica che tutte le variabili Postgres siano impostate in Vercel
- Controlla che Postgres sia stato creato correttamente
- Assicurati di aver fatto redeploy dopo aver aggiunto le variabili

### Le immagini non si caricano

- Verifica che Blob Storage sia stato creato e configurato
- Controlla i log di Vercel per errori specifici

### I dati non persistono

- Verifica che Postgres sia stato creato e configurato
- Controlla che le API routes funzionino correttamente
- Verifica che la tabella `app_data` sia stata creata (viene creata automaticamente)

## Note Importanti

⚠️ **Piano Gratuito Vercel**:
- Blob Storage: 1 GB di storage gratuito
- Postgres: 256 MB di storage gratuito
- Entrambi sono sufficienti per un sito di medie dimensioni

⚠️ **Backup**:
- I dati sono salvati su Vercel, ma considera di fare backup periodici
- Puoi esportare i dati tramite le API se necessario

## Supporto

Per problemi o domande:
- [Documentazione Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Documentazione Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supporto Vercel](https://vercel.com/support)

