import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { GastoService } from '../../services/gasto.service';
import { HttpClientModule } from '@angular/common/http';
import { Gasto } from '../models/gasto';
import { IngresoService } from '../../services/ingreso.service';
import { Ingreso } from '../models/ingreso';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  saldo: number = 0;
  ingresos: Ingreso[] = [];
  historialGastos: Gasto[] = [];

  gastoAEditar: Gasto | null = null;  // Variable para almacenar el gasto a editar
  editandoIdGasto: number | null = null;



  filtroFecha: string = '';
  filtroMetodoPago: string = '';

  // Variables para formularios
  montoIngreso: number = 0;
  descripcionGasto: string = '';
  montoGasto: number = 0;
  metodoPagoGasto: string = 'efectivo';
  fechaGasto: string = '';

  constructor(
    private gastoService: GastoService,
    private ingresoService: IngresoService
  ) {}

  ngOnInit() {
    this.obtenerGastos();
    this.obtenerIngresos();
  }

  obtenerIngresos() {
    this.ingresoService.getIngresos().subscribe({
      next: (data) => {
        this.ingresos = data;
        this.calcularSaldo();
      },
      error: (err) => console.error("Error al obtener ingresos:", err)
    });
  }

  obtenerGastos() {
    this.gastoService.getGastos().subscribe({
      next: (data) => {
        this.historialGastos = data;
        this.calcularSaldo();
      },
      error: (err) => console.error("Error al obtener gastos:", err)
    });
  }

  agregarIngreso() {
    if (this.montoIngreso <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    const nuevoIngreso = new Ingreso(this.montoIngreso, new Date().toISOString().split('T')[0]);

    this.ingresoService.agregarIngreso(nuevoIngreso).subscribe({
      next: (ingreso) => {
        this.ingresos.push(ingreso);
        this.calcularSaldo();
        alert('Ingreso agregado correctamente.');
      },
      error: (error) => {
        console.error("Error al agregar el ingreso:", error);
      }
    });
  }

  agregarGasto() {
    if (this.montoGasto <= 0 || !this.descripcionGasto || !this.fechaGasto) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    const nuevoGasto = new Gasto( this.descripcionGasto, this.montoGasto, this.metodoPagoGasto, this.fechaGasto);

    this.gastoService.agregarGasto(nuevoGasto).subscribe({
      next: (gasto) => {
        this.historialGastos.push(gasto);
        this.calcularSaldo();
        alert('Gasto agregado correctamente.');
      },
      error: (error) => {
        console.error("Error al agregar el gasto:", error);
      }
    });
  }

  eliminarGasto(index: number, id: number) {
    // Confirmación antes de eliminar
    if (confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
      // Asegurarnos de que el id sea un número válido
      const gastoId = Number(id);
      if (isNaN(gastoId)) {
        alert("ID de gasto inválido");
        return;
      }
  
      // Llamar al servicio para eliminar el gasto
      this.gastoService.eliminarGasto(gastoId).subscribe({
        next: () => {
          // Eliminar el gasto de la lista local
          this.historialGastos.splice(index, 1);
  
          // Volver a calcular el saldo
          this.calcularSaldo();
          
          // Notificar al usuario
          alert('Gasto eliminado correctamente.');
        },
        error: (error) => {
          console.error("Error al eliminar el gasto:", error);
          alert('Error al eliminar el gasto.');
        }
      });
    }
  }
  
  // editarGasto(index: number, id: number) {
  //   // Buscar el gasto que se va a editar
  //   const gasto = this.historialGastos.find(g => g.id === Number(id));
  //   if (gasto) {
  //     this.gastoAEditar = { ...gasto };  // Crear una copia para editar
  //   }
  // }
  
  actualizarGasto() {
    if (this.gastoAEditar) {
      this.gastoService.editarGasto(this.gastoAEditar.id, this.gastoAEditar).subscribe({
        next: (gastoActualizado) => {
          // Actualizar la lista con el gasto actualizado
          const index = this.historialGastos.findIndex(g => g.id === gastoActualizado.id);
          if (index !== -1) {
            this.historialGastos[index] = gastoActualizado;
          }
          this.calcularSaldo();
          this.gastoAEditar = null; // Limpiar el formulario de edición
          alert('Gasto actualizado correctamente.');
        },
        error: (error) => {
          console.error("Error al actualizar el gasto:", error);
        }
      });
    }
  }
  editarGasto(index: number, id: number) {
    const gasto = this.historialGastos[index];
    this.descripcionGasto = gasto.name??"";
    this.montoGasto = +gasto.amount;
    this.metodoPagoGasto = gasto.method_of_payment??"";;
    this.fechaGasto = gasto.date??"";;
    this.editandoIdGasto = id;
  }
  
  guardarGastoEditado() {
    if (!this.editandoIdGasto) return;
  
    const gastoActualizado = new Gasto(
      this.descripcionGasto,
      this.montoGasto,
      this.metodoPagoGasto,
      this.fechaGasto
    );
  
    this.gastoService.editarGasto(Number(this.editandoIdGasto), gastoActualizado).subscribe({
      next: (gastoModificado) => {
        const index = this.historialGastos.findIndex(g => g.id === Number(this.editandoIdGasto));
        if (index !== -1) {
          this.historialGastos[index] = gastoModificado;
          this.calcularSaldo();
        }
        this.resetFormulario();
      },
      error: (err) => console.error("Error al editar gasto:", err)
    });
  }
  
  cancelarEdicion() {
    this.resetFormulario();
  }
  editarGastoDesdeItem(gasto: Gasto) {
    this.editandoIdGasto = gasto.id;
    this.descripcionGasto = gasto.name??"";
    this.montoGasto = Number(gasto.amount);
    this.metodoPagoGasto = gasto.method_of_payment??"";
    this.fechaGasto = gasto.date??"";
  }
  
  eliminarGastoDesdeItem(gasto: Gasto) {
    const index = this.historialGastos.findIndex(g => g.id === gasto.id);
    if (index > -1) {
      this.eliminarGasto(index, gasto.id);
    }
  }
  
  resetFormulario() {
    this.descripcionGasto = '';
    this.montoGasto = 0;
    this.metodoPagoGasto = 'efectivo';
    this.fechaGasto = '';
    this.editandoIdGasto = null;
  }
  

  calcularSaldo() {
    const totalIngresos = this.ingresos.reduce((acc, ingreso) => acc + (parseFloat(ingreso.amount as any) || 0), 0);
    const totalGastos = this.historialGastos.reduce((acc, gasto) => acc + (parseFloat(gasto.amount as any) || 0), 0);
    this.saldo = totalIngresos - totalGastos;
  }

  get gastosFiltrados() {
    return this.historialGastos.filter(gasto => {
      return (
        (this.filtroFecha ? gasto.date === this.filtroFecha : true) &&
        (this.filtroMetodoPago ? gasto.method_of_payment === this.filtroMetodoPago : true)
      );
    });
  }

  get historialConSaldo(): { gasto: Gasto, saldoRestante: number }[] {
    let saldoActual = this.ingresos.reduce((acc, ingreso) => acc + ingreso.amount, 0);
    const historial = [];
  
    // Ordenar los gastos por fecha (opcional pero recomendado)
    const gastosOrdenados = [...this.historialGastos].sort((a, b) => new Date(a.date??"no hay fecha").getTime() - new Date(b.date??"no hay fecha").getTime());
  
    for (let gasto of gastosOrdenados) {
      saldoActual -= gasto.amount;
      historial.push({ gasto, saldoRestante: saldoActual });
    }
  
    return historial;
  }
  
}
 
