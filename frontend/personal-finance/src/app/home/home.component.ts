import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { GastoService } from '../../services/gasto.service';
import { HttpClientModule } from '@angular/common/http';
import { Gasto } from '../models/gasto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  saldo: number = 0;
  historialGastos: Gasto[] = [];
  descripcion: string = '';
  gasto: number = 0;
  metodoPago: string = 'efectivo';
  fechaGasto: string = '';

    constructor(private gastoService: GastoService) {}

        ngOnInit() {
          this.obtenerGastos();
        }

  obtenerGastos() {
    this.gastoService.getGastos().subscribe({
      next: (data) => {
        this.historialGastos = data;
        this.calcularSaldo();
      },
      error: (err) => {
        console.error("Error al obtener gastos:", err);
      }
    });
  }

  agregarGasto() {
    if (this.gasto <= 0 || !this.descripcion.trim() || !this.fechaGasto) {
      alert("Por favor, complete todos los campos correctamente.");
      return;
    }

    const nuevoGasto: Gasto = {
      id:1,
      name: this.descripcion,               
      amount: this.gasto,                   
      method_of_payment: this.metodoPago,   
      date: this.fechaGasto,
    };

    console.log("Enviando gasto al backend:", nuevoGasto);

    this.gastoService.agregarGasto(nuevoGasto).subscribe({
      next: (gastoGuardado) => {
        console.log("Gasto guardado correctamente:", gastoGuardado);
        this.historialGastos.push(gastoGuardado);
        this.calcularSaldo();
        this.resetFormulario();
      },
      error: (error) => {
        console.error("Error al guardar gasto:", error);
        alert("Ocurrió un error al guardar el gasto.");
      }
    });
  }

  eliminarGasto(index: number, id: number) {
    this.gastoService.eliminarGasto(id).subscribe({
      next: () => {
        this.historialGastos.splice(index, 1);
        this.calcularSaldo();
      },
      error: (error) => {
        console.error("Error al eliminar gasto:", error);
        alert("No se pudo eliminar el gasto.");
      }
    });
  }
  
  editarGasto(i: number, id?: number) {
    if (id === undefined) {
      console.warn("No se puede editar sin ID");
      return;
    }
    }

  agregarMonto(monto: number) {
    if (monto > 0) {
      this.saldo += monto;
      alert("Se agregó el monto correctamente.");
    } else {
      alert("El monto debe ser mayor que cero.");
    }
  }

  calcularSaldo() {
    this.saldo = this.historialGastos.reduce((acc, gasto) => acc - (gasto.amount ?? 0), 0);
  }

  resetFormulario() {
    this.descripcion = '';
    this.gasto = 0;
    this.metodoPago = 'efectivo';
    this.fechaGasto = '';
  }
}
 
