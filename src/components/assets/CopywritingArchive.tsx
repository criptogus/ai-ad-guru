
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Copy, FileText, Download, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CopyAsset {
  id: string;
  text: string;
  platform: string;
  character_count: number;
  published_at: string;
  ad_type?: string;
}

const CopywritingArchive: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<CopyAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<CopyAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, platformFilter]);

  const fetchAssets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('copywriting_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching copywriting assets:', error);
      toast.error('Failed to load copywriting archive');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = [...assets];
    
    // Apply platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(asset => asset.platform === platformFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.text.toLowerCase().includes(lowerSearch) ||
        asset.platform.toLowerCase().includes(lowerSearch)
      );
    }
    
    setFilteredAssets(filtered);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const duplicateAsset = async (asset: CopyAsset) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('copywriting_assets')
        .insert([
          {
            user_id: user.id,
            text: asset.text,
            platform: asset.platform,
            character_count: asset.character_count,
            published_at: new Date().toISOString(),
            ad_type: asset.ad_type
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Duplicated successfully');
      fetchAssets();
    } catch (error) {
      console.error('Error duplicating asset:', error);
      toast.error('Failed to duplicate');
    }
  };

  const exportAsCSV = () => {
    if (filteredAssets.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const headers = ['Text', 'Platform', 'Characters', 'Date Published', 'Ad Type'];
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(asset => [
        `"${asset.text.replace(/"/g, '""')}"`,
        asset.platform,
        asset.character_count,
        new Date(asset.published_at).toLocaleDateString(),
        asset.ad_type || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `copywriting-archive-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPlatformLabel = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'google':
        return 'Google';
      case 'meta':
        return 'Meta';
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'linkedin':
        return 'LinkedIn';
      case 'microsoft':
        return 'Microsoft';
      default:
        return platform;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Copywriting Archive</CardTitle>
            <CardDescription>
              Archive of all your ad copy for reuse
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={exportAsCSV}
              disabled={filteredAssets.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ad copy..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={platformFilter}
            onValueChange={setPlatformFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="microsoft">Microsoft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            {searchTerm || platformFilter !== 'all' ? (
              <p className="text-muted-foreground">No copy found matching your filters</p>
            ) : (
              <>
                <p className="font-medium mb-2">No saved copywriting yet</p>
                <p className="text-muted-foreground mb-4">
                  When you create ads, your copy will be archived here for reuse
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">Text</TableHead>
                  <TableHead>Ad Network</TableHead>
                  <TableHead>Characters</TableHead>
                  <TableHead>Date Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{truncateText(asset.text)}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p>{asset.text}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{getPlatformLabel(asset.platform)}</TableCell>
                    <TableCell>{asset.character_count}</TableCell>
                    <TableCell>{formatDate(asset.published_at)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(asset.text)}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => duplicateAsset(asset)}
                        title="Duplicate"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CopywritingArchive;
