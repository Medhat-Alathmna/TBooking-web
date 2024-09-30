import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { RoleInfo } from 'src/app/modals/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private api: ApiService) { }


  createRole(role: any): Observable<RoleInfo> {
    let body = {
      data: {
      role: role.role,
      description: role.description,
      pages: role.pages,
    }
    }
    return this.api.post<RoleInfo>(`privileges`, body);
  }
  getRoles(): Observable<any[]> {
    return this.api.get<any[]>(`privileges`);
  }
}
