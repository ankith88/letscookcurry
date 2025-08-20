
export {};

declare global {
  interface Window {
    gtag?: (
      event: 'config' | 'event',
      gtmId: string,
      config: {
        page_path?: URL;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}
