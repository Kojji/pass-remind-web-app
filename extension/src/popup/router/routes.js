export default [
  {
    path: '/',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/main',
    component: () => import('../pages/Index'),
  },
  {
    path: '/criar-senha',
    component: () => import('../pages/CriarSenha'),
  },
  {
    path: '/editar-senha',
    component: () => import('../pages/EditarSenha'),
  },
];
