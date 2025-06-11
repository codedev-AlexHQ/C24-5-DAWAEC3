"use client";
import React, { useState, useEffect } from "react";

type Medicamento = {
  CodMedicamento: number;
  descripcionMed: string;
  fechaFabricacion: string;
  fechaVencimiento: string;
  presentacion: string;
  stock: number;
  precioVentaUni: number;
  precioVentaPres: number;
  marca: string;
  CodTipoMed: number;
  CodEspec: number;
  tipoMedic?: { descripcion: string };
  especialidad?: { descripcionEsp: string };
};

type TipoMedic = {
  CodTipoMed: number;
  descripcion: string;
};

type Especialidad = {
  CodEspec: number;
  descripcionEsp: string;
};

const initialForm = {
  descripcionMed: "",
  presentacion: "",
  stock: "",
  precioVentaUni: "",
  marca: "",
  CodTipoMed: "",
  CodEspec: "",
};

export default function MedicamentosTable() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [tipoMedics, setTipoMedics] = useState<TipoMedic[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  useEffect(() => {
    fetchMedicamentos();
    fetchTipoMedics();
    fetchEspecialidades();
  }, []);

  const fetchMedicamentos = async () => {
    const res = await fetch("/api/medicamento");
    const data = await res.json();
    setMedicamentos(data);
  };

  const fetchTipoMedics = async () => {
    const res = await fetch("/api/tipomedic");
    const data = await res.json();
    setTipoMedics(data);
  };

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
  const handleOpenEdit = (med: Medicamento) => {
    setForm({
      descripcionMed: med.descripcionMed,
      presentacion: med.presentacion,
      stock: String(med.stock),
      precioVentaUni: String(med.precioVentaUni),
      marca: med.marca,
      CodTipoMed: String(med.CodTipoMed),
      CodEspec: String(med.CodEspec),
    });
    setEditId(med.CodMedicamento);
    setIsEdit(true);
    setModalOpen(true);
  };

  // Si tu API no manda CodTipoMed, buscarlo por descripcion
  const buscarCodTipoMed = (descripcion: string) => {
    const found = tipoMedics.find((t) => t.descripcion === descripcion);
    return found ? String(found.CodTipoMed) : "";
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
    if (isEdit && editId) {      // Editar medicamento
      await fetch(`/api/medicamento/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcionMed: form.descripcionMed,
          presentacion: form.presentacion,
          stock: Number(form.stock),
          precioVentaUni: Number(form.precioVentaUni),
          marca: form.marca,
          CodTipoMed: Number(form.CodTipoMed),
          CodEspec: Number(form.CodEspec),
        }),
      });
    } else {      // Crear nuevo medicamento
      await fetch("/api/medicamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcionMed: form.descripcionMed,
          presentacion: form.presentacion,
          stock: Number(form.stock),
          precioVentaUni: Number(form.precioVentaUni),
          marca: form.marca,
          CodTipoMed: Number(form.CodTipoMed),
          fechaFabricacion: new Date().toISOString(),
          fechaVencimiento: new Date(Date.now() + 31536000000).toISOString(), // +1 año
          precioVentaPres: Number(form.precioVentaUni) * 10,
          CodEspec: Number(form.CodEspec),
        }),
      });
    }
    fetchMedicamentos();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que quieres eliminar este medicamento?")) {
      await fetch(`/api/medicamento/${id}`, { method: "DELETE" });
      fetchMedicamentos();
    }
  };

  return (
    <div className="page-content">
      <div className="table-title-row">
        <span className="table-title">Medicamentos</span>
        <button className="btn-primary" onClick={handleOpenCreate}>
          Nuevo Medicamento
        </button>
      </div>
      <table className="table-list">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Presentación</th>
            <th>Stock</th>
            <th>Precio Unitario</th>
            <th>Marca</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map((med) => (
            <tr key={med.CodMedicamento}>
              <td>{med.descripcionMed}</td>
              <td>{med.presentacion}</td>
              <td>{med.stock}</td>
              <td>S/ {Number(med.precioVentaUni).toFixed(2)}</td>
              <td>{med.marca}</td>
              <td>{med.tipoMedic?.descripcion}</td>
              <td className="action-cell">
                <button
                  className="action-btn edit"
                  title="Editar"
                  onClick={() => handleOpenEdit(med)}
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete"
                  title="Eliminar"
                  onClick={() => handleDelete(med.CodMedicamento)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">
                {isEdit ? "Editar Medicamento" : "Nuevo Medicamento"}
              </span>
              <button className="modal-close" onClick={handleClose}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Descripción</label>
              <input
                type="text"
                name="descripcionMed"
                value={form.descripcionMed}
                onChange={handleChange}
                required
              />
              <label>Presentación</label>
              <input
                type="text"
                name="presentacion"
                value={form.presentacion}
                onChange={handleChange}
                required
              />
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min={0}
              />
              <label>Precio Unitario</label>
              <input
                type="number"
                name="precioVentaUni"
                step="0.01"
                value={form.precioVentaUni}
                onChange={handleChange}
                required
                min={0}
              />
              <label>Marca</label>
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                required
              />              <label>Tipo de Medicamento</label>
              <select
                name="CodTipoMed"
                value={form.CodTipoMed}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar tipo...</option>
                {tipoMedics.map((tipo) => (
                  <option key={tipo.CodTipoMed} value={tipo.CodTipoMed}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
              <label>Especialidad</label>
              <select
                name="CodEspec"
                value={form.CodEspec}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar especialidad...</option>
                {especialidades.map((esp) => (
                  <option key={esp.CodEspec} value={esp.CodEspec}>
                    {esp.descripcionEsp}
                  </option>
                ))}
              </select>
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