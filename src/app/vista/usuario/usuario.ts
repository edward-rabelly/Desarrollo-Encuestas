import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tabla } from '../../component/tabla/tabla';
import { UsuarioService } from '../../servicios/usuario.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, Tabla],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class UsuarioComponent implements OnInit {

  dataSource: any[] = [];
  isLoading = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.dataSource = usuarios;
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  verHistorial(usuario: any) {
    const usuarioLogueado = this.authService.getUsuarioActual();
    if (!usuarioLogueado) return;

    const idSesion = String(usuarioLogueado.id_usuario || usuarioLogueado.id);
    const idDelBoton = String(usuario.id_usuario);
    if (idSesion !== idDelBoton) return;

    this.router.navigate(['/encuesta-usuario', usuario.id_usuario]);
  }
}