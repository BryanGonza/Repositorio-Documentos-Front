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

@Component({
  selector: 'app-subir-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FileSizePipe, TruncatePipe],
  templateUrl: './subir-documentos.component.html',
  styleUrls: ['./subir-documentos.component.css'],
})
export class SubirDocumentosComponent {
  private docService = inject(DocumentosService);
  private sharedService = inject(SharedService);
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
  usuario: Usuarios | null = null;
  subiendoArchivo: boolean = false;
  arrastrandoArchivo: boolean = false;



  private departamentoService = inject(DepartamentoService);
  private claseService = inject(ClaseService);
  private estructuraArchivosService = inject(EstructuraArchivosService);
  private tipo_archivoService = inject(TipoArchivoService);
  private CategoriaService = inject(CategoriaService);
  private caracteristicaService = inject(CaracteristicaService);
  public listadepar: any[] = [];
  public listclase: any[] = [];
  public listestructu: any[] = [];
  public listtipoarchivo: any[] = [];
  public listcategoria: any[] = [];
  public listcaracteristica: any[] = [];
  ngOnInit(): void {
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

    // Cargar los datos de los selectores
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
    // caracteristica
    this.caracteristicaService.cget().subscribe({
      next: (data) => {
        if (data.Listado_Caracteristicas.length > 0) {
          this.listcaracteristica = data.Listado_Caracteristicas;
        }
      },
      error: (error) => {
        console.error('Error al cargar tipo de archivo', error);
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
    const formatosPermitidos = ['application/pdf', 
                              'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'application/vnd.ms-excel',
                              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                              'application/vnd.ms-powerpoint',
                              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                              'image/jpeg',
                              'image/png'];
    
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!formatosPermitidos.includes(file.type)) {
      Swal.fire('Formato no soportado', 'Por favor, sube un archivo en uno de los formatos permitidos', 'error');
      return;
    }

    if (file.size > maxSize) {
      Swal.fire('Archivo muy grande', 'El tamaño máximo permitido es 10MB', 'error');
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

  subirArchivo(): void {
    if (!this.formularioValido || !this.usuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, completa todos los campos requeridos y selecciona un archivo válido.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    this.subiendoArchivo = true;

    this.docService
      .subirDocumento(
        this.archivoSeleccionado!,
        this.usuario.ID_USUARIO,
        this.nombre,
        this.descripcion,
        this.es_public,
        this.ID_DEPARTAMENTO,
        this.ID_ESTRUCTURA_ARCHIVO,
        this.ID_TIPO_ARCHIVO,
        this.ID_CATEGORIA,
        this.ID_CARACTERISTICA,
        this.VALOR_CARACTERISTICA,
        
      )
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Documento subido!',
            text: 'Tu documento ha sido guardado correctamente',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.resetFormulario();
            this.route.navigate(['/dhashboard']);
          });
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al subir',
            text: 'Hubo un problema al subir tu documento. Por favor, inténtalo nuevamente.',
            confirmButtonText: 'Entendido',
          });
        },
        complete: () => {
          this.subiendoArchivo = false;
        }
      });
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
    this.documentos = this.archivosSeleccionados.map(file => ({
      nombre: file.name.replace(/\.[^/.]+$/, ""), // quitar extensión
      descripcion: '',
      es_public: 0
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
  return this.archivosSeleccionados.length > 0 && 
         this.documentos.every(doc => 
           doc.nombre && doc.nombre.length <= 100 &&
           doc.descripcion && doc.descripcion.length <= 250 &&
           doc.es_public !== undefined
         );
}

subirMultiplesArchivos(): void {
  if (!this.multiFormValid() || !this.usuario) return;

  this.subiendoArchivo = true;
  
  // Subir todos los documentos en paralelo
  const uploads = this.archivosSeleccionados.map((file, index) => {
    const doc = this.documentos[index];
    return this.docService.subirDocumento(
      file,
      this.usuario!.ID_USUARIO,
      doc.nombre,
      doc.descripcion,
      doc.es_public,
      this.ID_DEPARTAMENTO,
      this.ID_ESTRUCTURA_ARCHIVO,
      this.ID_TIPO_ARCHIVO,
      this.ID_CATEGORIA,
      this.ID_CARACTERISTICA,
      this.VALOR_CARACTERISTICA,
    ).toPromise();
  });

  Promise.all(uploads)
    .then(() => {
      Swal.fire('Éxito', 'Documentos subidos correctamente', 'success');
      this.initMultiUpload();
    })
    .catch(error => {
      console.error('Error al subir documentos:', error);
      Swal.fire('Error', 'Hubo un problema al subir algunos documentos', 'error');
    })
    .finally(() => {
      this.subiendoArchivo = false;
    });
}

cancelMultiUpload(): void {
  this.initMultiUpload();
  this.multiMode = false;
}
}