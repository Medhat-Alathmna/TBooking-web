import { Injectable } from '@angular/core';
import { isSet } from './base/base.component';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  userPermissions: { [key: string]: { [key: string]: boolean } };
  perv=JSON.parse(sessionStorage.getItem('prev'))

  // Function to set permissions
  setPermissions(permissions: { [key: string]: { [key: string]: boolean } }) {
    this.userPermissions = permissions;
  }

  // Get all permissions for the logged-in user
  getPermissions() {
    return this.userPermissions;
  }

  // Check if the user has a specific permission
  hasPermission(resource: string, action: string): boolean {
    if (!this.userPermissions && isSet(this.perv)) {
      this.userPermissions=this.perv
    }
    // Loop over the entries of userPermissions
    for (const [page, actions] of Object?.entries(this.userPermissions)) {
      // Check if the resource (page) matches
      if (page === resource) {
        // Check if the specific action exists and is true
        return actions[action] === true;
      }
    }
    return false;
  }
  
}
