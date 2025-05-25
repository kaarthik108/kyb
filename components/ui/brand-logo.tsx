"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

interface BrandLogoProps {
  brandName: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  showBorder?: boolean;
}

export function BrandLogo({ 
  brandName, 
  className = "h-8 w-8", 
  fallbackIcon,
  showBorder = true 
}: BrandLogoProps) {
  const [logoError, setLogoError] = useState(false);
  
  // Convert brand name to likely domain
  const getDomainFromBrand = (brand: string) => {
    const brandLower = brand.toLowerCase();
    
    // Common brand to domain mappings
    const brandDomainMap: { [key: string]: string } = {
      'tesla': 'tesla.com',
      'apple': 'apple.com',
      'microsoft': 'microsoft.com',
      'google': 'google.com',
      'amazon': 'amazon.com',
      'facebook': 'facebook.com',
      'meta': 'meta.com',
      'netflix': 'netflix.com',
      'spotify': 'spotify.com',
      'uber': 'uber.com',
      'airbnb': 'airbnb.com',
      'twitter': 'twitter.com',
      'linkedin': 'linkedin.com',
      'instagram': 'instagram.com',
      'youtube': 'youtube.com',
      'tiktok': 'tiktok.com',
      'snapchat': 'snapchat.com',
      'discord': 'discord.com',
      'slack': 'slack.com',
      'zoom': 'zoom.us',
      'salesforce': 'salesforce.com',
      'adobe': 'adobe.com',
      'nvidia': 'nvidia.com',
      'intel': 'intel.com',
      'amd': 'amd.com',
      'samsung': 'samsung.com',
      'sony': 'sony.com',
      'nintendo': 'nintendo.com',
      'coca cola': 'coca-cola.com',
      'pepsi': 'pepsi.com',
      'mcdonalds': 'mcdonalds.com',
      'starbucks': 'starbucks.com',
      'walmart': 'walmart.com',
      'target': 'target.com',
      'nike': 'nike.com',
      'adidas': 'adidas.com',
      'bmw': 'bmw.com',
      'mercedes': 'mercedes-benz.com',
      'toyota': 'toyota.com',
      'ford': 'ford.com',
      'volkswagen': 'volkswagen.com',
      'ibm': 'ibm.com',
      'oracle': 'oracle.com',
      'cisco': 'cisco.com',
      'hp': 'hp.com',
      'dell': 'dell.com',
      'lenovo': 'lenovo.com',
      'asus': 'asus.com',
      'lg': 'lg.com',
      'panasonic': 'panasonic.com',
      'philips': 'philips.com',
      'siemens': 'siemens.com',
      'ge': 'ge.com',
      'boeing': 'boeing.com',
      'airbus': 'airbus.com',
      'spacex': 'spacex.com',
      'nasa': 'nasa.gov',
      'reddit': 'reddit.com',
      'pinterest': 'pinterest.com',
      'tumblr': 'tumblr.com',
      'whatsapp': 'whatsapp.com',
      'telegram': 'telegram.org',
      'signal': 'signal.org',
      'dropbox': 'dropbox.com',
      'box': 'box.com',
      'github': 'github.com',
      'gitlab': 'gitlab.com',
      'bitbucket': 'bitbucket.org',
      'atlassian': 'atlassian.com',
      'jira': 'atlassian.com',
      'confluence': 'atlassian.com',
      'trello': 'trello.com',
      'asana': 'asana.com',
      'monday': 'monday.com',
      'notion': 'notion.so',
      'airtable': 'airtable.com',
      'figma': 'figma.com',
      'sketch': 'sketch.com',
      'canva': 'canva.com',
      'shopify': 'shopify.com',
      'woocommerce': 'woocommerce.com',
      'magento': 'magento.com',
      'wordpress': 'wordpress.com',
      'squarespace': 'squarespace.com',
      'wix': 'wix.com',
      'godaddy': 'godaddy.com',
      'namecheap': 'namecheap.com',
      'cloudflare': 'cloudflare.com',
      'aws': 'aws.amazon.com',
      'azure': 'azure.microsoft.com',
      'gcp': 'cloud.google.com',
      'digitalocean': 'digitalocean.com',
      'linode': 'linode.com',
      'vultr': 'vultr.com',
      'heroku': 'heroku.com',
      'vercel': 'vercel.com',
      'netlify': 'netlify.com'
    };
    
    // Check if we have a specific mapping
    if (brandDomainMap[brandLower]) {
      return brandDomainMap[brandLower];
    }
    
    // For other brands, try common patterns
    const cleanBrand = brandLower
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .replace(/inc|corp|ltd|llc|company|co/g, ''); // Remove common suffixes
    
    return `${cleanBrand}.com`;
  };

  const domain = getDomainFromBrand(brandName);
  const logoUrl = `https://logo.clearbit.com/${domain}`;

  if (logoError) {
    return (
      <div className={`${className} flex items-center justify-center ${showBorder ? 'rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30' : ''}`}>
        {fallbackIcon || <Building2 className="h-6 w-6 text-blue-400" />}
      </div>
    );
  }

  return (
    <div className={`${className} ${showBorder ? 'rounded-lg overflow-hidden bg-white/10 border border-white/20' : 'rounded-lg overflow-hidden'} flex items-center justify-center`}>
      <img
        src={logoUrl}
        alt={`${brandName} logo`}
        className="w-full h-full object-contain p-1"
        onError={() => setLogoError(true)}
        onLoad={() => setLogoError(false)}
      />
    </div>
  );
} 