import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingreso } from '../app/models/ingreso';



@Injectable({
  providedIn: 'root'
})
export class IngresoService{
     private apiUrl = "http://localhost:8000/api/income/"; 
    
      constructor(private http: HttpClient) {}

      getIngresos(): Observable<Ingreso[]> {
        return this.http.get<Ingreso[]>(this.apiUrl);
      }
    
      agregarIngreso(ingreso: Ingreso): Observable<Ingreso> {
        return this.http.post<Ingreso>(this.apiUrl, ingreso);
      }


      // ingreso.service.ts
      editarIngreso(id: number, ingreso: Ingreso): Observable<Ingreso> {
        return this.http.put<Ingreso>(`${this.apiUrl}${id}/`, ingreso);
      }

      eliminarIngreso(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
      }


}