import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { isSet } from 'src/app/core/base/base.component';
import { Appointment } from 'src/app/modals/appoiments';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class CalenderService {

  queryFilters: any[] = [];

  userAuth =JSON.parse(localStorage.getItem('userAuth'))?.user
  constructor(private api: ApiService) { }

  getCalender(): Observable<any[]> {
    return this.api.get<any[]>(`appointments?populate=*&filters[approved][$eq]=true&filters[hide][$eq]=false&filters[status][$eq]=Draft`);
  }
  getTodayAppominets(currentDate): Observable<any[]> {
    return this.api.get<any[]>(`appointments?populate=*&filters[hide][$eq]=false&filters[fromDate][$gte]=${currentDate}`);
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
  cancelAction(appointment:Appointment): Observable<Appointment> {
    let body={
      data:{
        status:appointment.status,
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
  completeAppointment(appointment:Appointment): Observable<any> {
    let body={
      data:{
        status:'Completed'
      }
    }
    return this.api.put<Appointment>(`/appointments/${appointment.id}`,body); 
   }
   getEmployee(): Observable<any[]> {
    return this.api.get<any[]>(`users?populate=role&filters[hide][$eq]=false`);
  }

  getlist(moduleName: string, pageNum?: number, rows?: number, query?: any,pop?): Observable<any[]>{
    if (!isSet(pageNum)) {
      pageNum = 1
    }
    if (!isSet(pop)) {
      pop = '*'
    }
    let filter = ''
    if (typeof query == 'object' || this.queryFilters?.length) {
      filter = this.handleQuery(query)
    } else filter = isSet(query) ? query : ''
    return this.api.get<any[]>(`${moduleName}?populate=${pop}&sort[0]=createdAt:desc&pagination[pageSize]=${rows}&pagination[page]=${pageNum}&filters[hide][$eq]=false${filter}`);

  }

  handleQuery(query: any) {
   let sum_querirs
   let querirs_
    if (isSet(query)) {
      const clone = { ...query }
      if (this.queryFilters.some(elem => elem.name === query.name)) {
        this.queryFilters.map(item => {
          if (item.name == query.name) {
            item.value = query.value
          }
        })
      } else this.queryFilters.push(clone)
    }
    if (isSet(this.queryFilters)) {
      const querirs = [...this.queryFilters];
      const length: number = querirs.length - 1;
      for (let index = 0; index < querirs.length; index++) {
        if (querirs[index].name == 'creationdate') {
          querirs[index].value = moment(querirs[index].value).format('YYYY-MM-DD')
        }
        if (isSet(querirs[index].type)) {
          querirs[index] = `&filters[${querirs[index].name}][${querirs[index].type}]=${querirs[index].value}`;
        } 
      }
      let sumquerirs = '';
      for (let index = 0; index < querirs.length; index++) {
        sum_querirs = sumquerirs + querirs[index];
      }
      return '&' + sum_querirs

    } else return ''
  }
  
 
}
