import { useEffect } from "react"

const urlBase64ToUint8Array = (base64String: any) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

export default function useDebounce(callback: any, delay: any, dependencies: any) {
    useEffect(() => {
        (async () => {
            // const sw = await navigator.serviceWorker.ready;
            // const push = await sw.pushManager.subscribe({
            //     userVisibleOnly: true,
            //     // The `urlBase64ToUint8Array` is a utility function you need to implement
            //     // implement the `urlBase64ToUint8Array` function below


            //     applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY),
            // });

            // console.log(JSON.stringify(push))

            navigator.serviceWorker.addEventListener('message', (event) => {
                // console.log('Message from service worker:', event.data);
                // Handle the message
            });

        })();
    }, [])
}