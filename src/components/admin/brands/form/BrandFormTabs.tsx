
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrandFormValues } from "../BrandFormSchema";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { DetailsTab } from "./tabs/DetailsTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { MediaTab } from "./tabs/MediaTab";
import { AdminTab } from "./tabs/AdminTab";

interface BrandFormTabsProps {
  form: UseFormReturn<BrandFormValues>;
}

export const BrandFormTabs: React.FC<BrandFormTabsProps> = ({ form }) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-6">
        <BasicInfoTab form={form} />
      </TabsContent>
      
      <TabsContent value="details" className="space-y-6">
        <DetailsTab form={form} />
      </TabsContent>
      
      <TabsContent value="history" className="space-y-6">
        <HistoryTab form={form} />
      </TabsContent>
      
      <TabsContent value="media" className="space-y-6">
        <MediaTab />
      </TabsContent>
      
      <TabsContent value="admin" className="space-y-6">
        <AdminTab form={form} />
      </TabsContent>
    </Tabs>
  );
};
