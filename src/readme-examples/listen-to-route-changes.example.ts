import {myRouter} from './router-creation.example';

myRouter.listen(true, (routes) => {
    console.info(routes);
});
