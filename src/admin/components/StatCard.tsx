export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-masala-700">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-masala-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-masala-700">{hint}</p>}
    </div>
  );
}
