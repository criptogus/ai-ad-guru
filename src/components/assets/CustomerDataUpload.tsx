
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Users, X, Download, Trash2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomerData, CustomerImport } from "@/types/supabase";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

const CustomerDataUpload: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
  const [imports, setImports] = useState<CustomerImport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [listName, setListName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_RECORDS = 10000;

  useEffect(() => {
    if (user) {
      fetchCustomerData();
      fetchImportHistory();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCustomers(
        customers.filter((customer) => 
          customer.email.toLowerCase().includes(query) ||
          (customer.name && customer.name.toLowerCase().includes(query)) ||
          (customer.segment && customer.segment.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, customers]);

  const fetchCustomerData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("customer_data")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setCustomers(data as unknown as CustomerData[]);
      setFilteredCustomers(data as unknown as CustomerData[]);
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to load customer data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImportHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("customer_data_imports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setImports(data as unknown as CustomerImport[]);
    } catch (error) {
      console.error("Error fetching import history:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'csv' && fileExt !== 'txt') {
      toast.error("Invalid file format. Please upload a CSV or TXT file");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    setImportFile(file);
    
    // Use filename without extension as default list name
    const baseName = file.name.split('.')[0];
    setListName(baseName);
  };

  const validateCSV = (content: string): { valid: boolean; records: any[]; errorMessage?: string } => {
    // Split content into lines
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return { valid: false, records: [], errorMessage: "File is empty" };
    }
    
    // Parse header row
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    // Check if required email column exists
    if (!headers.includes('email')) {
      return { valid: false, records: [], errorMessage: "CSV must include an 'email' column" };
    }
    
    // Check record limit
    if (lines.length - 1 > MAX_RECORDS) {
      return { 
        valid: false, 
        records: [], 
        errorMessage: `Maximum ${MAX_RECORDS} records allowed (found ${lines.length - 1})` 
      };
    }
    
    // Parse data rows
    const records: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      
      // Skip rows with wrong number of columns
      if (values.length !== headers.length) {
        continue;
      }
      
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      
      // Skip if no email
      if (!record.email || !isValidEmail(record.email)) {
        continue;
      }
      
      records.push(record);
    }
    
    return { valid: true, records };
  };

  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleImport = async () => {
    if (!importFile || !listName.trim() || !user) return;
    
    setIsUploading(true);
    
    try {
      const content = await importFile.text();
      
      // Validate and parse CSV
      const validation = validateCSV(content);
      
      if (!validation.valid) {
        toast.error(validation.errorMessage || "Invalid CSV format");
        setIsUploading(false);
        return;
      }
      
      const { records } = validation;
      
      if (records.length === 0) {
        toast.error("No valid records found in the file");
        setIsUploading(false);
        return;
      }
      
      // Create import record
      const importBatchId = uuidv4();
      const { error: importError } = await supabase
        .from("customer_data_imports")
        .insert([
          {
            user_id: user.id,
            list_name: listName,
            record_count: records.length,
            status: "completed"
          }
        ]);
      
      if (importError) {
        throw importError;
      }
      
      // Create customer records
      const customerRecords = records.map(record => ({
        user_id: user.id,
        email: record.email,
        name: record.name || "",
        segment: record.segment || "",
        list_name: listName,
        import_batch: importBatchId
      }));
      
      // Insert in batches to avoid request size limitations
      const BATCH_SIZE = 100;
      for (let i = 0; i < customerRecords.length; i += BATCH_SIZE) {
        const batch = customerRecords.slice(i, i + BATCH_SIZE);
        const { error: batchError } = await supabase
          .from("customer_data")
          .insert(batch);
        
        if (batchError) {
          throw batchError;
        }
      }
      
      toast.success(`Successfully imported ${records.length} contacts`);
      
      setIsImportModalOpen(false);
      setImportFile(null);
      setListName("");
      
      // Refresh data
      await fetchCustomerData();
      await fetchImportHistory();
      
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error("Failed to import customer data");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteList = async (importId: string) => {
    if (!confirm("Are you sure you want to delete this list? All contacts in this list will be removed.")) {
      return;
    }
    
    try {
      // Get the import record to find the list name
      const { data: importData, error: importError } = await supabase
        .from("customer_data_imports")
        .select("list_name")
        .eq("id", importId)
        .single();
      
      if (importError || !importData) {
        throw importError || new Error("Could not find import record");
      }
      
      // Delete customer records for this list
      const { error: deleteCustomersError } = await supabase
        .from("customer_data")
        .delete()
        .eq("user_id", user!.id)
        .eq("list_name", importData.list_name);
      
      if (deleteCustomersError) {
        throw deleteCustomersError;
      }
      
      // Delete import record
      const { error: deleteImportError } = await supabase
        .from("customer_data_imports")
        .delete()
        .eq("id", importId)
        .eq("user_id", user!.id);
      
      if (deleteImportError) {
        throw deleteImportError;
      }
      
      toast.success("List deleted successfully");
      
      // Refresh data
      await fetchCustomerData();
      await fetchImportHistory();
      
    } catch (error) {
      console.error("Error deleting list:", error);
      toast.error("Failed to delete list");
    }
  };

  const exportList = (listName: string) => {
    const listData = customers.filter(customer => customer.list_name === listName);
    
    if (listData.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    // Get all unique fields
    const fields = new Set<string>();
    listData.forEach(customer => {
      Object.keys(customer).forEach(key => {
        if (key !== 'id' && key !== 'user_id' && key !== 'import_batch' && key !== 'created_at' && key !== 'updated_at') {
          fields.add(key);
        }
      });
    });
    
    const headers = Array.from(fields);
    
    // Create CSV content
    const rows = listData.map(customer => 
      headers.map(header => {
        const value = (customer as any)[header];
        return value ? `"${value.toString().replace(/"/g, '""')}"` : "";
      })
    );
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${listName}-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteAllData = async () => {
    if (!confirm("Are you sure you want to delete ALL customer data? This action cannot be undone.")) {
      return;
    }
    
    try {
      // Delete all customer records
      const { error: deleteCustomersError } = await supabase
        .from("customer_data")
        .delete()
        .eq("user_id", user!.id);
      
      if (deleteCustomersError) {
        throw deleteCustomersError;
      }
      
      // Delete all import records
      const { error: deleteImportsError } = await supabase
        .from("customer_data_imports")
        .delete()
        .eq("user_id", user!.id);
      
      if (deleteImportsError) {
        throw deleteImportsError;
      }
      
      toast.success("All customer data deleted successfully");
      
      // Refresh data
      setCustomers([]);
      setFilteredCustomers([]);
      setImports([]);
      
    } catch (error) {
      console.error("Error deleting all data:", error);
      toast.error("Failed to delete customer data");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Customer Data</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage your customer contact lists
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
            className="whitespace-nowrap"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload List
          </Button>
        </div>
      </div>
      
      {/* Import lists section */}
      <h3 className="text-lg font-medium mt-6">Import History</h3>
      {imports.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">No imported lists yet</p>
            <p className="text-muted-foreground mb-4">
              Upload your first customer list in CSV format
            </p>
            <Button onClick={() => setIsImportModalOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload List
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 sm:p-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>List Name</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead>Import Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imports.map((importItem) => (
                    <TableRow key={importItem.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">
                        {importItem.list_name}
                      </TableCell>
                      <TableCell>{importItem.record_count}</TableCell>
                      <TableCell>
                        {format(new Date(importItem.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => exportList(importItem.list_name)}
                            title="Export list"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteList(importItem.id)}
                            title="Delete list"
                          >
                            <Trash2 className="h-4 w-4" />
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
      
      {/* Customer data section */}
      <div className="flex justify-between items-center mt-6">
        <h3 className="text-lg font-medium">Contact Data</h3>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full sm:w-64"
          />
          {searchQuery && (
            <X
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="h-6 w-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </CardContent>
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            {searchQuery ? (
              <p className="text-muted-foreground">No contacts found matching "{searchQuery}"</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">No contacts yet</p>
                <p className="text-muted-foreground mb-4">
                  Upload a CSV file to import customer contact data
                </p>
                <Button onClick={() => setIsImportModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Contacts
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0 sm:p-2">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>List</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          {customer.email}
                        </TableCell>
                        <TableCell>{customer.name || "—"}</TableCell>
                        <TableCell>{customer.segment || "—"}</TableCell>
                        <TableCell>{customer.list_name || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Delete all data button */}
          {customers.length > 0 && (
            <div className="flex justify-end mt-6">
              <Button 
                variant="destructive" 
                onClick={deleteAllData}
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Contact Data
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Customer List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="list-name">List Name</Label>
              <Input
                id="list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="E.g., Newsletter Subscribers"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv,.txt"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                CSV file must include an "email" column. Other columns like "name" and "segment" will be imported if present.
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum {MAX_RECORDS.toLocaleString()} records per upload.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline" 
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                  setListName("");
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={isUploading || !importFile || !listName.trim()}
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-current rounded-full animate-spin mr-2"></div>
                    Importing...
                  </>
                ) : "Import"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDataUpload;
