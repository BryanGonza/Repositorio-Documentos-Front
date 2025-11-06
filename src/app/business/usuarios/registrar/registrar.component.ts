import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { registroUsuario } from '../../../interfaces/Usuario/RegistroUsuario';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RolesService } from '../../../services/roles.service';
import { DepartamentoService } from '../../../services/departamento.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export default class RegistrarComponent {
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  private rolesService = inject(RolesService);
  private departamentoService = inject(DepartamentoService);
  private usuarioService = inject(UsuariosService);
  private route = inject(Router);
  public fromBuild = inject(FormBuilder);
  public listaRoles: any[] = [];
  public listadepar: any[] = [];
  
  ngOnInit(): void {
    this.rolesService.rolesget().subscribe({
      next: (data) => {
        if (data.ListRoles.length > 0) {
          this.listaRoles = data.ListRoles;
        }
      },
      error: (error) => {
        console.error('Error al cargar objetos', error);
      },
    });
    this.departamentoService.Departamentoget().subscribe({
      next: (data) => {
        if (data.Listado_Departamentos.length > 0) {
          this.listadepar = data.Listado_Departamentos;
        }
      },
      error: (error) => {
        console.error('Error al cargar objetos', error);
      },
    });
  }

  public fromRegistro: FormGroup = this.fromBuild.group({
    numeroIdentidad: ['', [
      Validators.required, 
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(13),
      Validators.maxLength(13)
    ]],
    Usuario: ['', Validators.required],
    NombreUs: ['', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    ]],
    Contrasena: ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasena: ['', [Validators.required]],
    correo: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    idRol: ['', Validators.required],
    ID_DEPARTAMENTO: ['', Validators.required],
  });

  // Alterna la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Alterna la visibilidad de la confirmación de la contraseña
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get contrasenasCoinciden(): boolean {
    const contrasena = this.fromRegistro.get('Contrasena')?.value;
    const confirmarContrasena = this.fromRegistro.get('confirmarContrasena')?.value;
    return (
      contrasena && confirmarContrasena && contrasena === confirmarContrasena
    );
  }

  // Validar número de identidad (13 dígitos exactos)
  validarIdentidad() {
    const identidad = this.fromRegistro.get('numeroIdentidad')?.value;
    if (identidad && identidad.length === 13 && /^[0-9]+$/.test(identidad)) {
      // Aquí podrías agregar una verificación al servidor para evitar duplicados
      console.log('Identidad válida:', identidad);
      // this.verificarIdentidadUnica(identidad); // Comentado hasta que exista el servicio
    }
  }

  // Generar usuario automáticamente basado en el nombre
  generarUsuario() {
    const nombreCompleto = this.fromRegistro.get('NombreUs')?.value;
    if (nombreCompleto && nombreCompleto.trim().length > 0) {
      const partesNombre = nombreCompleto.trim().split(' ');
      let usuarioGenerado = '';
      
      if (partesNombre.length >= 2) {
        // Tomar primer nombre y primer apellido
        const primerNombre = partesNombre[0].toLowerCase();
        const primerApellido = partesNombre[1].toLowerCase();
        
        // Generar usuario: primera letra del nombre + apellido completo
        usuarioGenerado = primerNombre.charAt(0) + primerApellido;
      } else if (partesNombre.length === 1) {
        // Si solo hay un nombre, usar ese nombre completo
        usuarioGenerado = partesNombre[0].toLowerCase();
      }
      
      // Limpiar caracteres especiales y asegurar unicidad
      usuarioGenerado = usuarioGenerado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover tildes
        .replace(/[^a-z0-9]/g, ''); // Remover caracteres no alfanuméricos
      
      // Asignar el usuario generado directamente
      if (usuarioGenerado) {
        this.fromRegistro.get('Usuario')?.setValue(usuarioGenerado.toUpperCase());
      }
      
      // this.verificarUsuarioUnico(usuarioGenerado); // Comentado hasta que exista el servicio
    }
  }

  validarContrasenas() {
    if (this.contrasenasCoinciden) {
      this.fromRegistro.get('correo')?.enable();
    } else {
      this.fromRegistro.get('correo')?.disable();
    }
  }

  registrarse() {
    if (this.fromRegistro.invalid || !this.contrasenasCoinciden) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Verifica que los campos estén completos y que las contraseñas coincidan.',
        confirmButtonColor: '#3085d6',
      });
      this.fromRegistro.markAllAsTouched();
      return;
    }

    // Validación adicional de identidad
    const identidad = this.fromRegistro.value.numeroIdentidad;
    if (identidad.length !== 13 || !/^[0-9]+$/.test(identidad)) {
      Swal.fire({
        icon: 'error',
        title: 'Identidad inválida',
        text: 'El número de identidad debe tener exactamente 13 dígitos numéricos.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    // Validación de nombre completo
    const nombreCompleto = this.fromRegistro.value.NombreUs;
    if (nombreCompleto.trim().split(' ').length < 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre incompleto',
        text: 'Por favor ingrese al menos un nombre y un apellido para generar el usuario automáticamente.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const objeto: registroUsuario = {
      NUM_IDENTIDAD: this.fromRegistro.value.numeroIdentidad,
      USUARIO: this.fromRegistro.value.Usuario.toUpperCase(),
      NOMBRE_USUARIO: this.fromRegistro.value.NombreUs.toUpperCase(),
      CONTRASEÑA: this.fromRegistro.value.Contrasena.toUpperCase(),
      CORREO_ELECTRONICO: this.fromRegistro.value.correo.toUpperCase(),
      ID_ROL: this.fromRegistro.value.idRol,
      ID_DEPARTAMENTO: this.fromRegistro.value.ID_DEPARTAMENTO,
    };

    this.usuarioService.registro(objeto).subscribe({
      next: (data) => {
        console.log('Datos a enviar:', objeto);

        if (data.msg.includes('creado correctamente')) {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: data.msg,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            this.route.navigate(['usuarios']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: data.msg,
            confirmButtonColor: '#d33',
          });
        }
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: error.error?.msg || 'Error desconocido al registrar usuario.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  volver() {
    this.route.navigate(['usuarios']);
  }

  // Getters para facilitar el acceso en el template
  get numeroIdentidad() {
    return this.fromRegistro.get('numeroIdentidad');
  }

  get Usuario() {
    return this.fromRegistro.get('Usuario');
  }

  get NombreUs() {
    return this.fromRegistro.get('NombreUs');
  }

  get Contrasena() {
    return this.fromRegistro.get('Contrasena');
  }

  get confirmarContrasena() {
    return this.fromRegistro.get('confirmarContrasena');
  }

  get correo() {
    return this.fromRegistro.get('correo');
  }

  get idRol() {
    return this.fromRegistro.get('idRol');
  }

  get ID_DEPARTAMENTO() {
    return this.fromRegistro.get('ID_DEPARTAMENTO');
  }
}