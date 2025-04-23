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
        canActivate: [AuthGuard],
      },
      {
        path: 'actualizar',
        loadComponent: () =>
          import('./business/usuarios/actualizar/actualizar.component'),
        canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
      },
      //rutas de parametros
      {
        path: 'registrarParametros',
        loadComponent: () =>
          import('./business/parametros/registrar/registrar.component'),
        canActivate: [AdmiGuard],
      },
      {
        path: 'parametros',
        loadComponent: () =>
          import('./business/parametros/parametros.component'),
        canActivate: [AdmiGuard],
      },
      {
        path: 'actualizarParametros',
        loadComponent: () =>
          import('./business/parametros/actualizar/actualizar.component'),
        canActivate: [AdmiGuard],
      },

      // Rutas de Permisos
      {
        path: 'permisos',
        loadComponent: () => import('./business/permisos/permisos.component'),
        canActivate: [AdmiGuard],
      },
      {
        path: 'registrar-permiso',
        loadComponent: () =>
          import(
            './business/permisos/registrar-permiso/registrar-permiso.component'
          ).then((m) => m.RegistrarPermisoComponent),
        canActivate: [AdmiGuard],
      },
      {
        path: 'actualizar-permiso',
        loadComponent: () =>
          import(
            './business/permisos/actualizar-permiso/actualizar-permiso.component'
          ),
        canActivate: [AdmiGuard],
      },

      // Rutas de Objetos
      {
        path: 'objetos',
        loadComponent: () => import('./business/objetos/objetos.component'),
        canActivate: [AdmiGuard],
      },
      {
        path: 'registrar-objeto',
        loadComponent: () =>
          import(
            './business/objetos/registrar-objeto/registrar-objeto.component'
          ).then((m) => m.RegistrarObjetoComponent),
        canActivate: [AdmiGuard],
      },
      {
        path: 'actualizar-objeto',
        loadComponent: () =>
          import(
            './business/objetos/actualizar-objeto/actualizar-objeto.component'
          ),
        canActivate: [AdmiGuard],
      },

      //Rutas de Roles

      {
        path: 'roles',
        loadComponent: () => import('./business/roles/roles.component'),
        canActivate: [AdmiGuard],
      },
      {
        path: 'registrar-rol',
        loadComponent: () =>
          import('./business/roles/registrar-rol/registrar-rol.component').then(
            (m) => m.RegistrarRolComponent
          ),
        canActivate: [AdmiGuard],
      },
      {
        path: 'actualizar-rol',
        loadComponent: () =>
          import('./business/roles/actualizar-rol/actualizar-rol.component'),
        canActivate: [AdmiGuard],
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
          import(
            './business/UNAH/facultad/actualizar-facultad/actualizar-facultad.component'
          ),
      },

      {
        path: 'registrar-facultad',
        loadComponent: () =>
          import(
            './business/UNAH/facultad/registrar-facultad/registrar-facultad.component'
          ).then((m) => m.RegistrarFacultadComponent),
      },

      // Rutas de Tipo Documento
      {
        path: 'tipo-documento',
        loadComponent: () =>
          import(
            './business/documentos/tipo_documento/tipo-documento.component'
          ),
      },
      {
        path: 'registrar-tipo-documento',
        loadComponent: () =>
          import(
            './business/documentos/tipo_documento/registrar-tipo-documento/registrar-tipo-documento.component'
          ).then((m) => m.RegistrarTipoDocumentoComponent),
      },
      {
        path: 'actualizar-tipo-documento',
        loadComponent: () =>
          import(
            './business/documentos/tipo_documento/actualizar-tipo-documento/actualizar-tipo-documento.component'
          ),
      },

      // RUTAS ESTRUCTURA ARCHIVOS
      {
        path: 'estructura_archivos',
        loadComponent: () =>
          import(
            './business/documentos/estructura_archivos/estructura-archivos.component'
          ),
      },
      {
        path: 'registrar-estructura-archivos',
        loadComponent: () =>
          import(
            './business/documentos/estructura_archivos/registrar-estructura-archivos/registrar-estructura-archivos.component'
          ).then((m) => m.RegistrarEstructuraArchivosComponent),
      },
      {
        path: 'actualizar-estructura-archivos',
        loadComponent: () =>
          import(
            './business/documentos/estructura_archivos/actualizar-estructura-archivos/actualizar-estructura-archivos.component'
          ),
      },

      //RUTAS ESTADO

      {
        path: 'estado',
        loadComponent: () => import('./business/estado/estado.component'),
      },
      {
        path: 'registrar-estado',
        loadComponent: () =>
          import(
            './business/estado/registrar-estado/registrar-estado.component'
          ).then((m) => m.RegistrarEstadoComponent),
      },
      {
        path: 'actualizar-estado',
        loadComponent: () =>
          import(
            './business/estado/actualizar-estado/actualizar-estado.component'
          ),
      },
      //rutas clases
      {
        path: 'clases',
        loadComponent: () =>
          import('./business/UNAH/Clase/clase.component').then(
            (m) => m.ClaseComponent
          ),
        canActivate: [AuthGuard],
      },
      //rutsa tipo caracteristica
      {
        path: 'tipo-caracteristica',
        loadComponent: () =>
          import(
            './business/tipo_caracteristica/tipo-caracteristica.component'
          ).then((m) => m.TipoCaracteristicaComponent),
        canActivate: [AuthGuard],
      },
      //rutas de categoria
      {
        path: 'categoria',
        loadComponent: () =>
          import('./business/categoria/categoria.component').then(
            (m) => m.CategoriaComponent
          ),
        canActivate: [AuthGuard],
      },
      //rutas de sub_categoria
      {
        path: 'sub-categoria',
        loadComponent: () =>
          import('./business/sub_categoria/sub-categoria.component').then(
            (m) => m.SubCategoriaComponent
          ),
        canActivate: [AuthGuard],
      },
            //rutas de tipo archivo
            {
              path: 'TipoArchivo',
              loadComponent: () =>
                import('./business/tipo-archivo/tipo-archivo.component').then(
                  (m) => m.TipoArchivoComponent
                ),
              canActivate: [AuthGuard],
            },
      
    ],
  },

  // Redirige a login si no encuentra la ruta, dejar de ultima porfi :D
  {
    path: '**',
    redirectTo: 'login',
  },
];
