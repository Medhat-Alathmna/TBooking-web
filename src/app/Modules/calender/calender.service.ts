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

  getApprovedAppominets(): Observable<any[]> {
    return this.api.get<any[]>('appointments?populate=*&filters[approved][$eq]=true');
  }
  getUnApprovedAppominets(): Observable<any[]> {
    return this.api.get<any[]>('appointments?populate=*&filters[approved][$eq]=false');
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
        services:appointment.services,
        employee:appointment?.employee?.id,
        approved:false,
        appoBy:this.userAuth.id,
      }
    }
    return this.api.post<Appointment>('/appointments',body);
  }
  approvedAction(appointment:Appointment): Observable<Appointment> {
    let body={
      data:{
        approved:appointment.approved,
      }
    }
    return this.api.put<Appointment>(`/appointments/${appointment.id}`,body);
  }

  retreiveAppo(id): Observable<any[]>{
    return this.api.get<any[]>(`appointments/${id}?populate=*`);

  }
  deleteAppointment(id): Observable<any> {
    return this.api.delete<any>(`appointments/${id}`);
  }
}
