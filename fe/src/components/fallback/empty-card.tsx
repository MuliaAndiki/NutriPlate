interface EmptyCardProps {
  title?: string;
  message?: string;
  className?: string;
}

const EmptyCard = ({
  title = "Kosong",
  message = "Belum ada data",
  className = "",
}: EmptyCardProps) => {
  return (
    <div
      className={`w-full border border-dashed border-foreground/20 bg-foreground/5 rounded-lg p-4 text-center ${className}`.trim()}
    >
      <h1 className="text-sm font-semibold">{title}</h1>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyCard;
