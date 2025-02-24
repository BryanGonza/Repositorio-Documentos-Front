import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { SharedService } from '../../shared.service';
import { Usuarios } from '../../interfaces/Usuario/Usuarios';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export default class PerfilComponent {
  private usuarioService = inject(UsuariosService);
  private sharedService = inject(SharedService);

  public usuario: Usuarios | null = null;

  ngOnInit() {
    const correo = this.sharedService.getCorreo();
  
    if (correo) {
      this.usuarioService.perfil({ email: correo }).subscribe({
        next: (data) => {
          this.usuario = data;
        },
        error: (err) => {
          console.error('Error al cargar el perfil:', err);
        }
      });
    } 
  }
  

}
