import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjetosService } from '../../../services/objetos.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-actualizar-objeto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-objeto.component.html',
  styleUrls: ['./actualizar-objeto.component.css']
})
export default class ActualizarObjetoComponent implements OnInit {
  private route = inject(Router);
  private objetosService = inject(ObjetosService);
  private activatedRoute = inject(ActivatedRoute);
  private serviccompa = inject(SharedService);

  objetoId: number = 0;
  NombreObjeto: string = '';
  TipoObjeto: string = '';
  DescripcionObjeto: string = '';
  FechaCreacion: Date | null = null;
  CreadoPor: string = '';
  ModificadoPor: string = '';

  // Datos originales para comparación
  originalNombreObjeto: string = '';
  originalTipoObjeto: string = '';
  originalDescripcionObjeto: string = '';

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.objetoId = params['id'];
      this.NombreObjeto = params['objeto'];
      this.TipoObjeto = params['tipoObjeto'];
      this.DescripcionObjeto = params['descripcion'];
      this.FechaCreacion = params['fechaCreacion'] ? new Date(params['fechaCreacion']) : null;
      this.CreadoPor = params['creadoPor'];
      this.ModificadoPor = params['modificadoPor'];

      // Guardar datos originales
      this.originalNombreObjeto = params['objeto'];
      this.originalTipoObjeto = params['tipoObjeto'];
      this.originalDescripcionObjeto = params['descripcion'];
    });
  }

  // Validación para campos vacíos
  validarCampoVacio(valor: string, campo: string): boolean {
    if (!valor || valor.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Campo vacío',
        text: `El campo ${campo} no puede estar vacío.`,
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  // Validación para nombre del objeto
  validarNombreObjeto(nombre: string): boolean {
    if (!this.validarCampoVacio(nombre, 'nombre del objeto')) {
      return false;
    }
    
    // Puedes agregar más validaciones específicas para el nombre si es necesario
    return true;
  }

  // Validación para tipo de objeto
  validarTipoObjeto(tipo: string): boolean {
    if (!this.validarCampoVacio(tipo, 'tipo de objeto')) {
      return false;
    }
    
    // Puedes agregar validaciones específicas para el tipo si es necesario
    return true;
  }

  // Validación para descripción
  validarDescripcion(descripcion: string): boolean {
    if (!this.validarCampoVacio(descripcion, 'descripción')) {
      return false;
    }
    
    // Validar longitud mínima/máxima si es necesario
    if (descripcion.length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Descripción muy corta',
        text: 'La descripción debe tener al menos 10 caracteres.',
        confirmButtonColor: '#d33',
      });
      return false;
    }
    return true;
  }

  actualizarObjeto() {
    // Validar campos antes de continuar
    if (!this.validarNombreObjeto(this.NombreObjeto) || 
        !this.validarTipoObjeto(this.TipoObjeto) || 
        !this.validarDescripcion(this.DescripcionObjeto)) {
      return;
    }

    // Verificar si hubo cambios reales
    const cambiosRealizados =
      this.NombreObjeto !== this.originalNombreObjeto ||
      this.TipoObjeto !== this.originalTipoObjeto ||
      this.DescripcionObjeto !== this.originalDescripcionObjeto;

    if (!cambiosRealizados) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin cambios',
        text: 'No realizaste ningún cambio real. ¿Deseas regresar a la lista de objetos o continuar editando?',
        showCancelButton: true,
        confirmButtonText: 'Regresar',
        cancelButtonText: 'Seguir editando',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#f39c12',
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigate(['objetos']);
        }
      });
      return;
    }

    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_OBJETO: this.objetoId,
      OBJETO: this.NombreObjeto,
      TIPO_OBJETO: this.TipoObjeto,
      DESCRIPCION: this.DescripcionObjeto,
      FECHA_CREACION: this.FechaCreacion,
      CREADO_POR: this.CreadoPor,
      FECHA_MODIFICACION: new Date(),
      MODIFICADO_POR: this.serviccompa.getCorreo(),
    };

    // Enviar la actualización
    this.objetosService.actualizarObjeto(
      datosActualizados.ID_OBJETO.toUpperCase(),
      datosActualizados.OBJETO.toUpperCase(),
      datosActualizados.TIPO_OBJETO.toUpperCase(),
      datosActualizados.DESCRIPCION.toUpperCase(),
      datosActualizados.FECHA_CREACION,
      datosActualizados.CREADO_POR.toUpperCase(),
      datosActualizados.FECHA_MODIFICACION,
      datosActualizados.MODIFICADO_POR.toUpperCase()
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Objeto actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['objetos']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el objeto.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['objetos']);
  }
}