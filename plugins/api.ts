// import {$fetch, FetchOptions} from 'ohmyfetch';
import {defineNuxtPlugin} from '#app';

import Queries from '~/composables/queries';

export default defineNuxtPlugin(() => {

    return {
        provide: {
            api: new Queries('https://agri-geo-data-gate.karnott.fr', '9b2bb3ed-8373-4159-806e-fc2d8d5ac410'),
        },
    };
});
