
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ComponentRedirectProps {
  componentType?: string;
}

const ComponentRedirect = ({ componentType }: ComponentRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to configurations page
    navigate("/admin/parts", { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-explorer-dark">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal mx-auto mb-4"></div>
        <p className="text-explorer-text">Redirecting to Configurations...</p>
        {componentType && (
          <p className="text-explorer-text-muted text-sm mt-2">
            Component management is now handled in the Configurations section
          </p>
        )}
      </div>
    </div>
  );
};

export default ComponentRedirect;
