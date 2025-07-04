import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TipoCaracteristica } from '../../interfaces/Tipo_Caracteristica/tipo_caracteristica';
import { TipoCaracteristicaService } from '../../services/tipo_caracteristica.service';
import Swal from 'sweetalert2';
import { ObjetoPermisoExtendido } from '../../interfaces/Objetos/Objetos';
import { ObjetosService } from '../../services/objetos.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-tipo-caracteristica',
  templateUrl: './tipo-caracteristica.component.html',
  styleUrls: ['./tipo-caracteristica.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [TipoCaracteristicaService],
})
export  class TipoCaracteristicaComponent implements OnInit {
  formTipoCaracteristica!: FormGroup;
  listaTipoCaracteristicas: TipoCaracteristica[] = [];
  listaFiltrada: TipoCaracteristica[] = [];
  paginatedLista: TipoCaracteristica[] = [];

  editando = false;
  idEditando?: number;

  mostrarFormulario = false;

  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private sharedService: SharedService, private fb: FormBuilder, private tipoCaracteristicaService: TipoCaracteristicaService) {}

  ngOnInit(): void {
    this.sharedService.rol$.subscribe((rol) => {
      this.rolActual = rol;
      this.getObjetosConPermisos();
    });
    this.formTipoCaracteristica = this.fb.group({
      TIPO_CARACTERISTICA: ['', Validators.required],
    });
    this.obtenerLista();
  }
//roles y permisos 
  rolActual = '';

  objetos: ObjetoPermisoExtendido[] = [];
  private objetoser = inject(ObjetosService);
  token: string =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  getObjetosConPermisos(): void {
    this.objetoser.getObjetosPermisos(this.token).subscribe({
      next: (data) => {
        this.objetos = data;
        console.log('Objetos con permisos:', this.objetos);
      },
      error: (err) => {
        console.error('Error al obtener objetos:', err);
      },
    });
  }
    // MEtodo para normalizar cadenas
    private normalize(str: string): string {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
  
    getPermiso(accion: string): boolean {
      // Verifica si el permiso para la pantalla 'caracteristica' existe
      const permiso = this.objetos.find((o) =>
        this.normalize(o.OBJETO).includes('caracteristica')
      );
      if (!permiso) {
        console.warn("No se encontró permiso para la pantalla 'caracteristica'");
        return false;
      }
  
      const mapping: Record<
        'consulta' | 'insercion' | 'actualizacion' | 'eliminacion',
        boolean
      > = {
        consulta: permiso.PERMISO_CONSULTAR,
        insercion: permiso.PERMISO_INSERCION,
        actualizacion: permiso.PERMISO_ACTUALIZACION,
        eliminacion: permiso.PERMISO_ELIMINACION,
      };
  
      const key = this.normalize(accion) as
        | 'consulta'
        | 'insercion'
        | 'actualizacion'
        | 'eliminacion';
      return mapping[key] ?? false;
    }
  // Fin de roles y permisos
  obtenerLista(): void {
    this.tipoCaracteristicaService.getTipoCaracteristicas().subscribe((resp) => {
      this.listaTipoCaracteristicas = resp.Listado_Tipo_Caracteristica;
      this.filtrar();
    });
  }

  guardar(): void {
    const datos = this.formTipoCaracteristica.value;

    if (this.formTipoCaracteristica.invalid || !datos.TIPO_CARACTERISTICA?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa el campo correctamente.',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.editando && this.idEditando != null) {
      this.tipoCaracteristicaService
        .updateTipoCaracteristica({ ID_TIPO_CARACTERISTICA: this.idEditando, ...datos })
        .subscribe(() => {
          this.obtenerLista();
          this.resetearFormulario();
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'Tipo de característica actualizada correctamente.',
            confirmButtonText: 'OK'
          });
        });
    } else {
      this.tipoCaracteristicaService.createTipoCaracteristica(datos).subscribe(() => {
        this.obtenerLista();
        this.resetearFormulario();
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tipo de característica creado correctamente.',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  editar(item: TipoCaracteristica): void {
    this.editando = true;
    this.idEditando = item.ID_TIPO_CARACTERISTICA!;
    this.formTipoCaracteristica.patchValue({ TIPO_CARACTERISTICA: item.TIPO_CARACTERISTICA });
    this.mostrarFormulario = true;
  }

  confirmarEliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoCaracteristicaService.deleteTipoCaracteristica(id).subscribe(() => {
          this.obtenerLista();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El registro fue eliminado correctamente.',
            confirmButtonText: 'OK'
          });
        });
      }
    });
  }

  confirmarVolver(): void {
    Swal.fire({
      title: '¿Seguro que deseas cancelar?',
      text: 'Se perderán los cambios no guardados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, volver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetearFormulario();
      }
    });
  }

  confirmarCancelarEdicion(): void {
    Swal.fire({
      title: '¿Seguro que deseas cancelar la actualización?',
      text: 'Se perderán los cambios realizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetearFormulario();
      }
    });
  }

  resetearFormulario(): void {
    this.formTipoCaracteristica.reset();
    this.editando = false;
    this.idEditando = undefined;
    this.mostrarFormulario = false;
  }

  mostrarForm(): void {
    this.resetearFormulario();
    this.mostrarFormulario = true;
  }

  cancelar(): void {
    this.confirmarVolver();
  }

  filtrar(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.listaFiltrada = this.listaTipoCaracteristicas.filter((item) =>
      item.TIPO_CARACTERISTICA?.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.totalPages = Math.ceil(this.listaFiltrada.length / this.itemsPerPage);
    this.paginatedLista = this.listaFiltrada.slice(start, end);
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarPaginacion();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.actualizarPaginacion();
    }
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.actualizarPaginacion();
  }
}