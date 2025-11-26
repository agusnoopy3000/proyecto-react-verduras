import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import productosDefault from "../data/productos";
import api from '../api/client';

export default function Admin() {
  const [view, setView] = useState("productos"); // 'productos' | 'usuarios' | 'pedidos' | 'documentos'
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingUserIdx, setEditingUserIdx] = useState(null);
  const [editingProdIdx, setEditingProdIdx] = useState(null);
  const [editingOrderIdx, setEditingOrderIdx] = useState(null);
  const emptyUser = { run: "", nombre: "", apellidos: "", email: "", tipo: "Cliente", region: "", comuna: "", direccion: "", fechaNac: "" };
  const emptyProd = { codigo: "", nombre: "", desc: "", precio: 0, stock: 0, stockCritico: 0, categoria: "", img: "" };
  const emptyOrder = { id: "", status: "PENDIENTE" };
  const [userForm, setUserForm] = useState(emptyUser);
  const [prodForm, setProdForm] = useState(emptyProd);
  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [msg, setMsg] = useState("");
  
  // Estados para subida de archivos
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('OTRO');
  const [descripcionDoc, setDescripcionDoc] = useState('');

  // Tipos de documento disponibles
  const tiposDocumento = [
    { value: 'FACTURA', label: '📄 Factura' },
    { value: 'ORDEN_COMPRA', label: '📋 Orden de Compra' },
    { value: 'GUIA_DESPACHO', label: '🚚 Guía de Despacho' },
    { value: 'CONTRATO', label: '📝 Contrato' },
    { value: 'OTRO', label: '📁 Otro' }
  ];

  // storage keys (solo para compatibilidad antigua de usuarios/productos)
  const USERS_KEY = "users";
  const PRODS_KEY = "admin_products";

  useEffect(() => {
    loadUsers();
    loadProducts();
    loadOrders();
    loadDocuments();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/v1/users', { params: { page: 0, size: 50 } });
      setUsers(data?.content || data || []);
    } catch {
      setUsers([]);
    }
  };

  const saveUsers = async (arr) => {
    // implementación real debería hacer POST/PUT/DELETE; se mantiene local mientras tanto
    setUsers(arr);
  };

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/v1/products');
      // Filtrar SOLO productos válidos (deben tener codigo, nombre Y precio, y NO deben tener email/run)
      const filteredProducts = (Array.isArray(data) ? data : []).filter(item => 
        item && 
        item.codigo && 
        item.nombre && 
        item.precio !== undefined && 
        !item.email && 
        !item.run &&
        !item.apellidos // Asegurar que no sean usuarios
      );
      console.log('Productos filtrados:', filteredProducts.length);
      setProducts(filteredProducts);
    } catch (err) {
      console.error('Error cargando productos', err);
      setProducts(Array.isArray(productosDefault) ? productosDefault : []);
    }
  };

  const saveProducts = async (arr) => {
    setProducts(arr);
  };

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/v1/orders');
      setOrders(data);
    } catch (err) {
      console.error('Error cargando pedidos', err);
      setOrders([]);
    }
  };

  // Documentos/Archivos S3 handlers - Endpoint: /documentos (sin /v1/)
  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const { data } = await api.get('/documentos');
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando documentos', err);
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  const openUploadModal = (file = null) => {
    setSelectedFile(file);
    setTipoDocumento('OTRO');
    setDescripcionDoc('');
    setShowUploadModal(true);
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      toast.error('El archivo excede el tamaño máximo (10MB)');
      return;
    }
    
    openUploadModal(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Selecciona un archivo');
      return;
    }

    setUploadingFile(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tipoDocumento', tipoDocumento);
      if (descripcionDoc.trim()) {
        formData.append('descripcion', descripcionDoc.trim());
      }
      
      // Log para debug
      console.log('Subiendo archivo:', {
        nombre: selectedFile.name,
        tipo: tipoDocumento,
        descripcion: descripcionDoc,
        tamaño: selectedFile.size
      });
      
      // Endpoint: POST /documentos (sin /v1/)
      // NO especificar Content-Type manualmente, axios lo configura automáticamente con el boundary correcto
      const { data } = await api.post('/documentos', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      toast.success(`Archivo "${selectedFile.name}" subido exitosamente a S3`);
      setShowUploadModal(false);
      setSelectedFile(null);
      setTipoDocumento('OTRO');
      setDescripcionDoc('');
      loadDocuments(); // Recargar lista
    } catch (err) {
      console.error('Error subiendo archivo', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error desconocido';
      toast.error(`Error al subir archivo: ${errorMsg}`);
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (!confirm(`¿Eliminar el archivo "${doc.nombre || doc.nombreArchivo}"?`)) return;
    
    try {
      // Endpoint: DELETE /documentos/{id}
      await api.delete(`/documentos/${doc.id}`);
      toast.success('Archivo eliminado');
      loadDocuments();
    } catch (err) {
      console.error('Error eliminando archivo', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'No se pudo eliminar';
      toast.error(errorMsg);
    }
  };

  const handleDownloadDocument = (doc) => {
    // Usar urlArchivo del backend
    const url = doc.urlArchivo || doc.urlPublica || doc.url;
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('URL no disponible');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (fileName) => {
    const ext = (fileName || '').split('.').pop().toLowerCase();
    const icons = {
      pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊',
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
      zip: '📦', rar: '📦', txt: '📃', csv: '📋'
    };
    return icons[ext] || '📁';
  };

  // Users handlers
  const openNewUser = () => {
    setEditingUserIdx(null);
    setUserForm(emptyUser);
    setMsg("");
    setShowUserModal(true);
  };
  const openEditUser = (idx) => {
    setEditingUserIdx(idx);
    setUserForm(users[idx] || emptyUser);
    setMsg("");
    setShowUserModal(true);
  };
  const saveUser = () => {
    if (!userForm.run || !userForm.nombre || !userForm.apellidos || !userForm.email) {
      setMsg("RUN, Nombre, Apellidos y Correo son obligatorios.");
      return;
    }
    const copy = [...users];
    if (editingUserIdx === null) {
      copy.push({ ...userForm });
      toast.success('Usuario añadido (solo local, ajustar a backend si aplica)');
    } else {
      copy[editingUserIdx] = { ...userForm };
      toast.success('Usuario modificado (solo local, ajustar a backend si aplica)');
    }
    saveUsers(copy);
    setShowUserModal(false);
  };
  const deleteUser = (idx) => {
    if (!confirm("Eliminar usuario?")) return;
    const next = users.filter((_, i) => i !== idx);
    saveUsers(next);
  };

  // Products handlers
  const openNewProd = () => {
    setEditingProdIdx(null);
    setProdForm(emptyProd);
    setMsg("");
    setShowProdModal(true);
  };
  const openEditProd = (idx) => {
    setEditingProdIdx(idx);
    setProdForm(products[idx] || emptyProd);
    setMsg("");
    setShowProdModal(true);
  };
  const saveProd = () => {
    if (!prodForm.codigo || !prodForm.nombre) {
      setMsg("Código y Nombre son obligatorios.");
      return;
    }
    const copy = [...products];
    if (editingProdIdx === null) {
      copy.push({ ...prodForm });
      toast.success('Producto añadido (solo local, ajustar a backend)');
    } else {
      copy[editingProdIdx] = { ...prodForm };
      toast.success('Producto modificado (solo local, ajustar a backend)');
    }
    saveProducts(copy);
    setShowProdModal(false);
  };
  const deleteProd = (idx) => {
    if (!confirm("Eliminar producto?")) return;
    const next = products.filter((_, i) => i !== idx);
    saveProducts(next);
  };

  // Orders handlers
  const openEditOrder = (idx) => {
    setEditingOrderIdx(idx);
    const current = orders[idx];
    setOrderForm({ id: current?.id ?? '', status: current?.status ?? 'PENDIENTE' });
    setMsg("");
    setShowOrderModal(true);
  };

  const saveOrderStatus = async () => {
    if (!orderForm.id || !orderForm.status) {
      setMsg('ID y estado son obligatorios.');
      return;
    }
    try {
      // Intentar diferentes formatos que podría esperar el backend
      let success = false;
      
      // Intento 1: PUT con body JSON
      try {
        await api.put(`/v1/orders/${orderForm.id}/status`, { status: orderForm.status });
        success = true;
      } catch (e1) {
        console.log('PUT con body falló, intentando PATCH...', e1.response?.status);
        
        // Intento 2: PATCH con body JSON
        try {
          await api.patch(`/v1/orders/${orderForm.id}/status`, { status: orderForm.status });
          success = true;
        } catch (e2) {
          console.log('PATCH falló, intentando PUT con query param...', e2.response?.status);
          
          // Intento 3: PUT con query parameter
          try {
            await api.put(`/v1/orders/${orderForm.id}/status?status=${orderForm.status}`);
            success = true;
          } catch (e3) {
            console.log('PUT con query param falló, intentando PUT al pedido completo...', e3.response?.status);
            
            // Intento 4: PUT al pedido completo
            try {
              const currentOrder = orders.find(o => o.id === orderForm.id);
              await api.put(`/v1/orders/${orderForm.id}`, { ...currentOrder, status: orderForm.status });
              success = true;
            } catch (e4) {
              // Mostrar error detallado
              const errorMsg = e4.response?.data?.message || e4.response?.statusText || e4.message;
              const errorStatus = e4.response?.status;
              throw new Error(`Error ${errorStatus}: ${errorMsg}`);
            }
          }
        }
      }
      
      if (success) {
        setOrders(prev => prev.map(o => (o.id === orderForm.id ? { ...o, status: orderForm.status } : o)));
        toast.success('Estado de pedido actualizado');
        setShowOrderModal(false);
      }
    } catch (err) {
      console.error('Error actualizando estado de pedido', err);
      const errorDetail = err.response?.data?.message || err.message || 'Error desconocido';
      setMsg(`No se pudo actualizar el estado. ${errorDetail}`);
    }
  };

  const onUserChange = (k, v) => setUserForm(prev => ({ ...prev, [k]: v }));
  const onProdChange = (k, v) => setProdForm(prev => ({ ...prev, [k]: v }));
  const onOrderChange = (k, v) => setOrderForm(prev => ({ ...prev, [k]: v }));

  return (
    <main className="container-fluid" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <div className="row g-4">
        {/* Sidebar de Navegación - Vertical */}
        <div className="col-12 col-lg-3">
          {/* Header Section */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 16,
            padding: '24px 20px',
            marginBottom: 24,
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
          }}>
            <h2 style={{ 
              color: '#fff', 
              margin: 0, 
              fontSize: 24,
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              🎛️ Panel Admin
            </h2>
          </div>

          {/* Navigation Menu - Vertical */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Productos Section */}
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: view === "productos" ? '0 4px 16px rgba(13, 110, 253, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: view === "productos" ? '2px solid #0d6efd' : '2px solid transparent',
              transition: 'all 0.3s ease',
              transform: view === "productos" ? 'translateX(8px)' : 'translateX(0)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '2px solid #f0f0f0'
              }}>
                <span style={{ fontSize: 28 }}>📦</span>
                <h5 style={{ margin: 0, fontWeight: 700, color: '#2d3436', flex: 1 }}>Productos</h5>
                <span style={{
                  background: view === "productos" ? '#0d6efd' : '#e9ecef',
                  color: view === "productos" ? '#fff' : '#6c757d',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {products.length}
                </span>
              </div>
              <button 
                className={`btn w-100 mb-2 ${view === "productos" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setView("productos")}
                style={{ fontWeight: 600, fontSize: 15 }}
              >
                Ver Productos
              </button>
              <button 
                className="btn btn-success w-100" 
                onClick={openNewProd}
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                ＋ Nuevo Producto
              </button>
            </div>

            {/* Usuarios Section */}
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: view === "usuarios" ? '0 4px 16px rgba(108, 117, 125, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: view === "usuarios" ? '2px solid #6c757d' : '2px solid transparent',
              transition: 'all 0.3s ease',
              transform: view === "usuarios" ? 'translateX(8px)' : 'translateX(0)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '2px solid #f0f0f0'
              }}>
                <span style={{ fontSize: 28 }}>👥</span>
                <h5 style={{ margin: 0, fontWeight: 700, color: '#2d3436', flex: 1 }}>Usuarios</h5>
                <span style={{
                  background: view === "usuarios" ? '#6c757d' : '#e9ecef',
                  color: view === "usuarios" ? '#fff' : '#6c757d',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {users.length}
                </span>
              </div>
              <button 
                className={`btn w-100 mb-2 ${view === "usuarios" ? "btn-secondary" : "btn-outline-secondary"}`}
                onClick={() => setView("usuarios")}
                style={{ fontWeight: 600, fontSize: 15 }}
              >
                Ver Usuarios
              </button>
              <button 
                className="btn btn-info w-100" 
                onClick={openNewUser}
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                ＋ Nuevo Usuario
              </button>
            </div>

            {/* Pedidos Section */}
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: view === "pedidos" ? '0 4px 16px rgba(255, 193, 7, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: view === "pedidos" ? '2px solid #ffc107' : '2px solid transparent',
              transition: 'all 0.3s ease',
              transform: view === "pedidos" ? 'translateX(8px)' : 'translateX(0)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '2px solid #f0f0f0'
              }}>
                <span style={{ fontSize: 28 }}>📋</span>
                <h5 style={{ margin: 0, fontWeight: 700, color: '#2d3436', flex: 1 }}>Pedidos</h5>
                <span style={{
                  background: view === "pedidos" ? '#ffc107' : '#e9ecef',
                  color: view === "pedidos" ? '#000' : '#6c757d',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {orders.length}
                </span>
              </div>
              <button 
                className={`btn w-100 ${view === "pedidos" ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => setView("pedidos")}
                style={{ fontWeight: 600, fontSize: 15 }}
              >
                Ver Pedidos
              </button>
            </div>

            {/* Documentos Section */}
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: view === "documentos" ? '0 4px 16px rgba(33, 37, 41, 0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
              border: view === "documentos" ? '2px solid #212529' : '2px solid transparent',
              transition: 'all 0.3s ease',
              transform: view === "documentos" ? 'translateX(8px)' : 'translateX(0)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '2px solid #f0f0f0'
              }}>
                <span style={{ fontSize: 28 }}>📁</span>
                <h5 style={{ margin: 0, fontWeight: 700, color: '#2d3436', flex: 1 }}>Documentos</h5>
                <span style={{
                  background: view === "documentos" ? '#212529' : '#e9ecef',
                  color: view === "documentos" ? '#fff' : '#6c757d',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {documents.length}
                </span>
              </div>
              <button 
                className={`btn w-100 ${view === "documentos" ? "btn-dark" : "btn-outline-dark"}`}
                onClick={() => setView("documentos")}
                style={{ fontWeight: 600, fontSize: 15 }}
              >
                Gestionar S3
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-12 col-lg-9">
          <div id="adminContent">
        {view === "usuarios" ? (
          <section style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: 20, color: '#2d3436', fontWeight: 600 }}>
              👥 Usuarios ({users.length})
            </h3>
            {users.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
                <p className="text-muted">No hay usuarios registrados.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover" style={{ marginBottom: 0 }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>RUN</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nombre</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Apellidos</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Email</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Tipo</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.run || u.id || i}>
                        <td style={{ padding: '12px 16px' }}>{u.run}</td>
                        <td style={{ padding: '12px 16px' }}>{u.nombre}</td>
                        <td style={{ padding: '12px 16px' }}>{u.apellidos}</td>
                        <td style={{ padding: '12px 16px' }}>{u.email}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: u.tipo === 'Administrador' ? '#e8f5e9' : '#f0f0f0',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 500
                          }}>
                            {u.tipo}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditUser(i)}>✏️ Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(i)}>🗑️ Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : view === "productos" ? (
          <section style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: 20, color: '#2d3436', fontWeight: 600 }}>
              📦 Productos ({products.length})
            </h3>
            {products.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <p className="text-muted">No hay productos.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover" style={{ marginBottom: 0 }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Código</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Nombre</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Precio</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Stock</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Categoría</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr key={p.codigo || p.id || i}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{p.codigo}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.nombre}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#28a745' }}>
                          {Number(p.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: (p.stock ?? 0) < (p.stockCritico ?? 10) ? '#fee' : '#e8f5e9',
                            color: (p.stock ?? 0) < (p.stockCritico ?? 10) ? '#d32f2f' : '#388e3c',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 500
                          }}>
                            {p.stock ?? "—"}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>{p.categoria ?? p.categ ?? "—"}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditProd(i)}>✏️ Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProd(i)}>🗑️ Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : view === "pedidos" ? (
          <section style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ marginBottom: 20, color: '#2d3436', fontWeight: 600 }}>
              📋 Pedidos ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <p className="text-muted">No hay pedidos.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover" style={{ marginBottom: 0 }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>ID</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cliente</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Fecha</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Estado</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Total</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => {
                      const statusColors = {
                        PENDIENTE: { bg: '#fff3cd', color: '#856404' },
                        CONFIRMADO: { bg: '#d1ecf1', color: '#0c5460' },
                        ENVIADO: { bg: '#cce5ff', color: '#004085' },
                        ENTREGADO: { bg: '#d4edda', color: '#155724' },
                        CANCELADO: { bg: '#f8d7da', color: '#721c24' }
                      };
                      const statusStyle = statusColors[o.status] || statusColors.PENDIENTE;
                      
                      return (
                        <tr key={o.id || i}>
                          <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{o.id}</td>
                          <td style={{ padding: '12px 16px' }}>{o.cliente?.email || o.clienteEmail || 'N/D'}</td>
                          <td style={{ padding: '12px 16px' }}>{o.fechaCreacion || o.createdAt || o.fecha}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              padding: '4px 12px',
                              borderRadius: 12,
                              fontSize: 13,
                              fontWeight: 500
                            }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#28a745' }}>
                            {o.total != null ? Number(o.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }) : '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => openEditOrder(i)}>
                              🔄 Cambiar estado
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : view === "documentos" ? (
          <section>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 28,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginBottom: 24
            }}>
              <h3 style={{ marginBottom: 8, color: '#2d3436', fontWeight: 600 }}>
                📁 Documentos en S3
              </h3>
              <p className="text-muted" style={{ marginBottom: 24, fontSize: 15 }}>
                Sube y gestiona archivos almacenados en Amazon S3
              </p>
            
              {/* Zona de subida con Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `3px dashed ${dragOver ? '#28a745' : '#dee2e6'}`,
                  borderRadius: 16,
                  padding: 48,
                  textAlign: 'center',
                  marginBottom: 28,
                  background: dragOver ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.txt,.csv"
                />
              
                {uploadingFile ? (
                  <div>
                    <div className="spinner-border text-success mb-3" role="status" style={{ width: 48, height: 48 }}></div>
                    <h5 style={{ fontWeight: 600, marginBottom: 16 }}>Subiendo archivo...</h5>
                    <div className="progress" style={{ height: 12, maxWidth: 400, margin: '0 auto', borderRadius: 6 }}>
                      <div 
                        className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-muted mt-3" style={{ fontSize: 16, fontWeight: 500 }}>{uploadProgress}%</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>
                      {dragOver ? '📥' : '☁️'}
                    </div>
                    <h5 style={{ fontWeight: 600, marginBottom: 12 }}>
                      {dragOver ? '¡Suelta el archivo aquí!' : 'Arrastra y suelta archivos aquí'}
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: 15 }}>
                      o haz clic para seleccionar desde tu equipo
                    </p>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(102, 126, 234, 0.1)',
                      padding: '8px 16px',
                      borderRadius: 8,
                      marginTop: 8
                    }}>
                      <small className="text-muted" style={{ fontSize: 13, fontWeight: 500 }}>
                        📄 PDF, DOC, XLS, Imágenes, ZIP (máx. 10MB)
                      </small>
                    </div>
                  </>
                )}
              </div>

              {/* Lista de documentos */}
              <div style={{ 
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)', 
                borderRadius: 12, 
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  padding: '20px 24px', 
                  borderBottom: '2px solid #e9ecef', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: '#fff'
                }}>
                  <h5 style={{ margin: 0, fontWeight: 600, color: '#2d3436' }}>
                    📂 Archivos subidos 
                    <span style={{
                      background: '#667eea',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      marginLeft: 12,
                      fontWeight: 600
                    }}>
                      {documents.length}
                    </span>
                  </h5>
                  <button 
                    className="btn btn-sm btn-outline-success" 
                    onClick={loadDocuments} 
                    disabled={loadingDocs}
                    style={{ fontWeight: 500 }}
                  >
                    {loadingDocs ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Cargando...
                      </>
                    ) : (
                      <>🔄 Refrescar</>
                    )}
                  </button>
                </div>
              
                {loadingDocs ? (
                  <div style={{ padding: 60, textAlign: 'center', background: '#fff' }}>
                    <div className="spinner-border text-success mb-3" role="status" style={{ width: 48, height: 48 }}></div>
                    <p className="mt-3 text-muted" style={{ fontSize: 15 }}>Cargando documentos...</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div style={{ padding: 60, textAlign: 'center', background: '#fff' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📂</div>
                    <p className="text-muted" style={{ fontSize: 16 }}>No hay documentos subidos aún</p>
                    <small className="text-muted">Arrastra un archivo o haz clic arriba para comenzar</small>
                  </div>
                ) : (
                  <div style={{ maxHeight: 480, overflowY: 'auto', background: '#fff' }}>
                    {documents.map((doc, idx) => {
                      const nombre = doc.nombreArchivo || doc.nombre || 'Archivo';
                      const tipo = tiposDocumento.find(t => t.value === doc.tipoDocumento);
                      return (
                        <div 
                          key={doc.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px 24px',
                            borderBottom: idx < documents.length - 1 ? '1px solid #f0f0f0' : 'none',
                            transition: 'background 0.2s',
                            gap: 16
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                        >
                          <span style={{ fontSize: 36, flexShrink: 0 }}>
                            {getFileIcon(nombre)}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                              fontWeight: 600, 
                              color: '#2d3436', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              fontSize: 15,
                              marginBottom: 6
                            }}>
                              {nombre}
                            </div>
                            <div style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {tipo && (
                                <span style={{ 
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: '#fff',
                                  padding: '3px 10px', 
                                  borderRadius: 8,
                                  fontSize: 11,
                                  fontWeight: 600
                                }}>
                                  {tipo.label}
                                </span>
                              )}
                              {doc.descripcion && (
                                <span title={doc.descripcion} style={{ fontStyle: 'italic' }}>
                                  {doc.descripcion.slice(0, 40)}{doc.descripcion.length > 40 ? '...' : ''}
                                </span>
                              )}
                              {doc.fechaSubida && (
                                <span style={{ 
                                  background: '#e9ecef',
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: 11
                                }}>
                                  📅 {new Date(doc.fechaSubida).toLocaleDateString('es-CL')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                            {(doc.urlArchivo || doc.urlPublica) && (
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleDownloadDocument(doc)}
                                title="Ver/Descargar"
                                style={{ fontWeight: 500 }}
                              >
                                ⬇️ Descargar
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteDocument(doc)}
                              title="Eliminar"
                              style={{ fontWeight: 500 }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section>
            <h3>Pedidos ({orders.length})</h3>
            <p>Selecciona una vista del menú superior.</p>
          </section>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowUserModal(false); }}
        >
          <div
            style={{
              maxWidth: 600,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label={editingUserIdx === null ? "Nuevo Usuario" : "Editar Usuario"}
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{editingUserIdx === null ? "Nuevo Usuario" : "Editar Usuario"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowUserModal(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveUser(); }}
              style={{ padding: '20px', overflowY: 'auto', flex: 1 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>RUN *</label>
                    <input className="form-control" value={userForm.run} onChange={e => onUserChange('run', e.target.value)} placeholder="12.345.678-9" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Nombre *</label>
                    <input className="form-control" value={userForm.nombre} onChange={e => onUserChange('nombre', e.target.value)} placeholder="Juan" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Apellidos *</label>
                    <input className="form-control" value={userForm.apellidos} onChange={e => onUserChange('apellidos', e.target.value)} placeholder="Pérez González" />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Correo *</label>
                    <input className="form-control" type="email" value={userForm.email} onChange={e => onUserChange('email', e.target.value)} placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Tipo de Usuario</label>
                    <select className="form-select" value={userForm.tipo} onChange={e => onUserChange('tipo', e.target.value)}>
                      <option>Cliente</option>
                      <option>Administrador</option>
                      <option>Vendedor</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Región</label>
                    <input className="form-control" value={userForm.region} onChange={e => onUserChange('region', e.target.value)} placeholder="Metropolitana" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Comuna</label>
                    <input className="form-control" value={userForm.comuna} onChange={e => onUserChange('comuna', e.target.value)} placeholder="Santiago" />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Dirección</label>
                  <input className="form-control" value={userForm.direccion} onChange={e => onUserChange('direccion', e.target.value)} placeholder="Av. Principal 123" />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Fecha Nacimiento</label>
                    <input className="form-control" type="date" value={userForm.fechaNac} onChange={e => onUserChange('fechaNac', e.target.value)} />
                  </div>
                </div>

                {msg && <div className="alert alert-danger" style={{ margin: 0, padding: '10px 14px' }}>{msg}</div>}
              </div>
            </form>

            <div style={{ 
              padding: '14px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 10,
              background: '#f8f9fa'
            }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowUserModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-success" onClick={saveUser}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProdModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowProdModal(false); }}
        >
          <div
            style={{
              maxWidth: 600,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label={editingProdIdx === null ? "Nuevo Producto" : "Editar Producto"}
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{editingProdIdx === null ? "Nuevo Producto" : "Editar Producto"}</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowProdModal(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveProd(); }}
              style={{ padding: '20px', overflowY: 'auto', flex: 1 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Código *</label>
                    <input className="form-control" value={prodForm.codigo} onChange={e => onProdChange('codigo', e.target.value)} placeholder="PRD-001" />
                  </div>
                  <div className="col-12 col-sm-8">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Nombre *</label>
                    <input className="form-control" value={prodForm.nombre} onChange={e => onProdChange('nombre', e.target.value)} placeholder="Nombre del producto" />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Descripción</label>
                  <textarea className="form-control" rows={3} value={prodForm.desc} onChange={e => onProdChange('desc', e.target.value)} placeholder="Descripción del producto..." />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Precio *</label>
                    <input className="form-control" type="number" value={prodForm.precio} onChange={e => onProdChange('precio', e.target.value)} placeholder="1990" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Stock *</label>
                    <input className="form-control" type="number" value={prodForm.stock} onChange={e => onProdChange('stock', e.target.value)} placeholder="100" />
                  </div>
                  <div className="col-12 col-sm-4">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Stock Crítico</label>
                    <input className="form-control" type="number" value={prodForm.stockCritico} onChange={e => onProdChange('stockCritico', e.target.value)} placeholder="10" />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Categoría</label>
                    <input className="form-control" value={prodForm.categoria} onChange={e => onProdChange('categoria', e.target.value)} placeholder="Verduras" />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Imagen (URL)</label>
                    <input className="form-control" value={prodForm.img} onChange={e => onProdChange('img', e.target.value)} placeholder="https://..." />
                  </div>
                </div>

                {msg && <div className="alert alert-danger" style={{ margin: 0, padding: '10px 14px' }}>{msg}</div>}
              </div>
            </form>

            <div style={{ 
              padding: '14px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 10,
              background: '#f8f9fa'
            }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowProdModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-success" onClick={saveProd}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowOrderModal(false); }}
        >
          <div
            style={{
              maxWidth: 400,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Cambiar estado de pedido"
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#f8f9fa'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Cambiar estado de pedido</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowOrderModal(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveOrderStatus(); }}
              style={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>ID Pedido</label>
                  <input className="form-control" value={orderForm.id} readOnly style={{ background: '#f5f5f5' }} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Estado</label>
                  <select className="form-select" value={orderForm.status} onChange={e => onOrderChange('status', e.target.value)}>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="ENVIADO">ENVIADO</option>
                    <option value="ENTREGADO">ENTREGADO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>
                {msg && <div className="alert alert-danger" style={{ margin: 0, padding: '10px 14px' }}>{msg}</div>}
              </div>
            </form>

            <div style={{ 
              padding: '14px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 10,
              background: '#f8f9fa'
            }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowOrderModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-success" onClick={saveOrderStatus}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div
          className="modal-backdrop"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowUploadModal(false); }}
        >
          <div
            style={{
              maxWidth: 500,
              width: '100%',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Subir documento"
          >
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff'
            }}>
              <h5 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>📤 Subir Documento</h5>
              <button 
                className="btn btn-sm" 
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleFileUpload(); }}
              style={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* File Preview */}
                {selectedFile && (
                  <div style={{
                    background: '#f8f9fa',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <span style={{ fontSize: 32 }}>
                      {getFileIcon(selectedFile.name)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: '#2d3436',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {selectedFile.name}
                      </div>
                      <div style={{ fontSize: 13, color: '#888' }}>
                        {formatFileSize(selectedFile.size)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tipo de Documento */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#2d3436' }}>
                    Tipo de Documento *
                  </label>
                  <select 
                    className="form-select" 
                    value={tipoDocumento} 
                    onChange={e => setTipoDocumento(e.target.value)}
                    style={{ fontSize: 15 }}
                  >
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: 'block', color: '#2d3436' }}>
                    Descripción (opcional)
                  </label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={descripcionDoc}
                    onChange={e => setDescripcionDoc(e.target.value)}
                    placeholder="Descripción breve del documento..."
                    maxLength={200}
                    style={{ fontSize: 14, resize: 'none' }}
                  />
                  <small className="text-muted" style={{ fontSize: 12 }}>
                    {descripcionDoc.length}/200 caracteres
                  </small>
                </div>

                {/* Progress bar when uploading */}
                {uploadingFile && (
                  <div>
                    <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                      <div 
                        className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-muted mt-2" style={{ fontSize: 13, margin: '8px 0 0' }}>
                      Subiendo... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </form>

            <div style={{ 
              padding: '16px 20px', 
              borderTop: '1px solid #e0e0e0', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12,
              background: '#f8f9fa'
            }}>
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => setShowUploadModal(false)}
                disabled={uploadingFile}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={handleFileUpload}
                disabled={uploadingFile || !selectedFile}
              >
                {uploadingFile ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Subiendo...
                  </>
                ) : (
                  <>📤 Subir</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
    </main>
  );
}
