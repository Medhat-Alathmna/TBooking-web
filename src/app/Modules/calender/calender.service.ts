import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Appointment } from 'src/app/modals/appoiments';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {

  constructor(private api: ApiService) { }

  getAppominets(): Observable<Appointment[]> {
    return this.api.get<Appointment[]>('/CustomerAppo');
  }
  addAppominets(appointment:Appointment,userID): Observable<Appointment> {
    let body ={
      FK_Emp:1,
      First_Name:appointment.First_Name,
      Middle_Name:appointment.Middle_Name,
      Last_Name:appointment.Last_Name,
      Phone:appointment.Phone,
      FromTime:appointment.FromTime,
      ToTime:appointment.ToTime,
      Deposit:appointment.Deposit,
      Address:appointment?.Address,
      Inserted_By:userID,
      
    }
    console.log(body);
    
    return this.api.post<Appointment>('/CustomerAppo',body);
  }
}
