import UserList from '../pages/user/list/UserList';

const routes = {
  path: 'users',
  breadcrumbName: '用户',
  noBreadcrumbLink: true,
  indexRoute: {
    breadcrumbName: '用户列表',
    component: UserList
  },
  childRoutes: []
};

export default routes;


