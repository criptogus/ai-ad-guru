
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, Database, Download, Trash2, Users, FileSpreadsheet,
  AlertTriangle, Check, X, RefreshCw, Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog, DialogContent, DialogTitle, DialogDescription, 
  DialogHeader, DialogFooter 
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import Papa from 'papaparse';

interface CustomerData {
  id: string;
  email: string;
  name?: string;
  segment?: string;
  created_at: string;
  list_name?: string;
}

interface CustomerImport {
  id: string;
  list_name: string;
  record_count: number;
  created_at: string;
  status: string;
}

interface DataPreview {
  emails: string[];
  names: string[];
  segments: string[];
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  listName: string;
}

const CustomerDataUpload: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
  const [imports, setImports] = useState<CustomerImport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalContacts, setTotalContacts] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchCustomers();
      fetchImports();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer => 
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.segment && customer.segment.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchTerm]);

  const fetchCustomers = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_data')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCustomers(data || []);
      setTotalContacts(data?.length || 0);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to load customer data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImports = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('customer_data_imports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setImports(data || []);
    } catch (error) {
      console.error('Error fetching import history:', error);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;
    
    const file = files[0];
    
    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Only CSV and TXT files are supported');
      return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        previewData(results.data, file.name);
      },
      error: (error) => {
        toast.error(`Error parsing file: ${error.message}`);
      }
    });
  };

  const previewData = (data: any[], fileName: string) => {
    if (data.length === 0) {
      toast.error('File is empty or has no valid data');
      return;
    }
    
    if (data.length > 10000) {
      toast.error('File contains too many records. Maximum is 10,000.');
      return;
    }

    // Extract headers to identify columns
    const headers = Object.keys(data[0]).map(h => h.toLowerCase());
    
    // Check if email column exists
    const emailColumn = headers.find(h => h === 'email' || h.includes('email'));
    if (!emailColumn) {
      toast.error('File must contain an email column');
      return;
    }
    
    // Identify name and segment columns
    const nameColumn = headers.find(h => h === 'name' || h.includes('name') || h === 'fullname' || h === 'full name' || h === 'firstname' || h === 'first name');
    const segmentColumn = headers.find(h => h === 'segment' || h === 'tag' || h === 'category' || h === 'group');
    
    // Process data
    const emails: string[] = [];
    const names: string[] = [];
    const segments: string[] = [];
    const uniqueEmails = new Set<string>();
    let validCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;
    
    data.forEach(row => {
      const email = row[emailColumn]?.trim();
      const name = nameColumn ? row[nameColumn]?.trim() : undefined;
      const segment = segmentColumn ? row[segmentColumn]?.trim() : undefined;
      
      if (email && validateEmail(email)) {
        if (uniqueEmails.has(email.toLowerCase())) {
          duplicateCount++;
        } else {
          uniqueEmails.add(email.toLowerCase());
          emails.push(email);
          names.push(name || '');
          segments.push(segment || '');
          validCount++;
        }
      } else if (email) {
        invalidCount++;
      }
    });
    
    if (validCount === 0) {
      toast.error('No valid email addresses found in file');
      return;
    }
    
    // Generate list name from file name
    const listName = fileName.replace(/\.[^/.]+$/, "");
    
    setDataPreview({
      emails,
      names,
      segments,
      validCount,
      invalidCount,
      duplicateCount,
      listName
    });
    
    setPreviewOpen(true);
  };

  const uploadCustomerData = async () => {
    if (!user || !dataPreview) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Generate a batch ID for all records
      const batchId = crypto.randomUUID();
      
      // Insert the import record
      const { error: importError } = await supabase
        .from('customer_data_imports')
        .insert([
          {
            user_id: user.id,
            list_name: dataPreview.listName,
            record_count: dataPreview.validCount,
            status: 'processing'
          }
        ]);
      
      if (importError) throw importError;
      
      // Prepare customer data records
      const customerRecords = dataPreview.emails.map((email, index) => ({
        user_id: user.id,
        email,
        name: dataPreview.names[index] || null,
        segment: dataPreview.segments[index] || null,
        list_name: dataPreview.listName,
        import_batch: batchId
      }));
      
      // Upload in batches of 100 to show progress
      const batchSize = 100;
      const batches = Math.ceil(customerRecords.length / batchSize);
      
      for (let i = 0; i < batches; i++) {
        const batchStart = i * batchSize;
        const batchEnd = Math.min((i + 1) * batchSize, customerRecords.length);
        const batch = customerRecords.slice(batchStart, batchEnd);
        
        const { error: batchError } = await supabase
          .from('customer_data')
          .insert(batch);
        
        if (batchError) throw batchError;
        
        // Update progress
        const progress = Math.round(((i + 1) / batches) * 100);
        setUploadProgress(progress);
      }
      
      // Update import status to complete
      await supabase
        .from('customer_data_imports')
        .update({ status: 'completed' })
        .eq('list_name', dataPreview.listName)
        .eq('user_id', user.id);
      
      toast.success(`Uploaded ${dataPreview.validCount} contacts successfully`);
      fetchCustomers();
      fetchImports();
      setPreviewOpen(false);
    } catch (error: any) {
      console.error('Error uploading customer data:', error);
      toast.error(`Upload failed: ${error.message}`);
      
      // Update import status to failed
      if (dataPreview.listName) {
        await supabase
          .from('customer_data_imports')
          .update({ status: 'failed' })
          .eq('list_name', dataPreview.listName)
          .eq('user_id', user.id);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const exportCustomerData = () => {
    if (filteredCustomers.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    // Convert the data to CSV
    const headers = ['Email', 'Name', 'Segment', 'Upload Date', 'List'];
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map(customer => [
        customer.email,
        customer.name || '',
        customer.segment || '',
        new Date(customer.created_at).toLocaleDateString(),
        customer.list_name || ''
      ].join(','))
    ].join('\n');
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customer-data-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteSelectedCustomers = async () => {
    if (!user || selectedRows.size === 0) return;
    
    try {
      const ids = Array.from(selectedRows);
      
      const { error } = await supabase
        .from('customer_data')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      
      toast.success(`Deleted ${ids.length} contacts successfully`);
      fetchCustomers();
      setSelectedRows(new Set());
      setSelectAll(false);
      setConfirmDelete(false);
    } catch (error: any) {
      console.error('Error deleting contacts:', error);
      toast.error(`Deletion failed: ${error.message}`);
    }
  };

  const deleteAllCustomers = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('customer_data')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('All contacts deleted successfully');
      fetchCustomers();
      setSelectedRows(new Set());
      setSelectAll(false);
      setConfirmDelete(false);
    } catch (error: any) {
      console.error('Error deleting all contacts:', error);
      toast.error(`Deletion failed: ${error.message}`);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allIds = filteredCustomers.map(customer => customer.id);
      setSelectedRows(new Set(allIds));
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === filteredCustomers.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Customer Data</CardTitle>
            <CardDescription>
              Manage customer email lists for targeting
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload List
            </Button>
            <Input 
              ref={fileInputRef}
              type="file" 
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv,.txt"
            />
            <Button 
              variant="outline" 
              onClick={exportCustomerData}
              disabled={filteredCustomers.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setConfirmDelete(true)}
              disabled={selectedRows.size === 0 && customers.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Total Contacts: <strong>{totalContacts}</strong>
            </span>
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Uploading contacts...
              </span>
              <span className="text-sm font-medium">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            {searchTerm ? (
              <p className="text-muted-foreground">No contacts found matching "{searchTerm}"</p>
            ) : (
              <>
                <p className="font-medium mb-2">No customer data yet</p>
                <p className="text-muted-foreground mb-4">Upload a CSV file with email addresses to get started</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Customer List
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectAll}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>List</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.has(customer.id)}
                        onCheckedChange={() => toggleSelectRow(customer.id)}
                      />
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.name || '-'}</TableCell>
                    <TableCell>{customer.segment || '-'}</TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                    <TableCell>{customer.list_name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Import History */}
        {imports.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Import History</h3>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>List Name</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Import Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imports.map((imp) => (
                    <TableRow key={imp.id}>
                      <TableCell>{imp.list_name}</TableCell>
                      <TableCell>{imp.record_count}</TableCell>
                      <TableCell>{formatDate(imp.created_at)}</TableCell>
                      <TableCell>
                        {imp.status === 'completed' && (
                          <span className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            Completed
                          </span>
                        )}
                        {imp.status === 'processing' && (
                          <span className="flex items-center text-amber-600">
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            Processing
                          </span>
                        )}
                        {imp.status === 'failed' && (
                          <span className="flex items-center text-red-600">
                            <X className="h-4 w-4 mr-1" />
                            Failed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verify Import Data</DialogTitle>
            <DialogDescription>
              Review the data before importing into your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {dataPreview && (
              <>
                <div className="space-y-2">
                  <Label>File Summary</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-muted p-2 rounded-md flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{dataPreview.validCount} valid emails</span>
                    </div>
                    {dataPreview.invalidCount > 0 && (
                      <div className="bg-muted p-2 rounded-md flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{dataPreview.invalidCount} invalid emails</span>
                      </div>
                    )}
                    {dataPreview.duplicateCount > 0 && (
                      <div className="bg-muted p-2 rounded-md flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">{dataPreview.duplicateCount} duplicates (skipped)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="listName">List Name</Label>
                  <Input 
                    id="listName"
                    value={dataPreview.listName}
                    onChange={(e) => setDataPreview({...dataPreview, listName: e.target.value})}
                    placeholder="Give this list a name"
                  />
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Please verify your data</AlertTitle>
                  <AlertDescription>
                    By uploading this list, you confirm that you have permission to use these email addresses for marketing purposes.
                  </AlertDescription>
                </Alert>
                
                {dataPreview.emails.length > 0 && (
                  <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Tag</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataPreview.emails.slice(0, 10).map((email, i) => (
                          <TableRow key={i}>
                            <TableCell>{email}</TableCell>
                            <TableCell>{dataPreview.names[i] || '-'}</TableCell>
                            <TableCell>{dataPreview.segments[i] || '-'}</TableCell>
                          </TableRow>
                        ))}
                        {dataPreview.emails.length > 10 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              + {dataPreview.emails.length - 10} more contacts
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPreviewOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadCustomerData}
              disabled={isUploading || !dataPreview || dataPreview.validCount === 0}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Import {dataPreview?.validCount} Contacts
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedRows.size > 0 
                ? `Are you sure you want to delete ${selectedRows.size} selected contacts?` 
                : 'Are you sure you want to delete all contacts?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={selectedRows.size > 0 ? deleteSelectedCustomers : deleteAllCustomers}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {selectedRows.size > 0 ? 'Delete Selected' : 'Delete All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerDataUpload;
