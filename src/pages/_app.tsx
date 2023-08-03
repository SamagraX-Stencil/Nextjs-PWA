import "@component/styles/global.css";
import "@component/styles/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import {
  getFromLocalForage,
  offlineChecklist,
  onlineChecklist,
} from "@component/utils";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
// import { OfflineSyncProvider } from "offline-sync-handler";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.addEventListener("offline", offlineChecklist);
    return () => {
      window.removeEventListener("offline", offlineChecklist);
    };
  }, []);

  const syncOnline = async () => {
    const appOffline = await getFromLocalForage("appOffline");
    if (appOffline && navigator.onLine) {
      onlineChecklist();
    }
  };

  useEffect(() => {
    syncOnline();
  }, []);

  return (
    <>
      {/* @ts-ignore */}
      {/* <OfflineSyncProvider> */}
        <Component {...pageProps} />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="font-demi"
        />
      {/* </OfflineSyncProvider> */}
    </>
  );
}
