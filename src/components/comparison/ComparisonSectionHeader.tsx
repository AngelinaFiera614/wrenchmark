
interface ComparisonSectionHeaderProps {
  title: string;
  description?: string;
}

export default function ComparisonSectionHeader({ title, description }: ComparisonSectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
