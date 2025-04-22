
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '../useWebsiteAnalysis';
import { GoogleAd } from './types';

export const useGoogleAds = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generating Google ads for:', campaignData.companyName);

      // Forçar a linguagem para português, não deixar campo vazio ou genérico
      const language = campaignData.language ? campaignData.language.toLowerCase() : 'português';

      // Criar o corpo da requisição com as informações completas e consistentes
      const requestBody = {
        platform: 'google',
        campaignData: {
          ...campaignData,
          language, // Força português explícito
          brandTone: campaignData.brandTone || 'professional',
          callToAction: campaignData.callToAction || ['Saiba mais'],
          keywords: campaignData.keywords || [],
          platforms: ['google'],
        },
        temperature: 0.3,
      };

      console.log('Sending request to generate-ads function:', JSON.stringify(requestBody, null, 2));

      const { data, error: apiError } = await supabase.functions.invoke('generate-ads', {
        body: requestBody,
      });

      if (apiError) {
        const message = apiError.message || 'Failed to call generate-ads function';
        console.error('API Error generating Google ads:', apiError);
        setError(message);
        toast({
          title: 'API Error',
          description: message,
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      if (!data?.success) {
        const message = data?.error || 'Failed to generate Google ads';
        console.error('Function Error:', message);
        setError(message);
        toast({
          title: 'Generation Failed',
          description: message,
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      console.log('🧪 Raw data from API:', data);

      let parsedAds;

      if (data.data) {
        if (typeof data.data === 'string') {
          try {
            console.log('🧪 Attempting to parse string data:', data.data.substring(0, 150) + '...');
            parsedAds = JSON.parse(data.data);
            console.log('🧪 Successfully parsed JSON from string');
          } catch (parseError) {
            console.error('Error parsing ads response as JSON:', parseError);
            setError('Invalid response format');
            toast({
              title: 'Format Error',
              description: 'The generated ads were not in the correct format.',
              variant: 'destructive',
            });
            setIsGenerating(false);
            return null;
          }
        } else if (Array.isArray(data.data)) {
          parsedAds = data.data;
        } else {
          console.error('Invalid data format, expected array or JSON string:', typeof data.data);
          setError('Invalid response format');
          toast({
            title: 'Format Error',
            description: 'The generated ads were not in the correct format.',
            variant: 'destructive',
          });
          setIsGenerating(false);
          return null;
        }
      } else {
        console.error('No data returned from API');
        setError('No data returned');
        toast({
          title: 'Empty Response',
          description: 'No ad data was returned from the service.',
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      if (!Array.isArray(parsedAds)) {
        console.error('Parsed data is not an array:', parsedAds);
        setError('Invalid response format');
        toast({
          title: 'Format Error',
          description: 'The generated ads were not in the correct format.',
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      // Normalização dos campos esperando aliases possíveis, sempre em português
      const normalizedAds = parsedAds.map((ad: any) => ({
        headline1: ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '',
        headline2: ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '',
        headline3: ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || '',
        description1: ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '',
        description2: ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || '',
        displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'exemplo.com',
        path1: ad.path1 || ad.path_1 || '',
        path2: ad.path2 || ad.path_2 || '',
        siteLinks: ad.siteLinks || ad.site_links || [],
      }));

      console.log('🧪 Normalized Google ads:', normalizedAds);
      if (normalizedAds.length > 0) {
        console.log('🧪 First ad sample:', normalizedAds[0]);
      }

      setGoogleAds(normalizedAds);

      if (!normalizedAds || normalizedAds.length === 0) {
        toast({
          title: 'No Ads Generated',
          description: 'No Google Ads were generated from this input.',
          variant: 'default',
        });
        setIsGenerating(false);
        return normalizedAds;
      }

      toast({
        title: 'Ads Generated',
        description: `Successfully generated ${normalizedAds.length} Google ad variations`,
      });

      setIsGenerating(false);
      return normalizedAds;
    } catch (error) {
      console.error('Error generating Google ads:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsGenerating(false);
      return null;
    }
  };

  return {
    generateGoogleAds,
    isGenerating,
    googleAds,
    setGoogleAds,
    error,
  };
};
