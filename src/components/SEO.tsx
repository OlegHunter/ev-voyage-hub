import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage, 
  type = 'website' 
}: SEOProps) => {
  const siteUrl = 'https://www.car-hunter.com.ua';
  const fullTitle = `${title} | CarHunter™`;
  const defaultImage = `${siteUrl}/og-image.jpg`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical || siteUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical || siteUrl} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:site_name" content="CarHunter™" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
    </Helmet>
  );
};
