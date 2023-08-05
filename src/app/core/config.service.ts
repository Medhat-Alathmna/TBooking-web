import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigEnvironmentService {
    private appConfig;

    constructor (private injector: Injector) { }


    get config() {
        return this.appConfig;
    }
  
}