import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  saldo: number = 0;
  gasto: number = 0;
  descripcion: string = '';
  historialGastos: { descripcion: string; monto: number }[] = [];

  agregarMonto(monto: number) {
    this.saldo += monto;
  }

  agregarGasto() {
    if (this.gasto > 0 && this.descripcion.trim()) {
      this.saldo -= this.gasto;
      this.historialGastos.push({ descripcion: this.descripcion, monto: this.gasto });
      this.gasto = 0;
      this.descripcion = '';
    }
  }
}
