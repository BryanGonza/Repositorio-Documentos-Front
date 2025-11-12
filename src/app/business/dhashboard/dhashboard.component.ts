import { Component, inject } from '@angular/core';
import { DocumentosService } from '../../services/documentos.service';
import { Router } from '@angular/router';
import { documento, ResponseDocumetos } from '../../interfaces/Documentos/Documetos';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../shared.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { FormatDatePipe } from '../../format-date.pipe';
import { ObjetoPermiso } from '../../interfaces/Objetos/Objetos';
import { PermisosService } from '../../services/permisos.service';
import { ObjetosService } from '../../services/objetos.service';
import { Documento } from '../../interfaces/Documentos/detalles';
import {
  CaracteristicaDocumento,
  TipoDocCaracteService,
} from '../../services/tipo-doc-caracte.service';
import { forkJoin } from 'rxjs';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { CaracteristicaService } from '../../services/caracteristica.service';

@Component({
  selector: 'app-dhashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './dhashboard.component.html',
  styleUrl: './dhashboard.component.css',
})
export default class DhashboardComponent {
  private docService = inject(DocumentosService);
  private route = inject(Router);
  private documentosService = inject(DocumentosService);
  totalDocumentos: number = 0;
  crecimiento: number = 0;
  documentosHoy: number = 0;
  crecimientoHoy: number = 0;

  usuariosActivos: number = 0;
  crecimientoUsuarios: number = 0;

  totalTusDocumentos: number = 0;
crecimientoTusDocs: number = 0;

  // Paginación
  public filteredUsers: documento[] = [];
  public paginatedUsers: documento[] = [];
  public ListUs: documento[] = [];
  public searchQuery: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 5;
  public totalPages: number = 1;
  public usuario: Usuarios | null = null;
  private sharedService = inject(SharedService);
  private objetoser = inject(ObjetosService);
  private TipoDocCaracteService = inject(TipoDocCaracteService);
  private caracteristicaService = inject(CaracteristicaService);
  public todasCaracts: CaracteristicaDocumento[] = [];
  private usuarioService = inject(UsuariosService);


  //permisos
  public tiposDocumentos: {
    ID_TIPO_DOCUMENTO: number;
    TIPO_DOCUMENTO: string;
  }[] = [];
  public selectedTipo: number | null = null;
  objetos: ObjetoPermiso[] = [];
  token: string =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  constructor() {}
  ngOnInit() {
     this.cargarDoumentos();
      this.cargarDocumentoshoy();
      this.cargarUsuarios();
    this.caracteristicaService.cget().subscribe({
      next: (res) => {
        const list =
          res.Listado_Caracteristicas || res.Listado_Caracteristicas || [];
        // normaliza ID_TIPO_CARACTERISTICA a number
        this.todasCaracts = list.map((c: any) => ({
          ...c,
          ID_TIPO_CARACTERISTICA: Number(c.ID_TIPO_CARACTERISTICA),
        }));
      },
      error: (e) => console.error('Error cargando características', e),
    });

    this.cargarTiposDocumento();
    if (typeof window !== 'undefined') {
      const shouldReload = localStorage.getItem('reloadAfterLogin');
      if (shouldReload === 'true') {
        localStorage.setItem('reloadAfterLogin', 'false');
        window.location.reload();
      }
    } else {
      const correo = this.sharedService.getCorreo();
      if (correo) {
        this.usuarioService.perfil({ email: correo }).subscribe({
          next: (data) => {
            this.usuario = data;
            if (this.usuario?.ID_USUARIO) {
              this.cargarDocumentos(this.usuario.ID_USUARIO);
            }
          },
          error: (err) => {
            console.error('Error al cargar el perfil:', err);
          },
        });
      }
    }
    this.cargarDatos();
    this.getObjetosConPermisos();
  }
// ------------------- DOCUMENTOS --------------------
cargarDoumentos(): void {
    this.documentosService.DocumetosGet().subscribe({
      next: (response: ResponseDocumetos) => {
        const lista = response.ListDocume || [];
        this.totalDocumentos = lista.length;

        // Extraemos las fechas
        const ahora = new Date();
        const mesActual = ahora.getMonth(); 
        const anioActual = ahora.getFullYear();

        // Contamos documentos de este mes
        const docsMesActual = lista.filter(d => {
          const fecha = new Date(d.FECHA_SUBIDA);
          return (
            fecha.getMonth() === mesActual &&
            fecha.getFullYear() === anioActual
          );
        }).length;

        // Contamos documentos del mes pasado
        const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
        const anioMesPasado = mesActual === 0 ? anioActual - 1 : anioActual;

        const docsMesPasado = lista.filter(d => {
          const fecha = new Date(d.FECHA_SUBIDA);
          return (
            fecha.getMonth() === mesPasado &&
            fecha.getFullYear() === anioMesPasado
          );
        }).length;

        // Calcular porcentaje
        if (docsMesPasado > 0) {
          this.crecimiento = ((docsMesActual - docsMesPasado) / docsMesPasado) * 100;
        } else {
          this.crecimiento = 0;
        }
      },
      error: (err) => {
        console.error('Error al obtener documentos', err);
      }
    });
  }

  cargarDocumentoshoy(): void {
    this.documentosService.DocumetosGet().subscribe({
      next: (response: ResponseDocumetos) => {
        const lista = response.ListDocume || [];
        this.totalDocumentos = lista.length;

        const hoy = new Date();
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);

        // Normalizamos fechas 
        const esMismoDia = (f1: Date, f2: Date) =>
          f1.getDate() === f2.getDate() &&
          f1.getMonth() === f2.getMonth() &&
          f1.getFullYear() === f2.getFullYear();

        // Documentos de hoy
        const docsHoy = lista.filter(d => {
          const fecha = new Date(d.FECHA_SUBIDA);
          return esMismoDia(fecha, hoy);
        }).length;

        // Documentos de ayer
        const docsAyer = lista.filter(d => {
          const fecha = new Date(d.FECHA_SUBIDA);
          return esMismoDia(fecha, ayer);
        }).length;

        this.documentosHoy = docsHoy;

        // Calcular % de crecimiento
        if (docsAyer > 0) {
          this.crecimientoHoy = ((docsHoy - docsAyer) / docsAyer) * 100;
        } else {
          this.crecimientoHoy = docsHoy > 0 ? 100 : 0; // si ayer no hubo y hoy sí
        }
      },
      error: (err) => {
        console.error('Error al obtener documentos', err);
      }
    });
  }
  // ------------------- USUARIOS --------------------
  cargarUsuarios(): void {
    this.usuarioService.usuariosget().subscribe({
      next: (response) => {
        const lista = response.ListUsuarios || [];

        // Filtramos los usuarios activos
        const activos = lista.filter(u =>
          u.ESTADO_USUARIO?.toLowerCase() === 'activo'
        );

        this.usuariosActivos = activos.length;

        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const anioActual = ahora.getFullYear();

        const mesPasado = mesActual === 0 ? 11 : mesActual - 1;
        const anioPasado = mesActual === 0 ? anioActual - 1 : anioActual;

        const usuariosMesActual = activos.filter(u => {
          const f = new Date(u.FECHA_CREACION);
          return f.getMonth() === mesActual && f.getFullYear() === anioActual;
        }).length;

        const usuariosMesPasado = activos.filter(u => {
          const f = new Date(u.FECHA_CREACION);
          return f.getMonth() === mesPasado && f.getFullYear() === anioPasado;
        }).length;

        if (usuariosMesPasado > 0) {
          this.crecimientoUsuarios = ((usuariosMesActual - usuariosMesPasado) / usuariosMesPasado) * 100;
        } else {
          this.crecimientoUsuarios = usuariosMesActual > 0 ? 100 : 0;
        }
      },
      error: (err) => console.error('Error al obtener usuarios', err),
    });
  }
  getObjetosConPermisos(): void {
    this.objetoser.getObjetosPermiss(this.token).subscribe({
      next: (data) => {
        this.objetos = data;

        console.log('Objetos con permisos:', this.objetos);
      },
      error: (err) => {
        console.error('Error al obtener objetos:', err);
      },
    });
  }
  getPermiso(accion: string): boolean {
    // Busca en el array el objeto cuyo TIPO_OBJETO (normalizado) coincida con la acción
    const permiso = this.objetos.find(
      (o) => (o.TIPO_OBJETO || '').trim().toLowerCase() === accion.toLowerCase()
    );
    return permiso ? permiso.allowed : false;
  }
  private cargarDatos(): void {
    const correo = this.sharedService.getCorreo();
    if (correo) {
      this.usuarioService.perfil({ email: correo }).subscribe({
        next: (data) => {
          this.usuario = data;
          if (this.usuario?.ID_USUARIO) {
            this.cargarDocumentos(this.usuario.ID_USUARIO);
          }
        },
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
        },
      });
    }
  }
cargarDocumentos(idUsuario: number) {
  this.docService.getDocumentosUser(idUsuario).subscribe({
    next: (data) => {
      if (data && data.ListDocume && Array.isArray(data.ListDocume)) {
        this.ListUs = data.ListDocume;
        this.filteredUsers = data.ListDocume;
        this.updatePagination();

        // ✅ Total de documentos
        this.totalTusDocumentos = this.ListUs.length;

        // ✅ Calcular porcentaje solo si hay fechas
        const docsConFecha = this.ListUs.filter((d: any) => d.FECHA_SUBIDA);

        if (docsConFecha.length > 0) {
          const hoy = new Date();
          const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
          const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
          const finMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

          const docsMesActual = docsConFecha.filter((d: any) => {
            const f = new Date(d.FECHA_SUBIDA);
            return f >= inicioMes;
          }).length;

          const docsMesPasado = docsConFecha.filter((d: any) => {
            const f = new Date(d.FECHA_SUBIDA);
            return f >= inicioMesPasado && f <= finMesPasado;
          }).length;

          if (docsMesPasado > 0) {
            this.crecimientoTusDocs = ((docsMesActual - docsMesPasado) / docsMesPasado) * 100;
          } else {
            this.crecimientoTusDocs = docsMesActual > 0 ? 100 : 0;
          }
        } else {
          this.crecimientoTusDocs = 0;
        }

      } else {
        console.warn('ListDocume está vacío o no es un array:', data);
        this.ListUs = [];
        this.filteredUsers = [];
        this.totalTusDocumentos = 0;
        this.crecimientoTusDocs = 0;
      }
    },
    error: (err) => {
      console.error('Error cargando documentos:', err);
      this.totalTusDocumentos = 0;
      this.crecimientoTusDocs = 0;
    }
  });
}
  filterUsers() {
    const q = this.searchQuery.toLowerCase();
    this.filteredUsers = this.ListUs.filter((u) => {
      const matchesText =
        u.NOMBRE.toLowerCase().includes(q) ||
        u.DESCRIPCION.toLowerCase().includes(q) ||
        u.FECHA_SUBIDA.toLowerCase().includes(q);

      const matchesTipo =
        this.selectedTipo == null
          ? true
          : u.ID_TIPO_DOCUMENTO === this.selectedTipo;

      return matchesText && matchesTipo;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  descargarArchivo(url: string, nombre: string): void {
    // Crear un enlace temporal
    const link = document.createElement('a');
    link.href = url; // Usar la URL de descarga
    link.download = nombre; // Nombre del archivo descargado
    link.style.display = 'none'; // Ocultar el enlace

    // Agregar el enlace al DOM
    document.body.appendChild(link);

    // Simular clic en el enlace
    link.click();

    // Eliminar el enlace temporal
    document.body.removeChild(link);

    // Manejar errores
    link.onerror = () => {
      console.error('Error al descargar el archivo.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo descargar el archivo.',
        confirmButtonText: 'Aceptar',
      });
    };
  }

  verArchivo(url: string): void {
    if (!url) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró un enlace de descarga para este documento.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  eliminarDocumento(idDocumento: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.docService.eliminarDcoumento(idDocumento).subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: res.msg || 'El usuario ha sido eliminado exitosamente.',
              confirmButtonColor: '#3085d6',
            });

            this.ListUs = this.ListUs.filter(
              (user) => user.ID_DOCUMENTO !== idDocumento
            );
            this.filteredUsers = this.filteredUsers.filter(
              (user) => user.ID_DOCUMENTO !== idDocumento
            );
            this.updatePagination();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text:
                err.error?.msg || 'Ocurrió un error al eliminar el documento.',
              confirmButtonColor: '#d33',
            });
          },
        });
      }
    });
  }
  mostrarModalDetalles: boolean = false;
  caracteristicasDinamicas: CaracteristicaDocumento[] = [];
  nombreDepartamento = '';
  idDepartamento = 0;
  tipoDocumento = '';
  idTipoDocumento = 0;

  detelles(idDocumento: number) {
    this.TipoDocCaracteService.getDetalleCaracteristicasDocumento(
      idDocumento
    ).subscribe({
      next: (caracteristicas) => {
        if (caracteristicas.length > 0) {
          // Extraer datos generales del primer registro
          const primer = caracteristicas[0];
          this.nombreDepartamento = primer.NOMBRE_DEPARTAMENTO;
          this.idDepartamento = primer.ID_DEPARTAMENTO;
          this.tipoDocumento = primer.TIPO_DOCUMENTO;
          this.idTipoDocumento = primer.ID_TIPO_DOCUMENTO;
        }
        this.caracteristicasDinamicas = caracteristicas;
        this.mostrarModalDetalles = true;
      },
      error: (err) => {
        console.error('Error al cargar características dinámicas:', err);
      },
    });
  }

  // Propiedad para controlar la visibilidad del área de carga
  showUploadArea: boolean = false;

  // Método para alternar la visibilidad
  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }
  // Variable para almacenar el archivo seleccionado
  archivoSeleccionado: File | null = null;

  // ID de usuario (puedes obtenerlo de tu lógica de autenticación)
  idUsuario: string = '18'; // Cambia esto por el ID real del usuario

  // Método para manejar la selección de archivos
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subir() {
    this.route.navigate(['subir_documentos']);
  }

  editandoId: number | null = null;
  documentoEditando = {
    ID_DOCUMENTO: 0,
    NOMBRE: '',
    DESCRIPCION: '',
    ES_PUBLICO: true,
  };

  editarDocumento(doc: documento) {
    this.editandoId = doc.ID_DOCUMENTO;
    this.documentoEditando = {
      ID_DOCUMENTO: doc.ID_DOCUMENTO,
      NOMBRE: doc.NOMBRE,
      DESCRIPCION: doc.DESCRIPCION,
      ES_PUBLICO: doc.ES_PUBLICO === 1, // convertir a boolean
    };
  }

  cancelarEdicion() {
    this.editandoId = null;
  }

  guardarEdicion() {
    const payload = {
      ...this.documentoEditando,
      ES_PUBLICO: this.documentoEditando.ES_PUBLICO ? 1 : 0, // aquí convertimos a número
    };

    this.docService.actualizarDocumentoDD(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: res.msg || 'Documento actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        });

        // Actualizar la tabla local
        const index = this.ListUs.findIndex(
          (d) => d.ID_DOCUMENTO === payload.ID_DOCUMENTO
        );
        if (index > -1) {
          this.ListUs[index].NOMBRE = payload.NOMBRE;
          this.ListUs[index].DESCRIPCION = payload.DESCRIPCION;
          this.ListUs[index].ES_PUBLICO = payload.ES_PUBLICO;
        }

        this.editandoId = null;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.msg || 'Ocurrió un error al actualizar.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
  private TipoDocumentoService = inject(TipoDocumentoService);
  public listaTipoDocumentos: any[] = [];
  private cargarTiposDocumento(): void {
    this.TipoDocumentoService.tipo_dget().subscribe({
      next: (data) => {
        if (data.Listado_Tipo_Documentos?.length) {
          this.listaTipoDocumentos = data.Listado_Tipo_Documentos.map(
            (t: any) => ({
              ID_TIPO_DOCUMENTO: t.ID_TIPO_DOCUMENTO,
              TIPO_DOCUMENTO: t.TIPO_DOCUMENTO,
            })
          );
        }
      },
      error: (err) => console.error('Error al cargar tipos de documento', err),
    });
  }
}
