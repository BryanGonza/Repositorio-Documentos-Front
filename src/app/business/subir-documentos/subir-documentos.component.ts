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
  usuario: Usuarios | null = null;
  subiendoArchivo: boolean = false;
  arrastrandoArchivo: boolean = false;

  get formularioValido(): boolean {
    return !!(
      this.nombre && 
      this.nombre.length <= 100 &&
      this.descripcion &&
      this.descripcion.length <= 250 &&
      this.archivoSeleccionado
    );
  }

  ngOnInit() {
    const correo = this.sharedService.getCorreo();
    if (correo) {
      this.usuarioService.perfil({ email: correo }).subscribe({
        next: (data) => this.usuario = data,
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
          Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error');
        },
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validarArchivo(input.files[0]);
    }
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
        this.es_public
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
      doc.es_public
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