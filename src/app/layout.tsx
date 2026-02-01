//React Plugins Imports
import type { Metadata, Viewport } from "next";

//Import Data File 
import metaData from '@/utilities/data/metadata';

//Custom CSS Imports
import "@/styles/globals.scss";

//Ant Design Setup
// import '@/app/antd-compat';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ProgressBarProvider } from "@/components/shared/ProgressBarProvider";
import { ThemeProvider } from "@/theme/themeContext";

//Redux Provider
import { ReduxProvider } from "@/components/shared/ReduxProvider";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

//React Query Provider
import { QueryProvider } from "@/components/shared/QueryProvider";

//Warning Components
// import ClientSuppressWarning from "@/components/shared/ClientSuppressWarning";

//Meta data Configurations 
export const metadata: Metadata = {
  title: metaData.default.title,
  description: metaData.default.description,
};

//Viewport Configurations
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

//Component Function 
function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ErrorBoundary>
          <ReduxProvider>
            <QueryProvider>
              <AntdRegistry>
                <ThemeProvider>
                  <ProgressBarProvider>
                    {/* <ClientSuppressWarning /> */}
                    {children}
                  </ProgressBarProvider>
                </ThemeProvider>
              </AntdRegistry>
            </QueryProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

//Export Function 
export default RootLayout;
