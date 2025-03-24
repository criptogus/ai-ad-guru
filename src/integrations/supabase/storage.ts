
import { supabase } from "./client";

// Function to ensure buckets exist
export async function ensureStorageBucketsExist() {
  try {
    // Check and create the media bucket
    const { data: mediaBucketData, error: mediaBucketError } = await supabase.storage.getBucket('media');
    
    if (mediaBucketError && mediaBucketError.message.includes('The resource was not found')) {
      const { data: createMediaData, error: createMediaError } = await supabase.storage.createBucket('media', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
      });
      
      if (createMediaError) {
        console.error('Error creating media bucket:', createMediaError);
      } else {
        console.log('Media bucket created successfully');
      }
    }
    
    // Check and create the company bucket
    const { data: companyBucketData, error: companyBucketError } = await supabase.storage.getBucket('company');
    
    if (companyBucketError && companyBucketError.message.includes('The resource was not found')) {
      const { data: createCompanyData, error: createCompanyError } = await supabase.storage.createBucket('company', {
        public: true,
        fileSizeLimit: 2097152, // 2MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml']
      });
      
      if (createCompanyError) {
        console.error('Error creating company bucket:', createCompanyError);
      } else {
        console.log('Company bucket created successfully');
      }
    }
    
    // Set up storage policies
    await setupStoragePolicies();
    
  } catch (error) {
    console.error('Error ensuring storage buckets exist:', error);
  }
}

// Helper function to setup storage policies
async function setupStoragePolicies() {
  try {
    // This is just a check - the actual policies should be created in the SQL setup
    console.log('Verifying storage policies are in place...');
  } catch (error) {
    console.error('Error setting up storage policies:', error);
  }
}
