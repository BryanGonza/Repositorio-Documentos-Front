import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseTipoDocumento } from '../../../../interfaces/Documentos/tipo_documento/tipo_documento';
import { TipoDocumentoService } from '../../../../services/tipo-documento.service';

@Component({
  selector: 'app-actualizar-tipo-documento',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-tipo-documento.component.html',
  styleUrls: ['./actualizar-tipo-documento.component.css']
})
export default class ActualizarTipoDocumentoComponent {
  private route = inject(Router);
  private tipoDocumentoService = inject(TipoDocumentoService);

  tipoDocumentoId: number = 0;
  tipoDocumentoNombre: string = '';
  estadoTipoDocumento: boolean = true;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tipoDocumentoId = params['id'];
      this.tipoDocumentoNombre = params['tipoDocumento'];
      this.estadoTipoDocumento = params['estado'] === 'true';
    });
  }

  actualizarTipoDocumento() {
    const datosActualizados = {
      ID_TIPO_DOCUMENTO: this.tipoDocumentoId,
      TIPO_DOCUMENTO: this.tipoDocumentoNombre.toUpperCase(),
      ESTADO: this.estadoTipoDocumento
    };

    this.tipoDocumentoService.actualizartipo_d(
      datosActualizados.ID_TIPO_DOCUMENTO,
      datosActualizados.TIPO_DOCUMENTO,
      datosActualizados.ESTADO
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Tipo de documento actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['tipo-documento']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el tipo de documento.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['tipo-documento']);
  }
}
