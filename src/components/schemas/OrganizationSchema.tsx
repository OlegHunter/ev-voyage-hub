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
        "telephone": "+380-44-123-4567",
        "contactType": "Customer Service",
        "areaServed": "UA",
        "availableLanguage": ["Ukrainian", "Russian", "English"]
      },
      "sameAs": [
        "https://t.me/carhunter",
        "https://facebook.com/carhunter",
        "https://instagram.com/carhunter"
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "вул. Хрещатик, 1",
        "addressLocality": "Київ",
        "addressCountry": "UA"
      }
    })}
  </script>
);
