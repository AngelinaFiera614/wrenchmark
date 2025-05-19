
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllBrands } from "@/services/brandService";

export const useAdminBrands = () => {
  const { toast } = useToast();

  const { data: brands = [], isError: isBrandsError } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getAllBrands,
    meta: {
      onError: (error: Error) => {
        console.error("Error loading brands:", error);
        toast({
          variant: "destructive",
          title: "Failed to load brands",
          description: "Please try refreshing the page.",
        });
      }
    }
  });

  return { brands, isBrandsError };
};
