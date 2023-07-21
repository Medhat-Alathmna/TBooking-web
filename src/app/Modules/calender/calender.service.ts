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
}
