
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Clipboard, Search, X, Calendar, Download } from "lucide-react";
import { CopyAsset } from "@/types/supabase";
import { format } from "date-fns";

const CopywritingArchive: React.FC = () => {
  const { user } = useAuth();
  const [copyAssets, setCopyAssets] = useState<CopyAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<CopyAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchCopyAssets();
    }
  }, [user]);

  useEffect(() => {
    filterAssets();
  }, [searchQuery, platformFilter, copyAssets]);

  const fetchCopyAssets = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("copywriting_assets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setCopyAssets(data as unknown as CopyAsset[]);
    } catch (error) {
      console.error("Error fetching copywriting assets:", error);
      toast.error("Failed to load copywriting archive");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = [...copyAssets];
    
    // Filter by platform
    if (platformFilter !== "all") {
      filtered = filtered.filter(asset => asset.platform === platformFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.text.toLowerCase().includes(query)
      );
    }
    
    setFilteredAssets(filtered);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const duplicateAsset = async (asset: CopyAsset) => {
    if (!user) return;
    
    try {
      const newAsset = {
        user_id: user.id,
        text: asset.text,
        platform: asset.platform,
        character_count: asset.character_count,
        published_at: new Date().toISOString(),
        ad_type: asset.ad_type
      };
      
      const { error } = await supabase
        .from("copywriting_assets")
        .insert([newAsset]);
      
      if (error) {
        throw error;
      }
      
      toast.success("Text duplicated successfully");
      fetchCopyAssets();
    } catch (error) {
      console.error("Error duplicating asset:", error);
      toast.error("Failed to duplicate text");
    }
  };

  const exportAsCSV = () => {
    // Create CSV content
    const headers = ["Text", "Platform", "Characters", "Date Published"];
    const rows = filteredAssets.map(asset => [
      `"${asset.text.replace(/"/g, '""')}"`,
      asset.platform,
      asset.character_count.toString(),
      new Date(asset.published_at).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `copywriting-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case "google": return "Google Ads";
      case "meta": return "Meta Ads";
      case "linkedin": return "LinkedIn";
      case "microsoft": return "Microsoft Ads";
      default: return platform;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Copywriting Archive</h2>
          <p className="text-sm text-muted-foreground">
            Store and reuse your ad text content
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={exportAsCSV} disabled={filteredAssets.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search text..."
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
        
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="microsoft">Microsoft Ads</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="h-6 w-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      ) : filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Clipboard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            {searchQuery || platformFilter !== "all" ? (
              <p className="text-muted-foreground">No copy assets found matching your filters</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No copy assets yet</p>
                <p className="text-muted-foreground">
                  Ad texts generated during campaign creation will be saved here
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 sm:p-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Text</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Characters</TableHead>
                    <TableHead>Date Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-md truncate" title={asset.text}>
                          {asset.text}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          {getPlatformLabel(asset.platform)}
                        </div>
                      </TableCell>
                      <TableCell>{asset.character_count}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(asset.published_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(asset.text)}
                            title="Copy to clipboard"
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateAsset(asset)}
                            className="h-8"
                            title="Duplicate"
                          >
                            Duplicate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CopywritingArchive;
