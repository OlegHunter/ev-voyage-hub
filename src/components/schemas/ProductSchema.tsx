interface ProductSchemaProps {
  car: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price_usd: number;
    images?: string[];
    status?: string;
    specs?: any;
  };
}

export const ProductSchema = ({ car }: ProductSchemaProps) => {
  const productUrl = `https://www.car-hunter.com.ua/catalog/${car.id}`;
  
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${car.brand} ${car.model} ${car.year}`,
        "image": car.images || [],
        "description": `${car.brand} ${car.model} ${car.year} - електромобіль з Китаю під ключ`,
        "brand": {
          "@type": "Brand",
          "name": car.brand
        },
        "offers": {
          "@type": "Offer",
          "url": productUrl,
          "priceCurrency": "USD",
          "price": car.price_usd,
          "availability": car.status === 'InStock' 
            ? "https://schema.org/InStock" 
            : "https://schema.org/PreOrder",
          "seller": {
            "@type": "Organization",
            "name": "CarHunter™"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150"
        }
      })}
    </script>
  );
};
