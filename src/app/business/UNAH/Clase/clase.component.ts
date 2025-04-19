import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Clase, ClaseService } from '../../../services/clase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clase',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent implements OnInit {
  [x: string]: any;

  formClase!: FormGroup;
  clases: Clase[] = [];
  paginatedClases: Clase[] = [];

  // Estados
  mostrarFormulario: boolean = false;
  editando = false;
  claseEditandoId?: number;

  // Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 1;

  // Buscador
  filtroBusqueda: string = '';
  clasesFiltradas: Clase[] = [];

  constructor(private fb: FormBuilder, private claseService: ClaseService) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarClases();
  }

  initForm(): void {
    this.formClase = this.fb.group({
      NOMBRE: ['', Validators.required],
      APROBADO: ['', Validators.required],
      RECEPCIONADO: ['', Validators.required],
      FORMATO: ['', Validators.required],
      ESTADO: [true, Validators.required]
    });
  }

  cargarClases(): void {
    this.claseService.getClases().subscribe((res: any) => {
      this.clases = res.Listado_Clase || [];
      this.buscarClase();
    });
  }

  buscarClase(): void {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    this.clasesFiltradas = this.clases.filter(clase =>
      clase.NOMBRE.toLowerCase().includes(termino)
    );

    this.totalPaginas = Math.ceil(this.clasesFiltradas.length / this.elementosPorPagina);
    this.paginaActual = 1;
    this.actualizarTabla();
  }

  actualizarTabla(): void {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.paginatedClases = this.clasesFiltradas.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarTabla();
    }
  }

  mostrarMensaje(titulo: string, texto: string) {
    Swal.fire({
      icon: 'success',
      title: titulo,
      text: texto,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
  }

  guardarClase(): void {
    const clase: Clase = this.formClase.value;

    if (this.editando && this.claseEditandoId) {
      clase.ID_CLASE = this.claseEditandoId;
      this.claseService.updateClase(clase).subscribe(() => {
        this.cargarClases();
        this.cancelarEdicion();
        this.mostrarMensaje('Clase actualizada', 'La clase fue actualizada correctamente.');
      });
    } else {
      this.claseService.createClase(clase).subscribe(() => {
        this.cargarClases();
        this.formClase.reset({ ESTADO: true });
        this.mostrarFormulario = false;
        this.mostrarMensaje('Clase creada', 'La clase fue creada correctamente.');
      });
    }
  }

  editarClase(clase: Clase): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.claseEditandoId = clase.ID_CLASE!;
    this.formClase.patchValue(clase);
  }

  eliminarClase(id: number): void {
    this.claseService.deleteClase(id).subscribe(() => {
      this.cargarClases();
      this.mostrarMensaje('Clase eliminada', 'La clase fue eliminada correctamente.');
    });
  }

  confirmarEliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarClase(id);
      }
    });
  }

  confirmarVolver() {
    Swal.fire({
      title: '¿Seguro que deseas cancelar?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mostrarFormulario = false;
        this.editando = false;
        this.formClase.reset({ ESTADO: true });
      }
    });
  }

  confirmarCancelarEdicion() {
    Swal.fire({
      title: '¿Seguro que deseas cancelar la actualización?',
      text: 'Perderás los cambios realizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelarEdicion();
      }
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.claseEditandoId = undefined;
    this.formClase.reset({ ESTADO: true });
    this.mostrarFormulario = false;
  }
}




/*import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Clase, ClaseService } from '../../../../services/clase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clase',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './clase.component.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent implements OnInit {
  [x: string]: any;

  formClase!: FormGroup;
  clases: Clase[] = [];
  paginatedClases: Clase[] = [];

  // Estados
  mostrarFormulario: boolean = false;
  editando = false;
  claseEditandoId?: number;

  // Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 1;

  // Buscador
  filtroBusqueda: string = '';
  clasesFiltradas: Clase[] = [];

  constructor(private fb: FormBuilder, private claseService: ClaseService) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarClases();
  }

  initForm(): void {
    this.formClase = this.fb.group({
      NOMBRE: ['', Validators.required],
      APROBADO: ['', Validators.required],
      RECEPCIONADO: ['', Validators.required],
      FORMATO: ['', Validators.required],
      ESTADO: [true, Validators.required]
    });
  }

  cargarClases(): void {
    this.claseService.getClases().subscribe((res: any) => {
      this.clases = res.Listado_Clase || [];
      this.buscarClase(); // aplicar filtro al cargar
    });
  }

  buscarClase(): void {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    this.clasesFiltradas = this.clases.filter(clase =>
      clase.NOMBRE.toLowerCase().includes(termino)
    );

    this.totalPaginas = Math.ceil(this.clasesFiltradas.length / this.elementosPorPagina);
    this.paginaActual = 1;
    this.actualizarTabla();
  }

  actualizarTabla(): void {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.paginatedClases = this.clasesFiltradas.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarTabla();
    }
  }

  guardarClase(): void {
    const clase: Clase = this.formClase.value;

    if (this.editando && this.claseEditandoId) {
      clase.ID_CLASE = this.claseEditandoId;
      this.claseService.updateClase(clase).subscribe(() => {
        this.cargarClases();
        this.cancelarEdicion();
      });
    } else {
      this.claseService.createClase(clase).subscribe(() => {
        this.cargarClases();
        this.formClase.reset({ ESTADO: true });
        this.mostrarFormulario = false;
      });
    }
  }

  editarClase(clase: Clase): void {
    this.editando = true;
    this.mostrarFormulario = true;
    this.claseEditandoId = clase.ID_CLASE!;
    this.formClase.patchValue(clase);
  }

  eliminarClase(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta clase?')) {
      this.claseService.deleteClase(id).subscribe(() => {
        this.cargarClases();
      });
    }
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.claseEditandoId = undefined;
    this.formClase.reset({ ESTADO: true });
    this.mostrarFormulario = false;
  }
}
/*

// Este código es un componente de Angular que maneja la creación, edición y eliminación de clases.
// Utiliza Reactive Forms para la gestión de formularios y hace uso de un servicio para interactuar con una API RESTful.*/