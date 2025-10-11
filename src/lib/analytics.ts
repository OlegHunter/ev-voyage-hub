// Analytics helper functions for GA4 and GTM dataLayer events

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params
    });
  }
};

export const trackLeadSubmit = (leadData: {
  lead_type: string;
  car_id?: string;
  source_page: string;
}) => {
  trackEvent('lead_submit', leadData);
};

export const trackCalculatorUse = (calculatorType: string) => {
  trackEvent('calculator_use', { calculator_type: calculatorType });
};

export const trackCalculatorResult = (result: {
  calculator_type: string;
  vehicle_price?: number;
  monthly_payment?: number;
}) => {
  trackEvent('calculator_result', result);
};

export const trackViewItem = (item: {
  item_id: string;
  item_name: string;
  price: number;
  item_category: string;
}) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: item.price,
    items: [item]
  });
};

export const trackAddToWishlist = (item: {
  item_id: string;
  item_name: string;
}) => {
  trackEvent('add_to_wishlist', item);
};

export const trackVideoPlay = (videoUrl: string) => {
  trackEvent('video_play', { video_url: videoUrl });
};

export const trackCTAClick = (ctaName: string, ctaLocation: string) => {
  trackEvent('cta_click', { cta_name: ctaName, cta_location: ctaLocation });
};
