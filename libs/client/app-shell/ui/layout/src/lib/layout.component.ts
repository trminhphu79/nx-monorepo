import { SideBarComponent } from '@client/layout/side-bar';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
