
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, Search, X, Trash2, Download, Edit2, FileImage } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface MediaAsset {
  id: string;
  file_path: string;
  filename: string;
  file_size: number;
  file_type: string;
  created_at: string;
  campaigns: string[];
  url?: string;
}

const MediaGallery: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storageUsage, setStorageUsage] = useState(0);
  const [storageTotalMB, setStorageTotalMB] = useState(100); // 100MB default limit
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newFilename, setNewFilename] = useState('');

  useEffect(() => {
    if (user) {
      fetchAssets();
      fetchStorageUsage();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = assets.filter(asset => 
        asset.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets);
    }
  }, [assets, searchTerm]);

  const fetchAssets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get URLs for all assets
      const assetsWithUrls = await Promise.all(data.map(async (asset) => {
        const { data: urlData } = supabase.storage
          .from('media_assets')
          .getPublicUrl(asset.file_path);
        
        return {
          ...asset,
          url: urlData.publicUrl
        };
      }));
      
      setAssets(assetsWithUrls);
      setFilteredAssets(assetsWithUrls);
    } catch (error) {
      console.error('Error fetching media assets:', error);
      toast.error('Failed to load media assets');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStorageUsage = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('calculate_user_storage', {
        user_uuid: user.id
      });
      
      if (error) throw error;
      
      // Convert bytes to MB
      const usageMB = Math.round((data / (1024 * 1024)) * 100) / 100;
      setStorageUsage(usageMB);
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;
    
    const file = files[0];
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      toast.error('Unsupported file format. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }
    
    // Check if this would exceed the storage limit
    const newTotalSizeMB = storageUsage + (file.size / (1024 * 1024));
    if (newTotalSizeMB > storageTotalMB) {
      toast.error(`Storage limit reached (${storageTotalMB}MB). Please delete some files.`);
      return;
    }
    
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = file.name.split('.')[0];
      const filePath = `${user.id}/${Date.now()}-${fileName}.${fileExt}`;
      
      // Create the bucket if it doesn't exist
      const { error: bucketError } = await supabase.storage.getBucket('media_assets');
      if (bucketError) {
        await supabase.storage.createBucket('media_assets', {
          public: true
        });
      }
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('media_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media_assets')
        .getPublicUrl(filePath);
      
      // Add record to the media_assets table
      const { error: dbError } = await supabase
        .from('media_assets')
        .insert([
          {
            user_id: user.id,
            filename: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            campaigns: []
          }
        ]);
      
      if (dbError) throw dbError;
      
      toast.success('File uploaded successfully');
      fetchAssets();
      fetchStorageUsage();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!user) return;
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media_assets')
        .remove([asset.file_path]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', asset.id);
      
      if (dbError) throw dbError;
      
      toast.success('File deleted successfully');
      setAssets(assets.filter(a => a.id !== asset.id));
      fetchStorageUsage();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(`Deletion failed: ${error.message}`);
    }
  };

  const handleRename = async () => {
    if (!selectedAsset || !user) return;
    
    try {
      const { error } = await supabase
        .from('media_assets')
        .update({ filename: newFilename })
        .eq('id', selectedAsset.id);
      
      if (error) throw error;
      
      toast.success('File renamed successfully');
      setAssets(assets.map(asset => 
        asset.id === selectedAsset.id 
          ? { ...asset, filename: newFilename } 
          : asset
      ));
      setRenameOpen(false);
    } catch (error: any) {
      console.error('Error renaming file:', error);
      toast.error(`Rename failed: ${error.message}`);
    }
  };

  const handleDownload = (asset: MediaAsset) => {
    if (!asset.url) return;
    
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openRenameDialog = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setNewFilename(asset.filename);
    setRenameOpen(true);
  };

  const openPreview = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setPreviewOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Media Gallery</CardTitle>
            <CardDescription>
              Store and manage your images for campaigns
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Input 
              ref={fileInputRef}
              type="file" 
              className="hidden"
              onChange={handleFileUpload}
              accept=".jpg,.jpeg,.png,.webp,.svg"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Storage Usage */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Storage Usage: {storageUsage.toFixed(2)}MB / {storageTotalMB}MB
            </span>
            <span className="text-sm font-medium">
              {Math.round((storageUsage / storageTotalMB) * 100)}%
            </span>
          </div>
          <Progress value={(storageUsage / storageTotalMB) * 100} />
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
              <span className="text-sm font-medium">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileImage className="h-16 w-16 text-muted-foreground mb-4" />
            {searchTerm ? (
              <p className="text-muted-foreground">No files found matching "{searchTerm}"</p>
            ) : (
              <>
                <p className="font-medium mb-2">No media files yet</p>
                <p className="text-muted-foreground mb-4">Upload images to use in your campaigns</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Now
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="group relative border rounded-md overflow-hidden">
                <div 
                  className="aspect-square bg-muted flex items-center justify-center cursor-pointer"
                  onClick={() => openPreview(asset)}
                >
                  {asset.url && (
                    <img 
                      src={asset.url}
                      alt={asset.filename}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate" title={asset.filename}>
                    {asset.filename}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(asset.file_size)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(asset.created_at)}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={() => openPreview(asset)}
                    className="h-8 w-8"
                  >
                    <FileImage className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={() => openRenameDialog(asset)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={() => handleDownload(asset)}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={() => handleDelete(asset)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {asset.campaigns.length > 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    Used in {asset.campaigns.length} campaign{asset.campaigns.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.filename}</DialogTitle>
            <DialogDescription>
              {formatFileSize(selectedAsset?.file_size || 0)} • 
              Uploaded on {formatDate(selectedAsset?.created_at || '')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedAsset?.url && (
              <img 
                src={selectedAsset.url}
                alt={selectedAsset.filename}
                className="max-h-[60vh] max-w-full object-contain"
              />
            )}
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleDownload(selectedAsset!)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <div className="space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setPreviewOpen(false);
                  openRenameDialog(selectedAsset!);
                }}
              >
                Rename
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDelete(selectedAsset!);
                  setPreviewOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for this file
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              placeholder="Enter new filename"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setRenameOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newFilename.trim() || newFilename === selectedAsset?.filename}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MediaGallery;
