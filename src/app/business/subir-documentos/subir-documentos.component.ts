import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DocumentosService } from '../../services/documentos.service';
import { SharedService } from '../../shared.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSizePipe } from '../../shared/pipes/file-size.pipe';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { DepartamentoService } from '../../services/departamento.service';
import { ClaseService } from '../../services/clase.service';
import { TipoArchivoService } from '../../services/tipo-archivo.service';
import { EstructuraArchivosService } from '../../services/estructura-archivos.service';
import { CategoriaService } from '../../services/categoria.service';
import { CaracteristicaService } from '../../services/caracteristica.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { DocumentoCaracteristica } from '../../interfaces/Documentos/TipoDocuemtoCaracte/TipoDcoCara';
import { TipoDocCaracteService } from '../../services/tipo-doc-caracte.service';
import { jwtDecode } from 'jwt-decode';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-subir-documentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileSizePipe,
    TruncatePipe,
  ],
  templateUrl: './subir-documentos.component.html',
  styleUrls: ['./subir-documentos.component.css'],
})
export class SubirDocumentosComponent {
  private docService = inject(DocumentosService);
  private usuarioService = inject(UsuariosService);
  private route = inject(Router);

  showUploadArea = true;
  nombreArchivo: string = '';
  archivoSeleccionado: File | null = null;
  nombre: string = '';
  descripcion: string = '';
  es_public: number = 0;
  ID_DEPARTAMENTO: number = 0;
  ID_ESTRUCTURA_ARCHIVO: number = 0;
  ID_TIPO_ARCHIVO: number = 0;
  ID_CATEGORIA: number = 0;
  ID_CARACTERISTICA: number = 0;
  VALOR_CARACTERISTICA: string = '';
  ID_TIPO_DOCUMENTO: number = 0;
  ID_CLASE: number = 0;
  ID_SUB_CATEGORIA: number = 0;
  usuario: Usuarios | null = null;
  subiendoArchivo: boolean = false;
  arrastrandoArchivo: boolean = false;

  private departamentoService = inject(DepartamentoService);
  private claseService = inject(ClaseService);
  private estructuraArchivosService = inject(EstructuraArchivosService);
  private tipo_archivoService = inject(TipoArchivoService);
  private CategoriaService = inject(CategoriaService);
  private caracteristicaService = inject(CaracteristicaService);


  private TipoDocCaracteService = inject(TipoDocCaracteService);
  private TipoDocumentoService = inject(TipoDocumentoService);
  public listaTidocumentos: any[] = [];
  public listadepar: any[] = [];
  public listclase: any[] = [];
  public listestructu: any[] = [];
  public listtipoarchivo: any[] = [];
  public listcategoria: any[] = [];
  public listcaracteristica: any[] = [];
  public caracteristicas: DocumentoCaracteristica[] = [];
  // Para guardar la respuesta del usuario a cada característica
  public caracteristicasForm: { [id_caracteristica: number]: string } = {};
 constructor(private sharedService: SharedService) {}
  ngOnInit(): void {
    this.departamentoService.Departamentoget().subscribe({
      next: (data) => {
        if (data.Listado_Departamentos.length > 0) {
          this.listadepar = data.Listado_Departamentos;
        }
      },

      error: (error) => {
        console.error('Error al cargar departamentos', error);
      },
    });

    // Cargar estructura de archivos y tipo de archivo

    this.estructuraArchivosService.estructuraget().subscribe({
      next: (data) => {
        if (data.Listado_Estrucura_Archivos.length > 0) {
          this.listestructu = data.Listado_Estrucura_Archivos;
        }
      },

      error: (error) => {
        console.error('Error al cargar estructura de archivos', error);
      },
    });

    this.tipo_archivoService.Tipoarchivoget().subscribe({
      next: (data) => {
        if (data.Listado_Tipo_Archivo.length > 0) {
          this.listtipoarchivo = data.Listado_Tipo_Archivo;
        }
      },

      error: (error) => {
        console.error('Error al cargar tipo de archivo', error);
      },
    });

    //categoria

    this.CategoriaService.getCategorias().subscribe({
      next: (data) => {
        if (data.Listado_Categoria.length > 0) {
          this.listcategoria = data.Listado_Categoria;
        }
      },

      error: (error) => {
        console.error('Error al cargar categoria', error);
      },
    });
    const correo = this.sharedService.getCorreo();
    if (correo) {
      this.usuarioService.perfil({ email: correo }).subscribe({
        next: (data) => (this.usuario = data),
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
          Swal.fire(
            'Error',
            'No se pudo cargar la información del usuario',
            'error'
          );
        },
      });
    }
    this.TipoDocumentoService.tipo_dget().subscribe({
      next: (data) => {
        if (data.Listado_Tipo_Documentos.length > 0) {
          this.listaTidocumentos = data.Listado_Tipo_Documentos;
        }
      },
      error: (error) => {
        console.error('Error al cargar departamentos', error);
      },
    });
  }

  


  // Método para manejar el cambio:
  onTipoDocumentoChange(idTipo: number | string): void {
    const tipoNum = Number(idTipo);
    if (!tipoNum) {
      
      this.caracteristicas = [];
      return;
    }

    this.TipoDocCaracteService.getByTipo(tipoNum).subscribe({
      next: (arr) => {
        console.log('→ Características finales:', arr);
        this.caracteristicas = arr;
      },
      error: (err) => {
        console.error('Error al cargar características:', err);
        Swal.fire(
          'Error',
          'No se pudieron cargar las características',
          'error'
        );
        this.caracteristicas = [];
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validarArchivo(input.files[0]);
    }
  }
  get formularioValido(): boolean {
    return !!(
      this.nombre &&
      this.nombre.length <= 100 &&
      this.descripcion &&
      this.descripcion.length <= 250 &&
      this.archivoSeleccionado
    );
  }
  validarArchivo(file: File): void {
    const formatosPermitidos = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!formatosPermitidos.includes(file.type)) {
      Swal.fire(
        'Formato no soportado',
        'Por favor, sube un archivo en uno de los formatos permitidos',
        'error'
      );
      return;
    }

    if (file.size > maxSize) {
      Swal.fire(
        'Archivo muy grande',
        'El tamaño máximo permitido es 10MB',
        'error'
      );
      return;
    }

    this.archivoSeleccionado = file;
    this.nombreArchivo = file.name;
  }

  // Métodos para manejar el área de arrastrar y soltar
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo = false;

    if (event.dataTransfer?.files.length) {
      this.validarArchivo(event.dataTransfer.files[0]);
    }
  }

  removerArchivo(): void {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
  }

  volver() {
    this.route.navigate(['/dhashboard']);
  }

  resetFormulario() {
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    this.nombre = '';
    this.descripcion = '';
    this.es_public = 0;
  }
  // Agrega estas propiedades a tu componente
  multiMode: boolean = false;
  archivosSeleccionados: File[] = [];
  documentos: Array<{
    nombre: string;
    descripcion: string;
    es_public: number;
  }> = [];

  // Métodos nuevos
  initMultiUpload(): void {
    this.archivosSeleccionados = [];
    this.documentos = [];
  }

  onMultiFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivosSeleccionados = Array.from(input.files).slice(0, 5); // para acambiar luego en caso de que se quiera subir más archivos ;)

      // Inicializar los documentos con valores por defecto
      this.documentos = this.archivosSeleccionados.map((file) => ({
        nombre: file.name.replace(/\.[^/.]+$/, ''), // quitar extensión
        descripcion: '',
        es_public: 0,
      }));
    }
  }

  onMultiDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrandoArchivo = false;

    if (event.dataTransfer?.files.length) {
      const files = Array.from(event.dataTransfer.files);
      this.onMultiFileSelected({ target: { files } } as any);
    }
  }

  removeFile(index: number): void {
    this.archivosSeleccionados.splice(index, 1);
    this.documentos.splice(index, 1);
  }

  multiFormValid(): boolean {
    return (
      this.archivosSeleccionados.length > 0 &&
      this.documentos.every(
        (doc) =>
          doc.nombre &&
          doc.nombre.length <= 100 &&
          doc.descripcion &&
          doc.descripcion.length <= 250 &&
          doc.es_public !== undefined
      )
    );
  }




  submitDocumento() {
  if (!this.archivoSeleccionado || !this.usuario) {
    Swal.fire('Error', 'Faltan datos requeridos', 'error');
    return;
  }
this.ID_DEPARTAMENTO = this.sharedService.getDepartamento();
  console.log('Departamento asignado:', this.ID_DEPARTAMENTO);
  // 1) Convertir el formulario de características a un array
  const caracteristicasPayload = Object.entries(this.caracteristicasForm)
    .map(([idStr, valor]) => ({
      ID_CARACTERISTICA: Number(idStr),
      VALOR: valor
    }));

  // 2) Llamar al servicio
    this.subiendoArchivo = true;
  this.docService.subirDocumento(
    this.archivoSeleccionado,
    this.usuario.ID_USUARIO,         // ID_USUARIO
    this.ID_TIPO_DOCUMENTO,          // ID_TIPO_DOCUMENTO
    this.nombre,                     // NOMBRE
    this.descripcion,                // DESCRIPCION
    this.es_public,                  // ES_PUBLICO
    this.ID_DEPARTAMENTO,            // ID_DEPARTAMENTO
    /* hardcodeados por ahora: */ 
    1,                               // ID_CLASE
    2,                               // ID_ESTRUCTURA_ARCHIVOS
    1,                               // ID_TIPO_ARCHIVO
    1,                               // ID_CATEGORIA
    1,                               // ID_SUB_CATEGORIA
    caracteristicasPayload           // caracteristicas
   )
  .pipe(
    finalize(() => this.subiendoArchivo = false)  // ⚠️ siempre desactiva el loader
  )
  .subscribe({
    next: () => {
      Swal.fire('¡Listo!', 'Documento subido correctamente', 'success');
      this.resetFormulario();
      this.archivoSeleccionado = null;
    },
    error: err => {
      console.error('Error al subir:', err);
      Swal.fire('Error', 'No se pudo subir el documento', 'error');
    }
  });
}
}
