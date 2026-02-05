import { useEffect, useState } from 'react';
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario
} from '../../api/usuarios';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('GERENTE');

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarUsuarios();
    setUsuarios(data);
  }

  async function criar() {
    if (!nome || !email || !senha || !role) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    await criarUsuario({
      nome,
      email,
      telefone: telefone || null,
      senha,
      role
    });

    setNome('');
    setEmail('');
    setTelefone('');
    setSenha('');
    setRole('GERENTE');

    carregar();
  }

  async function alterarStatus(usuario) {
    const acao = usuario.ativo ? 'desativar' : 'ativar';
    if (!window.confirm(`Deseja ${acao} este usuário?`)) return;

    await atualizarUsuario(usuario.id, {
      ativo: !usuario.ativo
    });

    carregar();
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600 }}>
            Usuários
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            Gerencie usuários e níveis de acesso ao sistema
          </p>
        </div>

        {/* CRIAÇÃO */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16 }}>
            Novo Usuário
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16
            }}
          >
            <input
              placeholder="Nome *"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />

            <input
              placeholder="Email *"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              placeholder="Telefone (opcional)"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha *"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />

            <select
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="ADMIN">Administrador</option>
              <option value="GERENTE">Gerente</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={criar}
          >
            Criar Usuário
          </button>
        </div>

        {/* LISTAGEM */}
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={th}>Nome</th>
                <th style={th}>Email</th>
                <th style={th}>Função</th>
                <th style={th}>Status</th>
                <th style={th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td style={td}>
                    <strong>{u.nome}</strong>
                  </td>

                  <td style={td}>{u.email}</td>

                  <td style={td}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background: '#1e293b'
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: u.ativo
                          ? '#16a34a' // verde sempre
                          : '#dc2626'
                      }}
                    >
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td style={td}>
                    <button
                      className="btn-secondary"
                      onClick={() => alterarStatus(u)}
                    >
                      {u.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{ padding: 24, textAlign: 'center' }}
                  >
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* =========================
   ESTILOS PADRÃO
========================= */
const th = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.8
};

const td = {
  padding: '14px 16px',
  fontSize: 14
};
