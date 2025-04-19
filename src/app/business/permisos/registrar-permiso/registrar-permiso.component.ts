import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermisosService } from '../../../services/permisos.service'; // Asegúrate de crear este servicio
import { RegistroPermiso } from '../../../interfaces/Permisos/RegistroPermisos';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RolesService } from '../../../services/roles.service'; 
import { SharedService } from '../../../shared.service';
import { ObjetosService } from '../../../services/objetos.service';


@Component({
  selector: 'app-registrar-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar-permiso.component.html',
  styleUrls: ['./registrar-permiso.component.css']
})
export class RegistrarPermisoComponent {
    constructor(private sharedService: SharedService) {}
    
  private objetosService = inject(ObjetosService);
  private rolesService = inject(RolesService);
  private permisosService = inject(PermisosService);
  private route = inject(Router);

  public fromBuild = inject(FormBuilder);
  public listaRoles: any[] = [];
public listaObjetos: any[] = [];

  public formRegistro: FormGroup = this.fromBuild.group({
    idRol: ['', Validators.required],
    idObjeto: ['', Validators.required],
    permisoInsercion: ['', [Validators.required, Validators.pattern(/^(si|no)$/i)]],
    permisoEliminacion: ['', [Validators.required, Validators.pattern(/^(si|no)$/i)]],
    permisoActualizacion: ['', [Validators.required, Validators.pattern(/^(si|no)$/i)]],
    permisoConsultar: ['', [Validators.required, Validators.pattern(/^(si|no)$/i)]],

  });
  ngOnInit(): void {
   this.rolesService.rolesget().subscribe({
         next: (data) => {
           if (data.ListRoles.length > 0) {
             this.listaRoles = data.ListRoles;
           }
         },
         error: (error) => {console.error('Error al cargar objetos', error)
         },
       });

       this.objetosService.objetosget().subscribe({
        next: (data) => {
          if (data.Lista_Objetos.length > 0) {
            this.listaObjetos = data.Lista_Objetos;
          }
        },
        error: (error) => {console.error('Error al cargar objetos', error)
        },
      });
  
  }

  // Método para registrar el permiso
  registrarPermiso() {
    if (this.formRegistro.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: RegistroPermiso = {
      ID_ROL: this.formRegistro.value.idRol,
      ID_OBJETO: this.formRegistro.value.idObjeto,
      PERMISO_INSERCION: this.formRegistro.value.permisoInsercion.toUpperCase(),
      PERMISO_ELIMINACION: this.formRegistro.value.permisoEliminacion.toUpperCase(),
      PERMISO_ACTUALIZACION: this.formRegistro.value.permisoActualizacion.toUpperCase(),
      PERMISO_CONSULTAR: this.formRegistro.value.permisoConsultar.toUpperCase(),
      CREADO_POR: this.sharedService.getCorreo(),
      FECHA_CREACION: new Date() // Agrega la fecha actual
    };

    this.permisosService.registrarPermiso(objeto).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Permiso creado',
          text: data.msg || 'Permiso creado correctamente.',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.route.navigate(['permisos']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.error?.msg || 'Ocurrió un error al registrar el permiso.',
          confirmButtonColor: '#d33',
        });
      }
    });
  }

  // Método para volver a la lista de permisos
  volver() {
    this.route.navigate(['permisos']);
  }
}
