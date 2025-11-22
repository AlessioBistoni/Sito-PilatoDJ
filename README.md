# Francesco Pilato DJ - Sito Web Professionale

Sito web moderno e professionale per Francesco Pilato DJ (Piluz), costruito con le tecnologie più avanzate.

## 🚀 Tecnologie Utilizzate

- **Next.js 14** - Framework React per applicazioni web moderne
- **React 18** - Libreria UI moderna
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Libreria per animazioni fluide e moderne
- **Lucide React** - Icone moderne e leggere
- **TypeScript** - Tipizzazione statica per JavaScript
- **Supabase** - Database PostgreSQL e Storage per immagini (gratuito e semplice!)

## ✨ Caratteristiche

- 🎨 Design moderno e d'impatto
- 🎭 Animazioni fluide con Framer Motion
- 📱 Completamente responsive
- ⚡ Performance ottimizzate
- 🎯 SEO-friendly
- 🌙 Tema scuro professionale

## 📦 Installazione

1. Installa le dipendenze:
```bash
npm install
```

2. Configura Supabase (vedi `SUPABASE_SETUP.md` per istruzioni dettagliate):
   - Crea un account su [supabase.com](https://supabase.com)
   - Crea un nuovo progetto
   - Esegui gli script SQL in `supabase-setup.sql` e `supabase-storage-policy.sql`
   - Crea un file `.env.local` con:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser

## 🏗️ Build per Produzione

```bash
npm run build
npm start
```

## 📁 Struttura del Progetto

```
pilatoDj/
├── app/
│   ├── globals.css      # Stili globali e Tailwind
│   ├── layout.tsx       # Layout principale
│   └── page.tsx         # Pagina home
├── components/
│   ├── Navigation.tsx   # Navigazione principale
│   ├── Hero.tsx         # Sezione hero con animazioni
│   ├── About.tsx        # Sezione chi sono
│   ├── Services.tsx     # Sezione servizi
│   ├── Gallery.tsx      # Galleria serate
│   ├── Contact.tsx      # Form contatti
│   └── Footer.tsx       # Footer
├── public/
│   └── immagini/        # Immagini statiche
│       ├── logo.jpg
│       └── serate/      # Immagini delle serate
└── package.json
```

## 🎨 Sezioni del Sito

1. **Hero** - Sezione introduttiva con animazioni d'impatto
2. **Chi Sono** - Presentazione e citazione di Nietzsche
3. **Servizi** - Servizi offerti (eventi, discoteche, mix, etc.)
4. **Serate** - Galleria fotografica delle serate
5. **Contatti** - Form di contatto e informazioni

## 🔧 Personalizzazione

### Colori
I colori possono essere personalizzati in `tailwind.config.ts`:
- Primary: Rosa/Viola
- Neon: Pink, Blue, Purple

### Contenuti
Modifica i componenti in `components/` per personalizzare i testi e le informazioni.

### Immagini
Aggiungi le tue immagini in `public/immagini/` e aggiorna i percorsi nei componenti.

## 🗄️ Database e Storage

Questo progetto usa **Supabase** per:
- **Database PostgreSQL**: Per salvare date eventi, gallery e blog posts
- **Storage**: Per salvare le immagini caricate dall'admin panel

Supabase è gratuito e molto semplice da configurare. Vedi `SUPABASE_SETUP.md` per le istruzioni complete.

## 🔐 Admin Panel

Il sito include un pannello admin per gestire:
- 📅 Date degli eventi
- 🖼️ Immagini della gallery
- 📝 Post del blog

Accedi a `/admin` (password di default: `piluz2024`)

Vedi `ADMIN_README.md` per maggiori informazioni.

## 📝 Note

- Assicurati di avere Node.js 18+ installato
- Le immagini vengono ottimizzate automaticamente durante l'upload
- Supabase offre un piano gratuito generoso (500 MB database, 1 GB storage)
- Per il form di contatto, configura un servizio di backend o un servizio come Formspree

## 📄 Licenza

© 2024 Francesco Pilato. Tutti i diritti riservati.

