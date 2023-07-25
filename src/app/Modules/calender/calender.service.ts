import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Appointment } from 'src/app/modals/appoiments';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  userAuth =JSON.parse(localStorage.getItem('userAuth'))?.user
  constructor(private api: ApiService) { }

  getAppominets(): Observable<any[]> {
    return this.api.get<any[]>('appointments');
  }
  addAppominets(appointment:Appointment): Observable<Appointment> {
    let body={
      data:{
        address:appointment?.address,
        deposit:appointment?.deposit,
        fromDate:appointment.fromDate,
        toDate:appointment.toDate,
        notes:appointment?.notes,
        number:appointment.number,
        customer:{
          firstName:appointment.firstName,
          middleName:appointment.middleName,
          lastName:appointment.lastName,
        },
        phone:appointment.phone,
        employee:appointment.employee.id,
        appoBy:this.userAuth.id,
      }
    }
    return this.api.post<Appointment>('/appointments',body);
  }

  retreiveAppo(id): Observable<any[]>{
    return this.api.get<any[]>(`appointments/${id}`);

  }
}
