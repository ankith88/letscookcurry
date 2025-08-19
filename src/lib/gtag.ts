import { GTM_ID } from './firebase';

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('config', GTM_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
    if (typeof window.gtag !== 'function') {
        return;
    }
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};
