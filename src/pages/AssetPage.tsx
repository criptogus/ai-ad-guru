
import React, { useState } from 'react';
import SafeAppLayout from '@/components/SafeAppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaGallery from '@/components/assets/MediaGallery';
import CopywritingArchive from '@/components/assets/CopywritingArchive';
import CustomerDataUpload from '@/components/assets/CustomerDataUpload';

const AssetPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('media');

  return (
    <SafeAppLayout activePage="assets">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Asset Management</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="media">Media Gallery</TabsTrigger>
            <TabsTrigger value="copywriting">Copywriting Archive</TabsTrigger>
            <TabsTrigger value="customers">Customer Data</TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-4">
            <MediaGallery />
          </TabsContent>

          <TabsContent value="copywriting" className="space-y-4">
            <CopywritingArchive />
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <CustomerDataUpload />
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default AssetPage;
