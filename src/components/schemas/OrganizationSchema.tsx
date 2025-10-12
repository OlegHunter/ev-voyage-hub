export const OrganizationSchema = () => (
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CarHunter™",
      "url": "https://www.car-hunter.com.ua",
      "logo": "https://www.car-hunter.com.ua/logo.png",
      "description": "Підбір, викуп і доставка електромобілів з Китаю під ключ в Україну",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+380-93-263-92-62",
        "contactType": "Customer Service",
        "areaServed": "UA",
        "availableLanguage": ["Ukrainian", "Russian", "English"]
      },
      "email": "carhunterhub@gmail.com",
      "sameAs": [
        "https://t.me/carhunter_ua",
        "https://facebook.com/carhunter",
        "https://instagram.com/carhunter"
      ],
      "address": [
        {
          "@type": "PostalAddress",
          "streetAddress": "пров. Катаєва, 2а",
          "addressLocality": "Одеса",
          "addressCountry": "UA"
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "ТРЦ Республіка",
          "addressLocality": "Київ",
          "addressCountry": "UA"
        }
      ]
    })}
  </script>
);
