
interface MotorcyclesDebugInfoProps {
  debugInfo?: any;
}

export function MotorcyclesDebugInfo({ debugInfo }: MotorcyclesDebugInfoProps) {
  if (!debugInfo?.sampleData || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <details className="mt-8 p-4 bg-muted rounded-lg text-xs">
      <summary className="cursor-pointer font-medium">Debug Info (Development Only)</summary>
      <pre className="mt-2 whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </details>
  );
}
