export default function BadgeStatus({ status }) {
  const statusNormalizado = status?.toLowerCase();

  const isAtivo =
    statusNormalizado === 'aberta' ||
    statusNormalizado === 'finalizada';

  return (
    <span className={`badge ${isAtivo ? 'badge-ativo' : 'badge-inativo'}`}>
      {status}
    </span>
  );
}
