import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Librerías para PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReporteDocumento, ReporteDocumentosService } from '../../services/reporte-documentos.service';

@Component({
  selector: 'app-reporte-documentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-documentos.component.html',
  styleUrls: ['./reporte-documentos.component.css']
})
export class ReporteDocumentosComponent implements OnInit {

  private reporteService = inject(ReporteDocumentosService);

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  usuario: string = '';
  accion: string = '';
  nombreDocumento: string = '';

  // Datos del reporte
  listaReporte: ReporteDocumento[] = [];
  listaFiltrada: ReporteDocumento[] = [];

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 6; // Mostrar 6 registros por página
  totalPages: number = 1;

  ngOnInit(): void {
    this.obtenerReporte();
  }

  /**
   * Llama al servicio para obtener el reporte de documentos
   */
  obtenerReporte() {
    this.reporteService.getReporteDocumentos(
      this.fechaInicio,
      this.fechaFin,
      this.usuario,
      this.accion,
      this.nombreDocumento
    ).subscribe({
      next: (res: { reporte: ReporteDocumento[]; }) => {
        console.log('Datos recibidos del backend:', res.reporte);
        this.listaReporte = Array.isArray(res.reporte) ? res.reporte : [res.reporte];
        this.listaFiltrada = [...this.listaReporte];
        this.updatePagination();
      },
      error: (err: { error: { msg: any; }; }) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.msg || 'Error al obtener el reporte de documentos.',
        });
      }
    });
  }

  /**
   * Filtra la lista según el texto de búsqueda
   */
  filtrarReporte(query: string) {
    query = query.toLowerCase();
    this.listaFiltrada = this.listaReporte.filter(item =>
      item.NOMBRE_DOCUMENTO?.toLowerCase().includes(query) ||
      item.USUARIO_ACCION?.toLowerCase().includes(query) ||
      item.ACCION?.toLowerCase().includes(query)
    );
    this.updatePagination();
  }

  /**
   * Manejo de paginación
   */
  updatePagination() {
    this.totalPages = Math.ceil(this.listaFiltrada.length / this.itemsPerPage);
  }

  getPaginatedData(): ReporteDocumento[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.listaFiltrada.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
  }

  /**
   * Descargar reporte completo en PDF con diseño profesional
   */
  descargarPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const title = "Reporte de Documentos";
    const fecha = new Date().toLocaleString();

    // Título principal
    doc.setFontSize(18);
    doc.text(title, 14, 15);

    // Fecha de generación
    doc.setFontSize(11);
    doc.text(`Generado: ${fecha}`, 14, 22);

    // Tabla con autoTable
    const rows = this.listaFiltrada.map(item => [
      item.ID_BITACORA,
      item.NOMBRE_DOCUMENTO || 'Sin Nombre',
      item.USUARIO_ACCION,
      item.ACCION,
      item.FECHA_CREACION
    ]);

    autoTable(doc, {
      head: [['#', 'Documento', 'Usuario', 'Acción', 'Fecha']],
      body: rows,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] }, // Azul
    });

    // Pie de página
    const pageHeight = doc.internal.pageSize.height || 297;
    doc.setFontSize(10);
    doc.text('Reporte generado por el sistema de documentos.', 14, pageHeight - 10);

    // Guardar PDF
    doc.save('reporte_documentos.pdf');
  }

  /**
   * Mostrar lista completa sin paginación
   */
  verListaCompleta() {
    this.itemsPerPage = this.listaFiltrada.length; // Mostrar todos los registros
    this.currentPage = 1;
    this.updatePagination();
    Swal.fire({
      icon: 'info',
      title: 'Vista completa',
      text: 'Se muestran todos los registros sin paginación.',
    });
  }
}
