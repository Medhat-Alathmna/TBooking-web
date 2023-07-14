import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigEnvironmentService {
    private appConfig;

    constructor (private injector: Injector) { }


    get config() {
        return this.appConfig;
    }
}