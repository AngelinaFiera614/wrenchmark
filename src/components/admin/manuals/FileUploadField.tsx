
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface FileUploadFieldProps {
  name: string;
  label: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ name, label }) => {
  const { setValue } = useFormContext();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(name, file);
    }
  };

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadField;
