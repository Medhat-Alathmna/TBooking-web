import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalenderComponent } from './calender/calender.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

export const routes: Routes = [
  { path: '', component: CalenderComponent },

];

@NgModule({
  declarations: [CalenderComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(routes),
    PrimengComponentsModule,
    TranslateModule,
    LoadingComponent
  ]
})
export class CalenderModule { }
