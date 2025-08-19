import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoDocCaracteService } from '../../../../services/tipo-doc-caracte.service';
import { CaracteristicaService } from '../../../../services/caracteristica.service';

@Component({
  selector: 'app-actualizar-tdc',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './actualizar-tdc.component.html',
  styleUrl: './actualizar-tdc.component.css',
})
export class ActualizarTDCComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private tipoDocCaracteService = inject(TipoDocCaracteService);
  private caracteristicaService = inject(CaracteristicaService);

  public formActualizar!: FormGroup;
  public listaCaracteristica: any[] = [];

  private id_tipo_documento: number = 0;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const idTipoDoc = Number(params['id_tipo_documento']);
      const idCarac = Number(params['id_caracteristica']);

      const tipoDocu = params['tipoDocu'];
      const caracTexto = params['Caracate'];

      if (!idTipoDoc || !idCarac  || !tipoDocu || !caracTexto) {
        Swal.fire({
          icon: 'error',
          title: 'Parámetros inválidos',
          text: 'No se encontraron todos los datos necesarios para actualizar.',
        });
        this.route.navigate(['/TipoDocumentoCaracteristica']);
        return;
      }

      this.id_tipo_documento = idTipoDoc;

      this.formActualizar = this.fb.group({
        tipo_documento: this.fb.control({ value: tipoDocu, disabled: true }),
        caracteristica: this.fb.control(idCarac, [Validators.required]),

      });

      this.cargarCaracteristicas(idCarac);
    });
  }

  cargarCaracteristicas(idActual: number): void {
    this.caracteristicaService.cget().subscribe({
      next: (data) => {
        this.listaCaracteristica = data.Listado_Caracteristicas || [];

        // Validar si el valor actual existe, si no, limpiar
        const existe = this.listaCaracteristica.some(
          (c) => c.ID_CARACTERISTICA === idActual
        );
        if (!existe) {
          this.formActualizar.patchValue({ caracteristica: '' });
        }
      },
      error: (error) => {
        console.error('Error al cargar características', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las características.',
        });
      },
    });
  }

  actualizar(): void {
    if (this.formActualizar.invalid) {
      this.formActualizar.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completá correctamente todos los campos obligatorios.',
      });
      return;
    }


   const id_caracteristica_actual = Number(this.activatedRoute.snapshot.queryParamMap.get('id_caracteristica'));
const id_caracteristica_nueva = Number(this.formActualizar.get('caracteristica')?.value);


   this.tipoDocCaracteService.actualizartdc(
  this.id_tipo_documento,
  id_caracteristica_actual,
  id_caracteristica_nueva
)
      .subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado correctamente',
            text: res.msg || 'Actualización exitosa.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['/TipoDocumentoCaracteristica']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: error?.error?.msg || 'No se pudo actualizar el valor.',
            confirmButtonColor: '#d33',
          });
        },
      });
  }

  volver(): void {
    this.route.navigate(['/TipoDocumentoCaracteristica']);
  }
}
