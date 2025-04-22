

import { WebsiteAnalysisResult } from "../types.ts";

/** Utility: Truncate fields for ad platform compliance */
function truncate(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

/** Utility: Normalize to array with fallbacks */
function normalizeField<T>(field: T | T[] | undefined, fallback: T[]): T[] {
  if (Array.isArray(field)) return field;
  if (typeof field === "string") return [field as T];
  return fallback;
}

/** Utility: Remove protocol, www, trailing slash from URL */
function getDisplayUrl(url: string = ""): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/** Unique fallback lists */
const defaultUSPs = [
  "Award-winning team",
  "Trusted by clients",
  "Tailored strategies",
  "Professional support",
  "Proven expertise"
];

const defaultCTAs = [
  "Learn More",
  "Contact Us",
  "Get Started",
  "Request a Quote",
  "Schedule a Demo"
];

/**
 * Generates fallback Google ads when AI generation fails,
 * keeping all fields within platform length limits.
 */
export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || "Your Company";
  const industry = campaignData.industry || "professional services";
  const targetAudience = campaignData.targetAudience || "potential customers";
  const objective = campaignData.objective || "awareness";
  const websiteUrl = campaignData.websiteUrl || "example.com";
  const displayUrl = getDisplayUrl(websiteUrl);

  const uniqueSellingPoints = normalizeField(
    campaignData.uniqueSellingPoints,
    defaultUSPs
  );
  const callToActions = normalizeField(
    campaignData.callToAction,
    defaultCTAs
  );

  // Rotate USPs/CTAs for fallback diversity
  function usp(i: number) {
    return uniqueSellingPoints[i % uniqueSellingPoints.length] || defaultUSPs[i % defaultUSPs.length];
  }
  function cta(i: number) {
    return callToActions[i % callToActions.length] || defaultCTAs[i % defaultCTAs.length];
  }

  return [
    {
      headline_1: truncate(`${companyName} ${industry}`, 30),
      headline_2: truncate(`Solutions for ${targetAudience}`, 30),
      headline_3: truncate(
        objective === "conversion"
          ? "Buy Now"
          : objective === "consideration"
          ? "Learn More"
          : "Discover Today",
        30
      ),
      description_1: truncate(
        `Top-rated ${industry} services designed specifically for ${targetAudience}. ${usp(0)}.`,
        90
      ),
      description_2: truncate(
        `${usp(1)} ready to help. ${cta(0)} today for a ${objective === "conversion" ? "quote" : "consultation"}.`,
        90
      ),
      display_url: displayUrl
    },
    {
      headline_1: truncate(`${industry} Experts | ${companyName}`, 30),
      headline_2: truncate(`Trusted by ${targetAudience}`, 30),
      headline_3: truncate(cta(0), 30),
      description_1: truncate(
        `Award-winning ${industry} solutions with ${usp(0)}. Helping ${targetAudience} since 2010.`,
        90
      ),
      description_2: truncate(
        `${usp(2)} for your needs. Free ${objective === "conversion" ? "quote" : "consultation"} available.`,
        90
      ),
      display_url: `${displayUrl}/services`
    },
    {
      headline_1: truncate(`#1 ${industry} Provider`, 30),
      headline_2: truncate(`Solutions for ${targetAudience}`, 30),
      headline_3: truncate(
        objective === "conversion"
          ? "Get a Quote Today"
          : objective === "consideration"
          ? "See Our Approach"
          : "Learn How We Help",
        30
      ),
      description_1: truncate(
        `${companyName} delivers ${usp(0)} ${industry} services tailored for ${targetAudience}.`,
        90
      ),
      description_2: truncate(
        `${usp(1)} with years of experience. ${cta(1)} now.`,
        90
      ),
      display_url: `${displayUrl}/solutions`
    },
    {
      headline_1: truncate(
        `${companyName} - ${
          objective === "conversion"
            ? "Save Today"
            : objective === "consideration"
            ? "Compare Options"
            : "Discover Solutions"
        }`,
        30
      ),
      headline_2: truncate(`Top-Rated ${industry} Services`, 30),
      headline_3: truncate(`Perfect for ${targetAudience}`, 30),
      description_1: truncate(
        `Looking for quality ${industry} services? ${companyName} provides ${usp(0)} solutions.`,
        90
      ),
      description_2: truncate(
        `${usp(1)} for every client. ${cta(0)} to learn more.`,
        90
      ),
      display_url: displayUrl
    },
    {
      headline_1: truncate(`${industry} Solutions | ${companyName}`, 30),
      headline_2: truncate(`Designed for ${targetAudience}`, 30),
      headline_3: truncate(cta(0), 30),
      description_1: truncate(
        `Get ${usp(0)} ${industry} services from ${companyName}. Trusted by clients nationwide.`,
        90
      ),
      description_2: truncate(
        `${usp(2)} available. ${objective === "conversion" ? "Limited time offer." : "Free resources available."}`,
        90
      ),
      display_url: `${displayUrl}/about`
    }
  ];
}

/**
 * Generates fallback Microsoft ads when AI generation fails.
 * Maintains structure and truncates to platform limits.
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Your Company';
  const industry = campaignData.industry || 'professional services';
  const targetAudience = campaignData.targetAudience || 'potential customers';
  const objective = campaignData.objective || 'awareness';
  const websiteUrl = campaignData.websiteUrl || 'example.com';
  const displayUrl = getDisplayUrl(websiteUrl);

  const uniqueSellingPoints = normalizeField(
    campaignData.uniqueSellingPoints,
    defaultUSPs
  );
  const callToActions = normalizeField(
    campaignData.callToAction,
    defaultCTAs
  );

  function usp(i: number) {
    return uniqueSellingPoints[i % uniqueSellingPoints.length] || defaultUSPs[i % defaultUSPs.length];
  }
  function cta(i: number) {
    return callToActions[i % callToActions.length] || defaultCTAs[i % defaultCTAs.length];
  }

  return [
    {
      headline_1: truncate(`${companyName} - ${industry} Solutions`, 30),
      headline_2: truncate(`Perfect for ${targetAudience}`, 30),
      headline_3: truncate(
        objective === 'conversion'
          ? 'Special Offer Today'
          : objective === 'consideration'
          ? 'See How We Help'
          : 'Discover More',
        30
      ),
      description_1: truncate(
        `Leading provider of ${industry} services with ${usp(0)} for ${targetAudience}.`,
        90
      ),
      description_2: truncate(
        `${usp(1)} from experts in the field. ${cta(0)} today.`,
        90
      ),
      display_url: displayUrl
    },
    {
      headline_1: truncate(`${industry} Services | ${companyName}`, 30),
      headline_2: truncate(`Trusted by ${targetAudience}`, 30),
      headline_3: truncate(cta(0), 30),
      description_1: truncate(
        `Find the right ${industry} solution with ${companyName}. ${usp(0)} guaranteed.`,
        90
      ),
      description_2: truncate(
        `Serving ${targetAudience} with ${usp(1)}. Free ${objective === 'conversion' ? 'quote' : 'consultation'}.`,
        90
      ),
      display_url: `${displayUrl}/services`
    },
    {
      headline_1: truncate(`${companyName} ${industry} Services`, 30),
      headline_2: truncate(`Designed for ${targetAudience}`, 30),
      headline_3: truncate(
        objective === 'conversion'
          ? 'Request a Quote'
          : objective === 'consideration'
          ? 'See Our Approach'
          : 'Learn More Today',
        30
      ),
      description_1: truncate(
        `${companyName} offers ${usp(0)} ${industry} solutions that deliver real results.`,
        90
      ),
      description_2: truncate(
        `Our ${usp(1)} is ready to help. ${cta(1)} now.`,
        90
      ),
      display_url: `${displayUrl}/solutions`
    },
    {
      headline_1: truncate(`Premium ${industry} Solutions`, 30),
      headline_2: truncate(`Ideal for ${targetAudience}`, 30),
      headline_3: truncate(`By ${companyName} | ${cta(2)}`, 30),
      description_1: truncate(
        `${companyName} provides ${usp(0)} ${industry} services tailored to your needs.`,
        90
      ),
      description_2: truncate(
        `${usp(1)} included. ${objective === 'conversion' ? 'Limited availability.' : 'Resources and guides available.'}`,
        90
      ),
      display_url: displayUrl
    },
    {
      headline_1: truncate(`${industry} Experts at ${companyName}`, 30),
      headline_2: truncate(`Solutions for ${targetAudience}`, 30),
      headline_3: truncate(cta(0), 30),
      description_1: truncate(
        `Looking for reliable ${industry} services? ${companyName} delivers ${usp(0)}.`,
        90
      ),
      description_2: truncate(
        `${usp(1)} is our priority. ${objective === 'conversion' ? 'Special offers available.' : 'Free resources available.'}`,
        90
      ),
      display_url: `${displayUrl}/about`
    }
  ];
}

