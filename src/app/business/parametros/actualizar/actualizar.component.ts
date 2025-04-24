import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametrosService } from '../../../services/parametros.service';
import Swal from 'sweetalert2';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { parametros } from '../../../interfaces/Parametros/resposeParametros';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-actualizar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar.component.html',
  styleUrl: './actualizar.component.css',
})
export default class ActualizarComponent {
  private route = inject(Router);
  private PService = inject(ParametrosService);

  paramId: number = 0;
  NombreParame: string = '';
  ValorParametro: string = '';
  CantIntentos: number = 0;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // Usar ActivatedRoute para acceder a los queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramId = params['id'],
      this.NombreParame = params['parametro'];
      this.ValorParametro = params['valor'];
      this.CantIntentos = params['numerosIntentos'];
    });
  }

  actualizarParametro() {
    const token = localStorage.getItem('token') || '';
    const decodedToken: any = jwtDecode(token);
    // Crear objeto con los campos a actualizar
    const datosActualizados: any = {
      ID_PARAMETRO: this.paramId,
      PARAMETRO: this.NombreParame,
      VALOR: this.ValorParametro,
      ID_USUARIO: decodedToken.id,
      ADMIN_INTENTOS_INVALIDOS: this.CantIntentos,
    };

    // Enviar la actualización
    this.PService.actualizarParametro(
      datosActualizados.ID_PARAMETRO,
      datosActualizados.PARAMETRO,
      datosActualizados.VALOR,
      datosActualizados.ID_USUARIO,
      datosActualizados.ADMIN_INTENTOS_INVALIDOS
    ).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: res.msg || 'Parametro actualizado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['parametros']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: err.error?.msg || 'Ocurrió un error al actualizar el parametro.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['parametros']);
  }
}
