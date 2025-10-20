import React from "react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999
    }}>
      <div style={{background:'#fff',padding:18,borderRadius:8,width:'min(720px,95%)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <h4>{title}</h4>
          <button className="btn ghost" onClick={onClose}>Cerrar</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}