import { Routes } from '@angular/router';

export const routes: Routes = [
  //rutas de usuarios
  {
    path: 'login',
    loadComponent: () => import('./business/login/login.component'),
  },

  {
    path: 'registrar',
    loadComponent: () =>
      import('./business/usuarios/registrar/registrar.component'),
  },
  {
    path: 'actualizar',
    loadComponent: () =>
      import('./business/usuarios/actualizar/actualizar.component'),
  },
  {
    path: 'recuperarContra',
    loadComponent: () =>
      import('./business/login/recuperarcontrasena/recuperarcontrasena.component'),
  },
  {
    path: 'ResetContrasena',
    loadComponent: () =>
      import('./business/login/rest-contrasena/rest-contrasena.component'),
  },
  // Redirige el path vacío al Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  //rutas shared
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'dhashboard',
        loadComponent: () =>
          import('./business/dhashboard/dhashboard.component'),
      },

      {
        path: 'perfil',
        loadComponent: () => import('./business/perfil/perfil.component'),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./business/usuarios/usuarios.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
