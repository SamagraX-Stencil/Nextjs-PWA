import axios from "axios";
import localforage from "localforage";
import { toast } from "react-toastify";
import swal from "sweetalert";

export const getFromLocalForage = async (key: string) => {
  return await localforage.getItem(key);
};

export const setToLocalForage = async (key: string, value: any) => {
  await localforage.setItem(key, value);
};

const performOnlineSync = async () => {
  toast.info("App is back online ✅");
  await setToLocalForage("appOffline", false);

  let offlineSyncData: any =
    (await getFromLocalForage("offlineSyncData")) || [];

  if (offlineSyncData.length > 0) {
    while (offlineSyncData.length) {
      try {
        toast.promise(
          axios.request({
            method: offlineSyncData[0].method,
            url: offlineSyncData[0].endpoint,
            data: offlineSyncData[0].body,
            headers: offlineSyncData[0].headers,
          }),
          {
            pending: `Syncing ${offlineSyncData[0].id} with server`,
            success: `${offlineSyncData[0].id} synced with server 👌`,
            error: `Unable to sync ${offlineSyncData[0].id} with server 🤯`,
          }
        );
      } catch (err: any) {
        console.log(err);
        toast.error(err.message || err.toString());
      }
      offlineSyncData.shift();
    }
    await setToLocalForage("offlineSyncData", offlineSyncData);
  }
};

export const onlineChecklist = async () => {
  if ("requestIdleCallback()" in window) {
    requestIdleCallback(performOnlineSync);
  } else {
    performOnlineSync();
  }
};

export const offlineChecklist = async () => {  
  swal({
    text: "You are in offline mode",
    icon: "info",
  })
  toast.warn("App is now in offline mode");
  await setToLocalForage("appOffline", true);
};
