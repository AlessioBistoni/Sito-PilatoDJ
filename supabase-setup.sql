-- Script SQL per inizializzare il database Supabase
-- Esegui questo script nel SQL Editor di Supabase

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


