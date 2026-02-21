import { useEffect, useState } from 'react';
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario
} from '../../api/usuarios';
import './UsuariosPage.css';

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
      <div className="usuarios-container">

        {/* HEADER */}
        <div className="usuarios-header">
          <h1>Usuários</h1>
          <p>Gerencie usuários e níveis de acesso ao sistema</p>
        </div>

        {/* FORM CRIAÇÃO */}
        <div className="card">
          <h3>Novo Usuário</h3>

          <div className="usuarios-grid">

            <div className="form-group">
              <label>Nome *</label>
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Senha *</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Função *</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="ADMIN">Administrador</option>
                <option value="GERENTE">Gerente</option>
                <option value="VENDEDOR">Vendedor</option>
              </select>
            </div>

          </div>

          <button
            className="btn btn-primary criar-btn"
            onClick={criar}
          >
            Criar Usuário
          </button>
        </div>

        {/* LISTAGEM */}
        <div className="card">
          <div className="table-wrapper">
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.nome}</strong></td>
                    <td>{u.email}</td>

                    <td>
                      <span className="role-badge">
                        {u.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          u.ativo ? 'ativo' : 'inativo'
                        }`}
                      >
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn"
                        onClick={() => alterarStatus(u)}
                      >
                        {u.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}

                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Nenhum usuário cadastrado
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}