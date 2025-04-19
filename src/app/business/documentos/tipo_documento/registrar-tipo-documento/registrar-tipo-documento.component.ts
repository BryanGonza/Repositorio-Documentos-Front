import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoDocumentoService } from '../../../../services/tipo-documento.service';
import { RegistroTipoDocumento } from '../../../../interfaces/Documentos/tipo_documento/RegistroTipo';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-tipo-documento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-tipo-documento.component.html',
  styleUrls: ['./registrar-tipo-documento.component.css']
})
export class RegistrarTipoDocumentoComponent {
  private tipoDocumentoService = inject(TipoDocumentoService);
  private route = inject(Router);
  public formBuilder = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuilder.group({
    tipoDocumento: ['', [Validators.required, Validators.maxLength(50)]],
    estado: [true, Validators.required], // Valor por defecto true (activo)
  });

  // Método para registrar el tipo de documento
  registrarTipoDocumento() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroTipoDocumento = {
      TIPO_DOCUMENTO: this.formRegistro.value.tipoDocumento.toUpperCase(),
      ESTADO: this.formRegistro.value.estado
    };

    this.tipoDocumentoService.registrartipo_d(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Tipo de documento creado',
          text: data.msg || 'Tipo de documento creado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['tipo-documento']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el tipo de documento.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  // Método para volver a la lista de tipos de documento
  volver() {
    this.route.navigate(['tipo-documento']);
  }
}
