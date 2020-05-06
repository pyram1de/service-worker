export default function registerWorker() : Promise<any> {
    if('serviceWorker' in navigator) {
        let refreshing: any;
        navigator.serviceWorker.addEventListener('controllerchange',
            function() {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            }
        );
        return navigator.serviceWorker
            .register('sw.js')
            .catch(err => console.log('we have an error', err));

    }
    return Promise.resolve();
}
