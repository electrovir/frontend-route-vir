import {myRouter} from './router-creation.example.js';

myRouter.listen(true, (routes) => {
    console.info(routes);
});
