'use client';

import MedicamentosTable from './components/MedicamentosTable';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="header-bar">
        <span className="header-title">Sistema Farmacéutico</span>
        <div className="header-nav">
          <a href="/" className="active">Medicamentos</a>
          <a href="/tipos">Tipos de Medicamento</a>
          <a href="/especialidades">Especialidades</a>
        </div>
      </div>
      <MedicamentosTable />
    </>
  );
}