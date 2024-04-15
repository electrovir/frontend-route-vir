import {myRouter} from './router-creation.example';

document.getElementsByTagName('a')[0]!.href = myRouter.createRouteUrl({
    paths: [
        'gallery',
        'gallery-id-here',
    ],
});
