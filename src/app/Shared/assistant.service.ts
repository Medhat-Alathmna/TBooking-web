import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class AssistantService {

  constructor(private api: ApiService) {}

  ask(message: string, type: string = 'sales'): Observable<any> {
    return this.api.post('/assistant', { message, type });
  }
}
