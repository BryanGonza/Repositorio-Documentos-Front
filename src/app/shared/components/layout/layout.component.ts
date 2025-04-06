import { Component } from '@angular/core';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent, RouterOutlet, NgIf, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export default class LayoutComponent {
  sidebarVisible: boolean = true;

  toggleSidebar() {
    console.log('toggleSidebar en layout');
    this.sidebarVisible = !this.sidebarVisible;
  }
}
