'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Medicamento {
  CodMedicamento: number;
  descripcionMed: string;
  stock: number;
  precioVentaUni: number;
}

interface Especialidad {
  CodEspec: number;
  descripcionEsp: string;
  medicamentos?: Medicamento[];
}

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ descripcionEsp: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const fetchEspecialidades = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/especialidad');
      if (response.ok) {
        const data = await response.json();
        // Obtener medicamentos para cada especialidad
        const especialidadesConMedicamentos = await Promise.all(
          data.map(async (esp: Especialidad) => {
            try {
              const medicamentosResponse = await fetch(`/api/medicamento?especialidad=${esp.CodEspec}`);
              if (medicamentosResponse.ok) {
                const medicamentos = await medicamentosResponse.json();
                return { ...esp, medicamentos: medicamentos.filter((m: any) => m.CodEspec === esp.CodEspec) };
              }
            } catch (error) {
              console.error('Error fetching medicamentos:', error);
            }
            return esp;
          })
        );
        setEspecialidades(especialidadesConMedicamentos);
      }
    } catch (error) {
      console.error('Error fetching especialidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setForm({ descripcionEsp: '' });
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (especialidad: Especialidad) => {
    setForm({ descripcionEsp: especialidad.descripcionEsp });
    setEditId(especialidad.CodEspec);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editId ? `/api/especialidad/${editId}` : '/api/especialidad';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowModal(false);
        setForm({ descripcionEsp: '' });
        setEditId(null);
        fetchEspecialidades();
      }
    } catch (error) {
      console.error('Error saving especialidad:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
      try {
        const response = await fetch(`/api/especialidad/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchEspecialidades();
        }
      } catch (error) {
        console.error('Error deleting especialidad:', error);
      }
    }
  };

  const filteredEspecialidades = especialidades.filter(esp =>
    esp.descripcionEsp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEspecialidadStats = (medicamentos?: Medicamento[]) => {
    if (!medicamentos || medicamentos.length === 0) {
      return { totalMedicamentos: 0, stockTotal: 0 };
    }
    
    const totalMedicamentos = medicamentos.length;
    const stockTotal = medicamentos.reduce((sum, med) => sum + med.stock, 0);
    
    return { totalMedicamentos, stockTotal };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando especialidades...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header con navegación */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Sistema Farmacéutico</h1>
            <p className="page-subtitle">Gestión de Especialidades Médicas</p>
          </div>
          <nav className="header-nav">
            <Link href="/" className="nav-link">
              📋 Medicamentos
            </Link>
            <Link href="/tipos" className="nav-link">
              🏷️ Tipos de Medicamento
            </Link>
            <Link href="/especialidades" className="nav-link active">
              🩺 Especialidades
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Estadísticas generales */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🩺</div>
            <div className="stat-content">
              <div className="stat-number">{especialidades.length}</div>
              <div className="stat-label">Especialidades</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💊</div>
            <div className="stat-content">
              <div className="stat-number">
                {especialidades.reduce((total, esp) => total + (esp.medicamentos?.length || 0), 0)}
              </div>
              <div className="stat-label">Medicamentos Totales</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">
                {especialidades.reduce((total, esp) => {
                  const stock = esp.medicamentos?.reduce((sum, med) => sum + med.stock, 0) || 0;
                  return total + stock;
                }, 0)}
              </div>
              <div className="stat-label">Stock Total</div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar especialidades..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleCreate}>
            + Nueva Especialidad
          </button>
        </div>

        {/* Tabla de especialidades */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Especialidad</th>
                <th>Medicamentos Asociados</th>
                <th>Stock Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEspecialidades.map((especialidad) => {
                const stats = getEspecialidadStats(especialidad.medicamentos);
                return (
                  <tr key={especialidad.CodEspec}>
                    <td>
                      <span className="code-badge">{especialidad.CodEspec}</span>
                    </td>
                    <td>
                      <div className="especialidad-info">
                        <div className="especialidad-name">{especialidad.descripcionEsp}</div>
                      </div>
                    </td>
                    <td>
                      {stats.totalMedicamentos > 0 ? (
                        <div className="medicamentos-summary">
                          <span className="count-badge">{stats.totalMedicamentos}</span>
                          <div className="medicamentos-list">
                            {especialidad.medicamentos?.slice(0, 3).map((med) => (
                              <span key={med.CodMedicamento} className="medicamento-tag">
                                {med.descripcionMed}
                              </span>
                            ))}
                            {especialidad.medicamentos && especialidad.medicamentos.length > 3 && (
                              <span className="more-tag">+{especialidad.medicamentos.length - 3} más</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="empty-state">Sin medicamentos</span>
                      )}
                    </td>
                    <td>
                      <span className={`stock-badge ${stats.stockTotal > 0 ? 'has-stock' : 'no-stock'}`}>
                        {stats.stockTotal} unidades
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(especialidad)}
                          title="Editar especialidad"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(especialidad.CodEspec)}
                          title="Eliminar especialidad"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEspecialidades.length === 0 && (
            <div className="empty-state-container">
              <div className="empty-state-icon">🩺</div>
              <h3>No se encontraron especialidades</h3>
              <p>
                {searchTerm 
                  ? `No hay especialidades que coincidan con "${searchTerm}"`
                  : 'Aún no hay especialidades registradas'
                }
              </p>
              {!searchTerm && (
                <button className="btn-primary" onClick={handleCreate}>
                  Crear primera especialidad
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Editar Especialidad' : 'Nueva Especialidad'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="descripcionEsp">Descripción de la Especialidad</label>
                <input
                  type="text"
                  id="descripcionEsp"
                  value={form.descripcionEsp}
                  onChange={(e) => setForm({ ...form, descripcionEsp: e.target.value })}
                  placeholder="Ej: Cardiología, Neurología, Dermatología..."
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
