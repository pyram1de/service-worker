export default function registerWorker() : Promise<any> {
    if('serviceWorker' in navigator) {
        let refreshing: any;
        navigator.serviceWorker.addEventListener('controllerchange',
            () => {
                if (refreshing) {
                    return;
                }
                refreshing = true;
                window.location.reload();
            }
        );
        return navigator.serviceWorker
            .register('sw.js')
            .catch(err => console.log('we have an error', err));

    }
    return Promise.reject("not supported in this browser");
}


export function removeServiceWorkers() : Promise<any> {
    console.log('registration removeServiceWorkers');
    if('serviceWorker' in navigator) {
        return navigator.serviceWorker.getRegistrations().then((registrations) => {
            let promises = [];
            for(let reg of registrations) {
               promises.push(reg.unregister());
            }
            return Promise.all(promises);
        });
    }
    return Promise.reject("not supported in this browser");
}
