'use client';

import { useState, useEffect } from 'react';
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
      <>
        <Navbar />
        <div className="page-content">
          <p>Cargando especialidades...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-content">
        <div className="table-title-row">
          <span className="table-title">Especialidades Médicas</span>
          <button className="btn-primary" onClick={handleCreate}>
            Nueva Especialidad
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar especialidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table-list">
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
                  <td>#{especialidad.CodEspec}</td>
                  <td>{especialidad.descripcionEsp}</td>
                  <td>
                    {stats.totalMedicamentos > 0 ? (
                      <>
                        {especialidad.medicamentos?.slice(0, 3).map(med => (
                          <div key={med.CodMedicamento} style={{ fontSize: 13, color:'#2776e6' }}>
                            • {med.descripcionMed}
                          </div>
                        ))}
                        {especialidad.medicamentos && especialidad.medicamentos.length > 3 && (
                          <div style={{ color:'#555', fontSize: 12 }}>
                            +{especialidad.medicamentos.length - 3} más...
                          </div>
                        )}
                      </>
                    ) : (
                      <span style={{ color: '#888', fontSize: 13 }}>Sin medicamentos asociados</span>
                    )}
                  </td>
                  <td>
                    {stats.stockTotal > 0 ? (
                      <span>{stats.stockTotal} unidades</span>
                    ) : (
                      <span style={{ color: '#888' }}>0 unidades</span>
                    )}
                  </td>
                  <td className="action-cell">
                    <button
                      className="action-btn edit"
                      title="Editar"
                      onClick={() => handleEdit(especialidad)}
                    >✏️</button>
                    <button
                      className="action-btn delete"
                      title="Eliminar"
                      onClick={() => handleDelete(especialidad.CodEspec)}
                    >🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredEspecialidades.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
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

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-title">
                  {editId ? 'Editar Especialidad' : 'Nueva Especialidad'}
                </span>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <label>Descripción de la Especialidad</label>
                <input
                  type="text"
                  value={form.descripcionEsp}
                  onChange={(e) => setForm({ ...form, descripcionEsp: e.target.value })}
                  placeholder="Ej: Cardiología, Neurología, Dermatología..."
                  required
                />
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {editId ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
