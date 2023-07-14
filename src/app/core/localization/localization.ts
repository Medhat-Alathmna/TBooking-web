import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppTranslateService } from './app-injector';
@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule],
  exports: [TranslateModule],
})
export class LocalizationModule {
  public static translate: TranslateService;

  constructor(translate: TranslateService) {
    LocalizationModule.translate = translate;
  }
}

// AOT compilation support
export function HttpLoadFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function trans(v: string): string {
  
  return AppTranslateService?.instant(v);
}
