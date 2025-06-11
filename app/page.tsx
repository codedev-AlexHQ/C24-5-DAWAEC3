'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';

interface Stats {
  medicamentos: number;
  especialidades: number;
  tipos: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ medicamentos: 0, especialidades: 0, tipos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [medicamentosRes, especialidadesRes, tiposRes] = await Promise.all([
          fetch('/api/medicamento'),
          fetch('/api/especialidad'),
          fetch('/api/tipomedic')
        ]);

        const [medicamentos, especialidades, tipos] = await Promise.all([
          medicamentosRes.json(),
          especialidadesRes.json(),
          tiposRes.json()
        ]);

        setStats({
          medicamentos: medicamentos.length || 0,
          especialidades: especialidades.length || 0,
          tipos: tipos.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Sistema de Gestión 
                <span className="hero-highlight"> Farmacéutica</span>
              </h1>
              <p className="hero-description">
                Administra medicamentos, especialidades médicas y tipos de medicamento 
                de manera eficiente y moderna.
              </p>
              <div className="hero-stats">
                {loading ? (
                  <div className="loading-stats">Cargando estadísticas...</div>
                ) : (
                  <>
                    <div className="stat-item">
                      <span className="stat-number">{stats.medicamentos}</span>
                      <span className="stat-label">Medicamentos</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.especialidades}</span>
                      <span className="stat-label">Especialidades</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.tipos}</span>
                      <span className="stat-label">Tipos</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-graphic">
                <div className="graphic-circle circle-1"></div>
                <div className="graphic-circle circle-2"></div>
                <div className="graphic-circle circle-3"></div>
                <div className="hero-icon">⚕️</div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="section-title">Acceso Rápido</h2>
          <div className="actions-grid">
            <Link href="/medicamentos" className="action-card action-primary">
              <div className="action-icon">💊</div>
              <h3 className="action-title">Medicamentos</h3>
              <p className="action-description">
                Gestiona el inventario completo de medicamentos
              </p>
              <div className="action-arrow">→</div>
            </Link>

            <Link href="/especialidades" className="action-card action-secondary">
              <div className="action-icon">🏥</div>
              <h3 className="action-title">Especialidades</h3>
              <p className="action-description">
                Administra especialidades médicas
              </p>
              <div className="action-arrow">→</div>
            </Link>

            <Link href="/tipos" className="action-card action-tertiary">
              <div className="action-icon">📋</div>
              <h3 className="action-title">Tipos de Medicamento</h3>
              <p className="action-description">
                Categoriza medicamentos por tipo
              </p>
              <div className="action-arrow">→</div>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Características del Sistema</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Búsqueda Avanzada</h3>
              <p className="feature-description">
                Encuentra medicamentos y datos rápidamente con filtros inteligentes
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Reportes Detallados</h3>
              <p className="feature-description">
                Genera reportes completos sobre inventario y movimientos
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Datos Seguros</h3>
              <p className="feature-description">
                Toda la información está protegida con las mejores prácticas de seguridad
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Interfaz Rápida</h3>
              <p className="feature-description">
                Diseño optimizado para una experiencia de usuario fluida y eficiente
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}