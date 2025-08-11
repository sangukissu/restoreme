-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('restored-images', 'restored-images', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'restored-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'restored-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'restored-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'restored-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
