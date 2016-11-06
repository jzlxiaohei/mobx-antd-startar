import Layout from '../layout/Layout';
import users from './users';


//TODO: support rules config. if have no permission; remove from routes

const routes = {
  path:'/',
  component:Layout,
  childRoutes:[
    users,
  ]
};

export default routes
