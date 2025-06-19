
export interface ColorOptionDialogProps {
  open: boolean;
  color?: any;
  onClose: (refresh?: boolean) => void;
}

export interface ModelYearWithModel {
  id: string;
  year: number;
  motorcycle_models: {
    name: string;
    brands: {
      name: string;
    }[];
  }[];
}

export interface ColorFormData {
  name: string;
  hex_code: string;
  image_url: string;
  is_limited: boolean;
  model_year_id: string;
}
