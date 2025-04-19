import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjetosService } from '../../../services/objetos.service'; // Asegúrate de importar el servicio correcto
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
export default class ActualizarObjetoComponent {
  private route = inject(Router);
  private objetosService = inject(ObjetosService);

  objetoId: number = 0;
  NombreObjeto: string = '';
  TipoObjeto: string = '';
  DescripcionObjeto: string = '';
  FechaCreacion: Date | null = null;
  CreadoPor: string = '';
  ModificadoPor: string = '';

  constructor(private activatedRoute: ActivatedRoute, private serviccompa: SharedService) {}

  ngOnInit(): void {
    // Usar ActivatedRoute para acceder a los queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      this.objetoId = params['id'];
      this.NombreObjeto = params['objeto'];
      this.TipoObjeto = params['tipoObjeto'];
      this.DescripcionObjeto = params['descripcion'];
      this.FechaCreacion = params['fechaCreacion'] ? new Date(params['fechaCreacion']) : null;
      this.CreadoPor = params['creadoPor'];
      this.ModificadoPor = params['modificadoPor'];
    });
  }

  actualizarObjeto() {
    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_OBJETO: this.objetoId,
      OBJETO: this.NombreObjeto,
      TIPO_OBJETO: this.TipoObjeto,
      DESCRIPCION: this.DescripcionObjeto,
      FECHA_CREACION: this.FechaCreacion, // Mantener la fecha de creación original
      CREADO_POR: this.CreadoPor, // Mantener el creado por original
      FECHA_MODIFICACION: new Date(), // Fecha de modificación automática
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