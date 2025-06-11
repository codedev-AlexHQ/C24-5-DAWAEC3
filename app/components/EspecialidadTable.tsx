"use client";
import React, { useState, useEffect } from "react";

type Medicamento = {
  CodMedicamento: number;
  descripcionMed: string;
  stock: number;
  precioVentaUni: number;
};

type Especialidad = {
  CodEspec: number;
  descripcionEsp: string;
  medicamentos?: Medicamento[];
};

const initialForm = {
  descripcionEsp: "",
};

export default function EspecialidadTable() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const fetchEspecialidades = async () => {
    const res = await fetch("/api/especialidad");
    const data = await res.json();
    setEspecialidades(data);
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
    setEditId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (esp: Especialidad) => {
    setForm({
      descripcionEsp: esp.descripcionEsp,
    });
    setEditId(esp.CodEspec);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditId(null);
    setForm(initialForm);
    setIsEdit(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && editId) {
      // Editar especialidad
      await fetch(`/api/especialidad/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcionEsp: form.descripcionEsp,
        }),
      });
    } else {
      // Crear nueva especialidad
      await fetch("/api/especialidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcionEsp: form.descripcionEsp,
        }),
      });
    }
    fetchEspecialidades();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar esta especialidad?")) {
      await fetch(`/api/especialidad/${id}`, { method: "DELETE" });
      fetchEspecialidades();
    }
  };

  // Calcular estadísticas para cada especialidad
  const getEspecialidadStats = (medicamentos?: Medicamento[]) => {
    if (!medicamentos || medicamentos.length === 0) {
      return { totalMedicamentos: 0, stockTotal: 0 };
    }
    
    const totalMedicamentos = medicamentos.length;
    const stockTotal = medicamentos.reduce((sum, med) => sum + med.stock, 0);
    
    return { totalMedicamentos, stockTotal };
  };

  return (
    <div className="page-content">
      <div className="table-title-row">
        <span className="table-title">Especialidades</span>
        <button className="btn-primary" onClick={handleOpenCreate}>
          Nueva Especialidad
        </button>
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
          {especialidades.map((esp) => {
            const stats = getEspecialidadStats(esp.medicamentos);
            return (
              <tr key={esp.CodEspec}>
                <td>{esp.CodEspec}</td>
                <td>{esp.descripcionEsp}</td>
                <td>
                  {stats.totalMedicamentos > 0 ? (
                    <div>
                      <strong>{stats.totalMedicamentos}</strong> medicamento(s)
                      <div className="medicamentos-list">
                        {esp.medicamentos?.slice(0, 3).map((med) => (
                          <span key={med.CodMedicamento} className="medicamento-item">
                            {med.descripcionMed}
                          </span>
                        ))}
                        {esp.medicamentos && esp.medicamentos.length > 3 && (
                          <span className="more-items">
                            +{esp.medicamentos.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="no-data">Sin medicamentos</span>
                  )}
                </td>
                <td>
                  {stats.stockTotal > 0 ? (
                    <span className="stock-total">{stats.stockTotal} unidades</span>
                  ) : (
                    <span className="no-data">0 unidades</span>
                  )}
                </td>
                <td className="action-cell">
                  <button
                    className="action-btn edit"
                    title="Editar"
                    onClick={() => handleOpenEdit(esp)}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete"
                    title="Eliminar"
                    onClick={() => handleDelete(esp.CodEspec)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">
                {isEdit ? "Editar Especialidad" : "Nueva Especialidad"}
              </span>
              <button className="modal-close" onClick={handleClose}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Descripción de la Especialidad</label>
              <input
                type="text"
                name="descripcionEsp"
                value={form.descripcionEsp}
                onChange={handleChange}
                required
                placeholder="Ej: Cardiología, Neurología, etc."
              />
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleClose}
                >
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
    </div>
  );
}
