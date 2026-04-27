import React, { useState, useRef } from 'react';
import { Camera, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEvents } from '../context/EventContext';

const Gallery = ({ eventId, images = [], isAdmin }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateEvent } = useEvents();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !eventId) return;

    try {
      setUploading(true);
      
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId}/${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      // 3. Update Database
      const newImages = [...images, publicUrl];
      const { error: updateError } = await updateEvent(eventId, { gallery: newImages });

      if (updateError) throw updateError;
      
      // Refresh logic is handled by EventContext updating the global state
      // but in EventPage we might need to refresh local state if it's not synced
      window.location.reload(); // Simple way to sync for now

    } catch (error) {
      console.error('Error uploading:', error);
      alert('Ошибка при загрузке фото. Убедитесь, что в Supabase создан bucket "gallery" с публичным доступом.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass" style={{padding:32, marginTop:24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <div className="section-title" style={{marginBottom:0}}>
          <Camera size={20} className="section-title-icon"/> Галерея
        </div>
        
        {isAdmin && (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{display:'none'}} 
              accept="image/*"
              onChange={handleUpload}
            />
            <button 
              className="btn btn-ghost" 
              style={{padding:'8px 16px', fontSize:'0.85rem'}}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15}/>}
              {uploading ? ' Загрузка...' : ' Добавить'}
            </button>
          </>
        )}
      </div>

      <div className="gallery-grid">
        {images.length === 0 ? (
          <div className="gallery-empty">
            📷 Фотографии появятся здесь после события
          </div>
        ) : (
          images.map((img,i) => (
            <div key={i} className="gallery-item">
              <img src={img} alt={`photo-${i}`}/>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;
