# Setup Supabase per Francesco Pilato DJ Website

Questa guida ti aiuterà a configurare Supabase per il sito. Supabase è molto più semplice di Vercel perché offre database e storage in un unico servizio gratuito.

## Perché Supabase?

✅ **Molto più semplice**: Un solo servizio invece di due  
✅ **Gratuito**: Piano generoso (500 MB database, 1 GB storage)  
✅ **Facile da configurare**: Dashboard intuitiva  
✅ **Perfetto per regalare**: Il tuo amico può creare il suo account facilmente  

## Step 1: Creare Account Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Clicca su **Start your project** o **Sign up**
3. Crea un account (puoi usare GitHub, Google, o email)
4. È completamente gratuito!

## Step 2: Creare un Nuovo Progetto

1. Dopo il login, clicca su **New Project**
2. Compila i campi:
   - **Name**: `pilato-dj-website` (o un nome a tua scelta)
   - **Database Password**: Scegli una password sicura (salvala!)
   - **Region**: Scegli la regione più vicina (es: `West EU (Ireland)`)
3. Clicca su **Create new project**
4. Aspetta 2-3 minuti che il progetto venga creato

## Step 3: Ottenere le Chiavi API

1. Nel tuo progetto Supabase, vai su **Settings** (icona ingranaggio in basso a sinistra)
2. Vai su **API**
3. Troverai due chiavi importanti:
   - **Project URL**: Copiala (es: `https://xxxxx.supabase.co`)
   - **anon public key**: Copiala (inizia con `eyJ...`)

## Step 4: Creare la Tabella Database

1. Nel tuo progetto Supabase, vai su **SQL Editor** (icona database nella barra laterale)
2. Clicca su **New query**
3. Incolla questo codice SQL:

```sql
-- Crea la tabella per i dati dell'app
CREATE TABLE IF NOT EXISTS app_data (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Abilita Row Level Security (RLS)
ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

-- Crea una policy per permettere lettura pubblica
CREATE POLICY "Allow public read access" ON app_data
  FOR SELECT USING (true);

-- Crea una policy per permettere scrittura pubblica
-- NOTA: In produzione, dovresti usare autenticazione!
CREATE POLICY "Allow public write access" ON app_data
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON app_data
  FOR UPDATE USING (true);
```

4. Clicca su **Run** (o premi `Ctrl+Enter` / `Cmd+Enter`)
5. Dovresti vedere "Success. No rows returned"

## Step 5: Creare il Bucket Storage per le Immagini

1. Nel tuo progetto Supabase, vai su **Storage** (icona folder nella barra laterale)
2. Clicca su **Create a new bucket**
3. Compila:
   - **Name**: `images`
   - **Public bucket**: ✅ **Spunta questa opzione** (importante!)
4. Clicca su **Create bucket**

### Configurare le Policy del Bucket

1. Vai su **Storage** → **Policies**
2. Clicca sul bucket `images`
3. Clicca su **New Policy**
4. Seleziona **For full customization**, poi clicca **Use this template**
5. Incolla questo codice:

```sql
-- Policy per permettere upload pubblico
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- Policy per permettere lettura pubblica
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Policy per permettere eliminazione pubblica
CREATE POLICY "Allow public delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');
```

6. Clicca su **Review** e poi **Save policy**

## Step 6: Configurare le Variabili d'Ambiente

### Se usi Vercel/Netlify/Render:

1. Vai sul tuo progetto di hosting
2. Vai su **Settings** → **Environment Variables**
3. Aggiungi queste variabili:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Sostituisci con i valori che hai copiato da Supabase.

### Se usi hosting tradizionale:

Crea un file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Non committare questo file su GitHub! È già nel `.gitignore`.

## Step 7: Deploy del Sito

1. Fai commit e push su GitHub
2. Il tuo servizio di hosting (Vercel, Netlify, Render, etc.) farà il deploy automaticamente
3. Assicurati che le variabili d'ambiente siano configurate

## Step 8: Testare

1. Vai sul tuo sito deployato
2. Accedi all'admin panel: `https://tuo-sito.com/admin`
3. Prova ad aggiungere:
   - Una nuova data
   - Un'immagine nella gallery
   - Un post nel blog
4. Verifica che i dati persistano dopo un refresh

## Troubleshooting

### Errore: "Missing Supabase environment variables"

- Verifica che le variabili d'ambiente siano impostate correttamente
- Controlla che i nomi siano esatti: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Fai redeploy dopo aver aggiunto le variabili

### Le immagini non si caricano

- Verifica che il bucket `images` sia pubblico
- Controlla che le policy del bucket siano configurate correttamente
- Verifica i log di Supabase in **Storage** → **Logs**

### I dati non persistono

- Verifica che la tabella `app_data` sia stata creata
- Controlla che le policy RLS siano configurate correttamente
- Verifica i log di Supabase in **Database** → **Logs**

### Errore 401 Unauthorized

- Verifica che stai usando la chiave `anon` e non la chiave `service_role`
- Controlla che le policy RLS permettano accesso pubblico

## Note Importanti

⚠️ **Sicurezza**:  
- Le policy attuali permettono accesso pubblico (per semplicità)
- Per un sito in produzione, considera di aggiungere autenticazione
- La chiave `anon` è sicura da usare nel frontend

⚠️ **Piano Gratuito Supabase**:
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 2 GB/mese
- Più che sufficiente per un sito personale!

⚠️ **Backup**:
- Supabase fa backup automatici
- Puoi esportare i dati dalla dashboard se necessario

## Condividere con il Tuo Amico

Per regalare il sito al tuo amico:

1. Il tuo amico crea il suo account Supabase
2. Crea un nuovo progetto seguendo questa guida
3. Ottiene le sue chiavi API
4. Configura le variabili d'ambiente sul suo hosting
5. Deploy del sito con il suo dominio

Tutto qui! Molto più semplice di Vercel! 🎉

## Supporto

Per problemi o domande:
- [Documentazione Supabase](https://supabase.com/docs)
- [Community Supabase](https://github.com/supabase/supabase/discussions)
- [Supporto Supabase](https://supabase.com/support)

