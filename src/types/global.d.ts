// Extend the Window interface to include our global variables
declare global {
  interface Window {
    __ERP_FIRST_TIME_USER__?: boolean;
  }
}

export {};
