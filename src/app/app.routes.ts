import { Routes } from '@angular/router';
 //rutas de usuarios
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./business/login/login.component'),
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
         //rutas de parametros
   {
    path: 'parametros',
    loadComponent: () => import('./business/parametros/parametros.component'),
  },
  {
    path: 'actualizarParametros',
    loadComponent: () =>
      import('./business/parametros/actualizar/actualizar.component'),
  },
    ],
  },




  
// Redirige a login si no encuentra la ruta, dejar de ultima porfi :D
  {
    path: '**',
    redirectTo: 'login',
  },


 
];
