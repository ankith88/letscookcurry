export {};

declare global {
  interface Window {
    gtag?: (
      event: 'config',
      gtmId: string,
      config: {
        page_path: URL;
      }
    ) => void;
  }
}
