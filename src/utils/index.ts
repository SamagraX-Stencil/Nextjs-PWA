import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { sha256 } from "js-sha256";
import localforage from "localforage";
import { toast } from "react-toastify";
// Program to generate random strings

// declare all characters
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#*!";

function generateString(length: number) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const getCodeChallenge = () => {
  const codeVerifier = generateString(10) + Date.now();
  setCookie("code_verifier", codeVerifier);
  const encryptedSha256 = sha256(codeVerifier);
  let encryptedbase64 = btoa(encryptedSha256);
  encryptedbase64 = encryptedbase64.replace(/=/g, ""); // Remove any trailing '='
  encryptedbase64 = encryptedbase64.replace(/\+/g, "-"); // Replace '+' with '-'
  encryptedbase64 = encryptedbase64.replace(/\//g, "_"); // Replace '/' with '_'
  return encryptedbase64;
};

export const getFromLocalForage = async (key) => {
  return await localforage.getItem(key);
};

export const setToLocalForage = async (key, value) => {
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
      } catch (err) {
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
  toast.warn("App is now in offline mode");
  await setToLocalForage("appOffline", true);
};
