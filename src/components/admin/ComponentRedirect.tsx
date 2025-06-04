
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ComponentRedirectProps {
  componentType?: string;
}

const ComponentRedirect = ({ componentType }: ComponentRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to configurations page with a slight delay for user feedback
    const timer = setTimeout(() => {
      navigate("/admin/parts", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getComponentName = () => {
    switch (componentType) {
      case 'engines': return 'Engine';
      case 'brake-systems': return 'Brake System';
      case 'frames': return 'Frame';
      case 'suspensions': return 'Suspension';
      case 'wheels': return 'Wheel';
      case 'components': return 'Component';
      default: return 'Component';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-explorer-dark">
      <div className="text-center max-w-md p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-explorer-text mb-2">
          {getComponentName()} Management Moved
        </h2>
        <p className="text-explorer-text-muted mb-4">
          {getComponentName()} management is now integrated within the Configurations section for better workflow organization.
        </p>
        <p className="text-sm text-accent-teal">
          Redirecting to Configurations → Component Library...
        </p>
      </div>
    </div>
  );
};

export default ComponentRedirect;
