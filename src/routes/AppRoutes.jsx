import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';

// Layout
import DashboardLayout from '../layouts/DashboardLayout';

// Pages – Auth / Dashboard
import LoginPage from '../pages/Login/LoginPage';
import DashboardHome from '../pages/Dashboard/DashboardHome';

// Pages – Ordens
import OrdensList from '../pages/Ordens/OrdensList';
import CriarOrdem from '../pages/Ordens/CriarOrdem';
import OrdemDetalhe from '../pages/Ordens/OrdemDetalhe';

// Pages – Produtos
import ProdutosPage from '../pages/Produtos/ProdutosPage';
import CriarProduto from '../pages/Produtos/CriarProduto';
import ProdutoDetalhe from '../pages/Produtos/ProdutoDetalhe';

// Pages – Clientes
import ClientesPage from '../pages/Clientes/ClientesPage';
import CriarCliente from '../pages/Clientes/CriarCliente';
import ClienteDetalhe from '../pages/Clientes/ClienteDetalhe';

// Pages – Financeiro
import FinanceiroPage from '../pages/Financeiro/FinanceiroPage';

// Pages – Auditoria
import AuditoriaPage from '../pages/Auditoria/AuditoriaPage';

// Pages – Usuários
import UsuariosPage from '../pages/Usuarios/UsuariosPage';
// Pages - Ocamentos
import OrcamentosPage from '../pages/Orcamentos/OrcamentosPage';
import CriarOrcamento from '../pages/Orcamentos/CriarOrcamento';
import OrcamentoDetalhe from '../pages/Orcamentos/OrcamentoDetalhe';

//Pages Empresa Config
import EmpresaConfigPage from '../pages/Empresa/EmpresaConfigPage';

import { iniciarSyncListener } from './lib/offline/syncService';

iniciarSyncListener();

export default function AppRoutes() {
  const { autenticado, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>

      {/* ==========================
         ROTAS PÚBLICAS
      ========================== */}
      {!autenticado && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      {/* ==========================
         ROTAS PROTEGIDAS
      ========================== */}
      {autenticado && (
        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route path="/" element={<DashboardHome />} />

          {/* Usuários */}
          <Route path="/usuarios" element={<UsuariosPage />} />

          {/* Ordens */}
          <Route path="/ordens" element={<OrdensList />} />
          <Route path="/ordens/nova" element={<CriarOrdem />} />
          <Route path="/ordens/:id" element={<OrdemDetalhe />} />

          {/* Produtos */}
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/produtos/novo" element={<CriarProduto />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />

          {/* Clientes ✅ COMPLETO AGORA */}
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/novo" element={<CriarCliente />} />
          <Route path="/clientes/:id" element={<ClienteDetalhe />} />

          {/* Financeiro */}
          <Route path="/financeiro" element={<FinanceiroPage />} />

          {/* Auditoria */}
          <Route path="/auditoria" element={<AuditoriaPage />} />
           {/* Orcamento */}
          <Route path="/orcamentos" element={<OrcamentosPage />} />
          <Route path="/orcamentos/novo" element={<CriarOrcamento />} />
          <Route path="/orcamentos/:id" element={<OrcamentoDetalhe />} />

          <Route path="/empresa" element={<EmpresaConfigPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Route>
      )}

    </Routes>
  );
}
