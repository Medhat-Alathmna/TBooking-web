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

  getApprovedAppominetsCalender(): Observable<any[]> {
    return this.api.get<any[]>(`appointments?populate=*&filters[approved][$eq]=true&filters[hide][$eq]=false`);
  }
  getUnApprovedAppominets(currentDate): Observable<any[]> {
    return this.api.get<any[]>(`appointments?populate=*&filters[approved][$eq]=false&filters[hide][$eq]=false&filters[fromDate][$gte]=${currentDate}`);
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
        hide:false,
        appoBy:this.userAuth.username,
      }      
    }
    console.log(body);
    
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

  updateAppointemt(appointment:Appointment): Observable<Appointment> {
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
      }
    }
    return this.api.put<Appointment>(`/appointments/${appointment.id}`,body);
  }

  retreiveAppo(id): Observable<any[]>{
    return this.api.get<any[]>(`appointments/${id}?populate=*`);

  }
  hideAppointment(appointment:Appointment): Observable<any> {
    let body={
      data:{
        hide:true,
        deletedBy:this.userAuth.username
      }
    }
    return this.api.put<Appointment>(`/appointments/${appointment.id}`,body); 
   }
   getEmployee(): Observable<any[]> {
    return this.api.get<any[]>(`users?populate=*&filters[hide][$eq]=false`);
  }
}
