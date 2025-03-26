import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  saldo: number = 0;
  gasto: number = 0;
  descripcion: string = '';
  metodoPago: string = 'efectivo';
  fechaGasto: string = '';
  editando: number = -1; // Índice del gasto en edición
  montoOriginal: number = 0; // Guarda el monto original antes de editar

  historialGastos: { descripcion: string; monto: number; metodoPago: string; fecha: string }[] = [];

  agregarMonto(monto: number) {
    if (monto > 0) {
      this.saldo += monto;
    }
  }

  agregarGasto() {
    if (this.gasto > 0 && this.descripcion.trim() && this.gasto <= this.saldo && this.fechaGasto) {
      this.saldo -= this.gasto;
      this.historialGastos.push({
        descripcion: this.descripcion,
        monto: this.gasto,
        metodoPago: this.metodoPago,
        fecha: this.fechaGasto
      });
      this.resetFormulario();
    } else if (this.gasto > this.saldo) {
      alert('Saldo insuficiente para este gasto.');
    } else if (!this.fechaGasto) {
      alert('Por favor, selecciona una fecha para el gasto.');
    }
  }

  editarGasto(index: number) {
    const gastoEditado = this.historialGastos[index];
    this.descripcion = gastoEditado.descripcion;
    this.gasto = gastoEditado.monto;
    this.metodoPago = gastoEditado.metodoPago;
    this.fechaGasto = gastoEditado.fecha;
    this.montoOriginal = gastoEditado.monto; // Guarda el monto original antes de editar
    this.editando = index;
  }

  guardarEdicion() {
    if (this.editando !== -1) {
      // Primero, se reintegra el saldo con el monto original del gasto
      this.saldo += this.montoOriginal;

      // Verifica si el nuevo gasto no supera el saldo disponible
      if (this.gasto > this.saldo) {
        alert('Saldo insuficiente para modificar este gasto.');
        return;
      }

      // Resta el nuevo monto del saldo
      this.saldo -= this.gasto;

      // Actualiza el gasto en el historial
      this.historialGastos[this.editando] = {
        descripcion: this.descripcion,
        monto: this.gasto,
        metodoPago: this.metodoPago,
        fecha: this.fechaGasto
      };

      this.resetFormulario();
    }
  }

  eliminarGasto(index: number) {
    this.saldo += this.historialGastos[index].monto; // Reintegra el saldo al eliminar el gasto
    this.historialGastos.splice(index, 1);
  }

  resetFormulario() {
    this.descripcion = '';
    this.gasto = 0;
    this.metodoPago = 'efectivo';
    this.fechaGasto = '';
    this.editando = -1;
    this.montoOriginal = 0;
  }
}
