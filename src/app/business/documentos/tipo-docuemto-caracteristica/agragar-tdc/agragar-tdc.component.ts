import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DocumentoCaracteristicaRegistro } from '../../../../interfaces/Documentos/TipoDocuemtoCaracte/TipoDcoCara';
import { TipoDocCaracteService } from '../../../../services/tipo-doc-caracte.service';
import { TipoDocumentoService } from '../../../../services/tipo-documento.service';
import { CaracteristicaService } from '../../../../services/caracteristica.service';

@Component({
  selector: 'app-agragar-tdc',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agragar-tdc.component.html',
  styleUrl: './agragar-tdc.component.css',
})
export class AgragarTDCComponent {
  
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);
  private TipoDocumentoService = inject(TipoDocumentoService);
  private TipoDocCaracteService = inject(TipoDocCaracteService);
  private CaracteristicaService = inject(CaracteristicaService);

//aqui me quede...............................................................
 public listaTDoc: any[] = [];
  public listaCaracteristica: any[] = [];
  ngOnInit(): void {
    this.TipoDocumentoService.tipo_dget().subscribe({
      next: (data) => {
        if (data.Listado_Tipo_Documentos.length > 0) {
          this.listaTDoc = data.Listado_Tipo_Documentos;
        }
      },
      error: (error) => {
        console.error('Error al cargar objetos', error);
      },
    });

        this.CaracteristicaService.cget().subscribe({
      next: (data) => {
        if (data.Listado_Caracteristicas.length > 0) {
          this.listaCaracteristica = data.Listado_Caracteristicas;
        }
      },
      error: (error) => {
        console.error('Error al cargar objetos', error);
      },
    });
  }
  public formRegistro: FormGroup = this.fromBuild.group({
    IDTipoDocum: ['', Validators.required],
    IDCaracteristica: ['', Validators.required],

  });

  // Método para registrar departamento
  registrarDepartamento() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

  const objeto: DocumentoCaracteristicaRegistro = {
  id_tipo_documento:    this.formRegistro.value.IDTipoDocum,
  id_caracteristica:     this.formRegistro.value.IDCaracteristica,
};


    this.TipoDocCaracteService.registrarDocCarac(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: data.msg || 'Registro exitoso',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['TipoDocumentoCaracteristica']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text:
            error.error?.msg || 'Ocurrió un error al registrar caracteristica al documento.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['TipoDocumentoCaracteristica']);
  }
}
