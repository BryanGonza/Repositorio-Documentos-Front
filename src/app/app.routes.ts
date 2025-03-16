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
      import(
        './business/login/recuperarcontrasena/recuperarcontrasena.component'
      ),
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

    // Rutas de Permisos
    {
      path: 'permisos',
      loadComponent: () =>
        import('./business/permisos/permisos.component'),
    },
    {
    path: 'registrar-permiso',
    loadComponent: () =>
      import('./business/permisos/registrar-permiso/registrar-permiso.component').then(m => m.RegistrarPermisoComponent)
    },
    {
    path: 'actualizar-permiso',
    loadComponent: () =>
      import('./business/permisos/actualizar-permiso/actualizar-permiso.component')
    },

     // Rutas de Objetos
     {
      path: 'objetos',
      loadComponent:() =>
        import('./business/objetos/objetos.component'),
    },
    {
      path:'registrar-objeto',
      loadComponent: () =>
        import('./business/objetos/registrar-objeto/registrar-objeto.component') .then(m => m.RegistrarObjetoComponent)
    },
    {
     path: 'actualizar-objeto',
     loadComponent: () =>
      import('./business/objetos/actualizar-objeto/actualizar-objeto.component') ,
    },

     //Rutas de Roles

     {
      path: 'roles',
      loadComponent: () =>
        import('./business/roles/roles.component'),
    },
    {
      path: 'registrar-rol',
      loadComponent: () =>
        import('./business/roles/registrar-rol/registrar-rol.component').then(m => m.RegistrarRolComponent)
    },
    {
      path: 'actualizar-rol',
      loadComponent: () =>
        import('./business/roles/actualizar-rol/actualizar-rol.component'),
      
    },

    //Rutas para subir un documento
    {
      path: 'subir_documentos',
      loadComponent: () =>
        import('./business/subir-documentos/subir-documentos.component').then(m => m.SubirDocumentosComponent)
    },

    ],
    
  },

  // Redirige a login si no encuentra la ruta, dejar de ultima porfi :D
  {
    path: '**',
    redirectTo: 'login',
  },
];
