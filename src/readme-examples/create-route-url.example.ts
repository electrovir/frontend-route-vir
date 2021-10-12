import {superBasicRouter} from './router-creation.example';

document.getElementsByTagName('a')[0]!.href = superBasicRouter.createRoutesUrl([
    'page1',
    'sub-page',
]);
