import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObjetosService } from '../../../services/objetos.service'; 
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RegistroObjetos } from '../../../interfaces/Objetos/RegistroObjetos';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-registrar-objeto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-objeto.component.html',
  styleUrls: ['./registrar-objeto.component.css']
})
export class RegistrarObjetoComponent {
  private objetosService = inject(ObjetosService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);
  correo: string = '';
  constructor(private sharedService: SharedService) {}

  public formRegistro: FormGroup = this.fromBuild.group({
    nombreObjeto: ['', Validators.required],
    tipoObjeto: ['', Validators.required],
    descripcion: ['', Validators.required],
    creadoPor: ['', Validators.required]
  });

  // Método para registrar el objeto
  registrarObjeto() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroObjetos = {
      OBJETO: this.formRegistro.value.nombreObjeto,
      TIPO_OBJETO: this.formRegistro.value.tipoObjeto,
      DESCRIPCION: this.formRegistro.value.descripcion,
      CREADO_POR: this.sharedService.getCorreo(),
      
    };

    this.objetosService.registrarObjeto(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Objeto creado',
          text: data.msg || 'Objeto creado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['objetos']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el objeto.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  // Método para volver a la lista de objetos
  volver() {
    this.route.navigate(['objetos']);
  }
}