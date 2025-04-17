import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdmiGuard } from './guards/Adm.guard';
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
        canActivate: [AuthGuard]
      },
      {
        path: 'actualizar',
        loadComponent: () =>
          import('./business/usuarios/actualizar/actualizar.component'),
        canActivate: [AuthGuard]
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
        canActivate: [AuthGuard]
        
      },
      //rutas de parametros
      {
        path: 'registrarParametros',
        loadComponent: () =>
          import('./business/parametros/registrar/registrar.component'),
        canActivate: [AdmiGuard]
      },
      {

        path: 'parametros',
        loadComponent: () =>
          import('./business/parametros/parametros.component'),
        canActivate: [AdmiGuard]
      },
      {
        path: 'actualizarParametros',
        loadComponent: () =>
          import('./business/parametros/actualizar/actualizar.component'),
        canActivate: [AdmiGuard]
      },

      // Rutas de Permisos
      {
        path: 'permisos',
        loadComponent: () => import('./business/permisos/permisos.component'),
        canActivate: [AdmiGuard]
      },
      {
        path: 'registrar-permiso',
        loadComponent: () =>
          import(
            './business/permisos/registrar-permiso/registrar-permiso.component'
          ).then((m) => m.RegistrarPermisoComponent),
          canActivate: [AdmiGuard]
      },
      {
        path: 'actualizar-permiso',
        loadComponent: () =>
          import(
            './business/permisos/actualizar-permiso/actualizar-permiso.component'
          ),
          canActivate: [AdmiGuard]
      },

      // Rutas de Objetos
      {
        path: 'objetos',
        loadComponent: () => import('./business/objetos/objetos.component'),
        canActivate: [AdmiGuard]
      },
      {
        path: 'registrar-objeto',
        loadComponent: () =>
          import(
            './business/objetos/registrar-objeto/registrar-objeto.component'
          ).then((m) => m.RegistrarObjetoComponent),
          canActivate: [AdmiGuard]
      },
      {
        path: 'actualizar-objeto',
        loadComponent: () =>
          import(
            './business/objetos/actualizar-objeto/actualizar-objeto.component'
          ),
          canActivate: [AdmiGuard]
      },

      //Rutas de Roles

      {
        path: 'roles',
        loadComponent: () => import('./business/roles/roles.component'),
        canActivate: [AdmiGuard]
      },
      {
        path: 'registrar-rol',
        loadComponent: () =>
          import('./business/roles/registrar-rol/registrar-rol.component').then(
            (m) => m.RegistrarRolComponent
          ),
          canActivate: [AdmiGuard]
      },
      {
        path: 'actualizar-rol',
        loadComponent: () =>
          import('./business/roles/actualizar-rol/actualizar-rol.component'),
        canActivate: [AdmiGuard]
      },

      //Rutas para subir un documento
      {
        path: 'subir_documentos',
        loadComponent: () =>
          import('./business/subir-documentos/subir-documentos.component').then(
            (m) => m.SubirDocumentosComponent
          ),
      },
      {
        path: 'Documentos',
        loadComponent: () =>
          import('./business/documentos/documentos.component'),
      },

        // RUTAS DE FACULTAD
      {
        path: 'facultad',
        loadComponent: () =>
          import('./business/UNAH/facultad/facultad.component'),
      },
      
      {
        path: 'actualizar-facultad',
        loadComponent: () =>
          import('./business/UNAH/facultad/actualizar-facultad/actualizar-facultad.component'),
      },

      {
        path: 'registrar-facultad',
        loadComponent: () =>
          import('./business/UNAH/facultad/registrar-facultad/registrar-facultad.component').then(
            (m) => m.RegistrarFacultadComponent
          ),
      },

      // Rutas de Tipo Documento
      {
        path: 'tipo-documento',
        loadComponent: () =>
          import('./business/documentos/tipo_documento/tipo-documento.component'),
      },
      {
        path: 'registrar-tipo-documento',
        loadComponent: () =>
          import('./business/documentos/tipo_documento/registrar-tipo-documento/registrar-tipo-documento.component').then(
            (m) => m.RegistrarTipoDocumentoComponent),
      },
      {
        path: 'actualizar-tipo-documento',
        loadComponent: () =>
          import ('./business/documentos/tipo_documento/actualizar-tipo-documento/actualizar-tipo-documento.component')
      }
    ],
  },



  // Redirige a login si no encuentra la ruta, dejar de ultima porfi :D
  {
    path: '**',
    redirectTo: 'login',
  },
];
