
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ImageIcon, UploadIcon, Trash2, Download, Search, X, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaAsset } from "@/types/supabase";

const MediaGallery: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFilename, setEditFilename] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const STORAGE_LIMIT = 100 * 1024 * 1024; // 100MB in bytes
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  useEffect(() => {
    if (user) {
      fetchMediaAssets();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAssets(assets);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredAssets(
        assets.filter((asset) => 
          asset.filename.toLowerCase().includes(query) ||
          (asset.campaigns && asset.campaigns.some(campaign => 
            campaign && campaign.toLowerCase().includes(query)
          ))
        )
      );
    }
  }, [searchQuery, assets]);

  const fetchMediaAssets = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Cast the data to our MediaAsset type
      const mediaAssets = data as unknown as MediaAsset[];
      
      // Calculate total storage used
      const totalSize = mediaAssets.reduce((acc, asset) => acc + asset.file_size, 0);
      setTotalStorage(totalSize);
      
      // Get public URLs for each asset
      const assetsWithUrls = mediaAssets.map(asset => {
        const { data } = supabase.storage
          .from("media")
          .getPublicUrl(asset.file_path);
        
        return {
          ...asset,
          url: data.publicUrl
        };
      });
      
      setAssets(assetsWithUrls as MediaAsset[]);
      setFilteredAssets(assetsWithUrls as MediaAsset[]);
    } catch (error) {
      console.error("Error fetching media assets:", error);
      toast.error("Failed to load media assets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, WEBP, or SVG");
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }
    
    // Check storage limit
    if (totalStorage + file.size > STORAGE_LIMIT) {
      toast.error("Storage limit reached. Please delete some images first.");
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;
      const filePath = `${user!.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          }
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);
      
      // Store record in database
      const { error: dbError } = await supabase
        .from("media_assets")
        .insert([
          {
            user_id: user!.id,
            filename: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            campaigns: [],
          }
        ]);
      
      if (dbError) {
        throw dbError;
      }
      
      toast.success("File uploaded successfully");
      fetchMediaAssets();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRenameAsset = async () => {
    if (!selectedAsset || !editFilename.trim()) return;
    
    try {
      const { error } = await supabase
        .from("media_assets")
        .update({ filename: editFilename })
        .eq("id", selectedAsset.id)
        .eq("user_id", user!.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("File renamed successfully");
      fetchMediaAssets();
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Error renaming file:", error);
      toast.error(error.message || "Failed to rename file");
    }
  };

  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([asset.file_path]);
      
      if (storageError) {
        throw storageError;
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from("media_assets")
        .delete()
        .eq("id", asset.id)
        .eq("user_id", user!.id);
      
      if (dbError) {
        throw dbError;
      }
      
      toast.success("File deleted successfully");
      fetchMediaAssets();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleDownloadAsset = (asset: MediaAsset) => {
    // Get the URL
    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(asset.file_path);
    
    // Create a temporary anchor and trigger download
    const a = document.createElement('a');
    a.href = data.publicUrl;
    a.download = asset.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openEditModal = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setEditFilename(asset.filename);
    setIsEditModalOpen(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-gray-500" />;
    }
    return <ImageIcon className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Media Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage your images for campaigns
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <X
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="whitespace-nowrap"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
          />
        </div>
      </div>
      
      {/* Storage usage indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span>Storage Used: {(totalStorage / (1024 * 1024)).toFixed(2)} MB</span>
          <span>{(totalStorage / STORAGE_LIMIT * 100).toFixed(1)}%</span>
        </div>
        <Progress value={totalStorage / STORAGE_LIMIT * 100} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {(STORAGE_LIMIT / (1024 * 1024)).toFixed(0)} MB limit per account
        </p>
      </div>
      
      {isUploading && (
        <Card className="overflow-hidden">
          <Progress value={uploadProgress} className="rounded-none" />
          <CardContent className="p-4">
            <p className="text-sm">Uploading: {uploadProgress.toFixed(0)}%</p>
          </CardContent>
        </Card>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="aspect-square animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            {searchQuery ? (
              <p className="text-muted-foreground">No media files found matching "{searchQuery}"</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No media files yet</p>
                <p className="text-muted-foreground mb-4">Upload images to use in your campaigns</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload your first image
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden group relative">
              <div 
                className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedAsset(asset)}
              >
                {asset.file_type.startsWith('image/') ? (
                  <img 
                    src={(asset as any).url} 
                    alt={asset.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400/e2e8f0/64748b?text=Error";
                    }}
                  />
                ) : (
                  getFileIcon(asset.file_type)
                )}
              </div>
              
              <CardContent className="p-3">
                <div className="truncate text-sm font-medium" title={asset.filename}>
                  {asset.filename}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {(asset.file_size / 1024).toFixed(0)} KB
                  </span>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditModal(asset)}
                      title="Rename"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownloadAsset(asset)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteAsset(asset)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Preview Modal */}
      {selectedAsset && (
        <Dialog 
          open={!!selectedAsset && !isEditModalOpen} 
          onOpenChange={(open) => !open && setSelectedAsset(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedAsset.filename}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden max-h-[60vh]">
                {selectedAsset.file_type.startsWith('image/') ? (
                  <img 
                    src={(selectedAsset as any).url} 
                    alt={selectedAsset.filename}
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                ) : (
                  <div className="p-12">
                    {getFileIcon(selectedAsset.file_type)}
                  </div>
                )}
              </div>
              
              <div className="w-full mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleDownloadAsset(selectedAsset)}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteAsset(selectedAsset)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={editFilename}
                onChange={(e) => setEditFilename(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRenameAsset}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaGallery;
