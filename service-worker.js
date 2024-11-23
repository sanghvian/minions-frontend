// service-worker.js

self.addEventListener('push', (event) => {
    const data = event.data.json();
    // console.log('Push event received:', data);

    const title = 'Push Notification Title';
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});


// service-worker.js

self.addEventListener('push', (event) => {
    const data = event.data.json();
    // console.log('Push event received:', data);

    const title = 'Push Notification Title';
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png',
    };

    event.waitUntil(self.registration.showNotification(title, options));
});