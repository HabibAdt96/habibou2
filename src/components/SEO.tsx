import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ 
  title = "Habibou — Comparez les prix en Algérie", 
  description = "Habibou est le plus grand comparateur de prix en Algérie. Trouvez le meilleur prix pour smartphones, PC, électroménager.", 
  keywords = "comparateur prix algérie, prix algérie, meilleur prix, smartphones algérie, ouedkniss prix",
  image = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200&auto=format&fit=crop",
  url = "https://habibou.com",
  type = "website"
}: SEOProps) {
  const fullTitle = title.includes("Habibou") ? title : `${title} — Habibou`;

  return (
    <Helmet>
      {/* Base metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="fr_DZ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
