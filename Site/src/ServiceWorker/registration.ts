export default function registerServiceWorker() : Promise<any> {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            // This fires when the service worker controlling this page
            // changes, eg a new worker has skipped waiting and become
            // the new active worker.
            console.log('Update happened');
        });
        return navigator.serviceWorker
            .register('sw.js')
            .then(reg => {
                reg.addEventListener('updatefound', () => {
                    // A wild service worker has appeared in reg.installing!
                    const newWorker = reg.installing;
                    if(newWorker){

                    newWorker.state;
                    // "installing" - the install event has fired, but not yet complete
                    // "installed"  - install complete
                    // "activating" - the activate event has fired, but not yet complete
                    // "activated"  - fully active
                    // "redundant"  - discarded. Either failed install, or it's been
                    //                replaced by a newer version

                    newWorker.addEventListener('statechange', () => {
                        // newWorker.state has changed
                        console.log('state changed', newWorker);
                    });
                    }
                });
                return reg;
            })
            .catch(err => console.log('we have an error', err));

    }
    return Promise.resolve();
}
