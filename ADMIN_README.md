# Pannello Admin - Guida all'Uso

## Accesso al Pannello Admin

1. Vai su: `http://localhost:3000/admin` (o il tuo dominio)
2. Inserisci la password (di default: `piluz2024`)
3. Se vuoi cambiare la password, modifica il file `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=tua_password_sicura
   ```

## Funzionalità Disponibili

### 📅 Gestione Date
- **Percorso**: `/admin/dates`
- **Funzioni**:
  - Aggiungi nuove date degli eventi
  - Rimuovi date esistenti
  - Le date vengono ordinate automaticamente
  - Solo le date future vengono mostrate sul sito pubblico

### 🖼️ Gestione Gallery
- **Percorso**: `/admin/gallery`
- **Funzioni**:
  - Carica immagini direttamente dal tuo PC
  - Le immagini vengono ridimensionate automaticamente (max 1200x1200px)
  - Le immagini vengono salvate automaticamente nella cartella `public/immagini/serate/`
  - Rimuovi immagini esistenti (vengono eliminate anche i file fisici)
  - Anteprima dell'immagine prima del caricamento

### 📝 Gestione Blog
- **Percorso**: `/admin/blog`
- **Funzioni**:
  - Crea nuovi post
  - Modifica post esistenti
  - Pubblica/Nascondi post
  - Elimina post
  - I post pubblicati appaiono sul sito principale

## Come Aggiungere Immagini

1. Vai su `/admin/gallery`
2. Clicca su "Nuova Immagine"
3. Seleziona un'immagine dal tuo PC (qualsiasi formato immagine)
4. L'immagine verrà mostrata in anteprima
5. Aggiungi una descrizione (opzionale)
6. Clicca su "Carica e Salva"
7. L'immagine verrà automaticamente:
   - Ridimensionata (max 1200x1200px mantenendo le proporzioni)
   - Ottimizzata per il web
   - Salvata nella cartella corretta

## Come Aggiungere Date

1. Vai su `/admin/dates`
2. Clicca su "Nuova Data"
3. Inserisci:
   - Data dell'evento
   - Città (es: Perugia)
   - Luogo (es: Thebris Cafè)
4. Salva

## Come Pubblicare un Post

1. Vai su `/admin/blog`
2. Clicca su "Nuovo Post"
3. Inserisci:
   - Titolo
   - Contenuto (puoi scrivere in più righe)
   - Spunta "Pubblica subito" se vuoi che appaia immediatamente
4. Salva

## Note Importanti

- **Storage**: I dati sono salvati nel `localStorage` del browser
- **Sicurezza**: La password è semplice, per produzione considera un sistema più sicuro
- **Backup**: I dati sono salvati localmente, fai attenzione a non cancellare i dati del browser
- **Immagini**: Assicurati che le immagini siano ottimizzate per il web

## Struttura Dati

I dati sono salvati in localStorage con queste chiavi:
- `dates`: Array di date eventi
- `gallery_images`: Array di immagini gallery
- `blog_posts`: Array di post blog
- `admin_authenticated`: Flag di autenticazione

## Link Utili

- Dashboard: `/admin/dashboard`
- Gestione Date: `/admin/dates`
- Gestione Gallery: `/admin/gallery`
- Gestione Blog: `/admin/blog`

