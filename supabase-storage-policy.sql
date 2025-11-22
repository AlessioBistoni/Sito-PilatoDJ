-- Policy per il bucket Storage 'images'
-- Esegui questo script nel SQL Editor di Supabase dopo aver creato il bucket

-- Policy per permettere upload pubblico
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- Policy per permettere lettura pubblica
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Policy per permettere eliminazione pubblica
CREATE POLICY "Allow public delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

