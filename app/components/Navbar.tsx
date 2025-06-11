'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <span className="text-xl">⚕️</span>
            </div>
            <Link href="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
              Sistema Farmacéutico
            </Link>
          </div>          {/* Navegación */}
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/'
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              🏠 Inicio
            </Link>
            <Link
              href="/medicamentos"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/medicamentos'
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              💊 Medicamentos
            </Link><Link
              href="/tipos"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/tipos'
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              📋 Tipos de Medicamento
            </Link>
            <Link
              href="/especialidades"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/especialidades'
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              🩺 Especialidades
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}