type FormFieldProps = {
  label: string;
  error?: string | string[];
  children: React.ReactNode;
};

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="label">{label}</label>

      {children}

      {error &&
        (Array.isArray(error) ? (
          <div>
            <p>{label} doit :</p>
            <ul>
              {error.map((error) => (
                <li key={error} className="text-error text-sm">
                  - {error}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-error text-sm">{error}</p>
        ))}
    </div>
  );
}
