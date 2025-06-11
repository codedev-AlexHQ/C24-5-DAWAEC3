'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

interface Medicamento {
  CodMedicamento: number;
  descripcionMed: string;
  stock: number;
  precioVentaUni: number;
}

interface TipoMedic {
  CodTipoMed: number;
  descripcion: string;
  medicamentos?: Medicamento[]; // <- Puede ser undefined
}

export default function TiposPage() {
  const [tipoMedics, setTipoMedics] = useState<TipoMedic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ descripcion: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchTipoMedics();
  }, []);

  const fetchTipoMedics = async () => {
    try {
      const response = await fetch('/api/tipomedic');
      const data = await response.json();
      setTipoMedics(data);
    } catch (error) {
      console.error('Error fetching tipo medics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch(`/api/tipomedic/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion: form.descripcion }),
        });
      } else {
        await fetch('/api/tipomedic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion: form.descripcion }),
        });
      }
      fetchTipoMedics();
      setForm({ descripcion: '' });
      setEditId(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating/updating tipo:', error);
    }
  };

  const handleEdit = (tipo: TipoMedic) => {
    setForm({ descripcion: tipo.descripcion });
    setEditId(tipo.CodTipoMed);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este tipo de medicamento?')) return;
    await fetch(`/api/tipomedic/${id}`, { method: 'DELETE' });
    fetchTipoMedics();
  };

  const filteredTipos = tipoMedics.filter(tipo =>
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Navbar />
      <div className="header-bar">
        <span className="header-title">Sistema Farmacéutico</span>
        <div className="header-nav">
          <a href="/">Medicamentos</a>
          <a href="/tipos" className="active">Tipos de Medicamento</a>
          <a href="/especialidades">Especialidades</a>
        </div>
      </div>
      <div className="page-content">
        <div className="table-title-row">
          <span className="table-title">Tipos de Medicamento</span>
          <button className="btn-primary" onClick={() => { setShowModal(true); setForm({ descripcion: '' }); setEditId(null); }}>
            Nuevo Tipo
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="table-list">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Medicamentos Asociados</th>
              <th>Stock Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTipos.map((tipo) => (
              <tr key={tipo.CodTipoMed}>
                <td>#{tipo.CodTipoMed}</td>
                <td>{tipo.descripcion}</td>
                <td>
                  {(tipo.medicamentos && tipo.medicamentos.length > 0) ? (
                    <>
                      {tipo.medicamentos.slice(0, 3).map(med => (
                        <div key={med.CodMedicamento} style={{ fontSize: 13, color:'#2776e6' }}>
                          • {med.descripcionMed}
                        </div>
                      ))}
                      {tipo.medicamentos.length > 3 && (
                        <div style={{ color:'#555', fontSize: 12 }}>
                          +{tipo.medicamentos.length - 3} más...
                        </div>
                      )}
                    </>
                  ) : (
                    <span style={{ color: '#888', fontSize: 13 }}>Sin medicamentos asociados</span>
                  )}
                </td>
                <td>
                  {(tipo.medicamentos && tipo.medicamentos.length > 0)
                    ? tipo.medicamentos.reduce((total, med) => total + med.stock, 0)
                    : 0} unidades
                </td>
                <td className="action-cell">
                  <button
                    className="action-btn edit"
                    title="Editar"
                    onClick={() => handleEdit(tipo)}
                  >✏️</button>
                  <button
                    className="action-btn delete"
                    title="Eliminar"
                    onClick={() => handleDelete(tipo.CodTipoMed)}
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">{editId ? "Editar" : "Nuevo"} Tipo de Medicamento</span>
              <button className="modal-close" onClick={() => { setShowModal(false); setEditId(null); }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Descripción</label>
              <input
                type="text"
                value={form.descripcion}
                onChange={(e) => setForm({ descripcion: e.target.value })}
                required
              />
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); setEditId(null); }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}