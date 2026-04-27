import React from 'react';
import { Camera, Plus } from 'lucide-react';

const Gallery = ({ images = [], isAdmin }) => (
  <div className="glass" style={{padding:32, marginTop:24}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
      <div className="section-title" style={{marginBottom:0}}>
        <Camera size={20} className="section-title-icon"/> Галерея
      </div>
      {isAdmin && (
        <button className="btn btn-ghost" style={{padding:'8px 16px', fontSize:'0.85rem'}}>
          <Plus size={15}/> Добавить
        </button>
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
export default Gallery;
