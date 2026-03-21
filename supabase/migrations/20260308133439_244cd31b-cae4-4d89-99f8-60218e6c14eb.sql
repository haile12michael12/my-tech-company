
-- Storage RLS policies for portal-files bucket
CREATE POLICY "Clients can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portal-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Clients can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'portal-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Clients can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portal-files' AND (storage.foldername(name))[1] = auth.uid()::text);
