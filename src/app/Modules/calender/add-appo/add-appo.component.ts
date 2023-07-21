import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalenderComponent } from 'src/app/Shared/calender/calender.component';
import { EntityViewerComponent } from 'src/app/Shared/entity-viewer/entity-viewer.component';
import { FindUserComponent } from 'src/app/Shared/find-user/find-user.component';
import { InputComponent } from 'src/app/Shared/input/input.component';
import { LoadingComponent } from 'src/app/Shared/loading/loading.component';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { TextAreaComponent } from 'src/app/Shared/text-area/text-area.component';
import { PrimengComponentsModule } from 'src/app/primeng-components.module';

@Component({
  selector: 'app-add-appo',
  templateUrl: './add-appo.component.html',
  styleUrls: ['./add-appo.component.scss'],
  standalone: true,
  imports: [FormsModule,
    TranslateModule,
    PrimengComponentsModule,
    InputComponent,
    SidebarComponent,
    CalenderComponent,
    FindUserComponent,
    EntityViewerComponent,
    TextAreaComponent,
    LoadingComponent,
],
})
export class AddAppoComponent implements OnInit {

  Appointment
  @Input() display: boolean = false
  @Input() detailMode: boolean = false
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    console.log(this.display);
    
  }

  onHide() {
    this.display = false
    setTimeout(() => {
      this.displayChange.emit(false)
    }, 300);
  }

}
