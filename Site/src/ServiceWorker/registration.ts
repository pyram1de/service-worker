if('serviceWorker' in navigator) {
    setTimeout(() => {
        navigator.serviceWorker
            .register('sw.js')
            .then(() => {
                console.log('loaded?');
            })
            .catch(err => console.log('we have an error', err));
    }, 5000);
}
