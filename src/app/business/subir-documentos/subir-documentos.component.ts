import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-subir-documentos',
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule], // Importa CommonModule aquí
  templateUrl: './subir-documentos.component.html',
  styleUrls: ['./subir-documentos.component.css'],
})
export class SubirDocumentosComponent {
  showUploadArea = false;
  nombreArchivo: string = "No se seleccionó ningún archivo";

  toggleUploadArea() {
    this.showUploadArea = !this.showUploadArea;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.nombreArchivo = file.name;
    } else {
      this.nombreArchivo = "No se seleccionó ningún archivo";
    }
  }

  subirArchivo(): void {
    console.log('Subiendo archivo...');
    // Aquí puedes agregar la lógica para subir el archivo, como una llamada HTTP.
  }
}