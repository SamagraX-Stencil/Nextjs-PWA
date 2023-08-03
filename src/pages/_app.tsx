"use client";
import "@component/styles/global.css";
import "@component/styles/tailwind.css";

import type { AppProps } from "next/app";
import {  useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [packageModule, setPackageModule] = useState<{
    OfflineSyncProvider: any | undefined;
  }>();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const packageModule = await import("offline-sync-handler-test");
        //@ts-ignore
        setPackageModule(packageModule);
      } catch (error) {
        console.error("Error loading the npm package:", error);
      }
    };

    fetchPackage();
  }, []);

  if (packageModule) {
    return (
      <packageModule.OfflineSyncProvider onStatusChange={(status:any)=>{
        console.log("---Status---",status)
      }}>
        <>v2
        <Component {...pageProps} />
        </>
      </packageModule.OfflineSyncProvider>
    );
  }

  return (
    <> v2
      <Component {...pageProps} />
    </>
  );
}
