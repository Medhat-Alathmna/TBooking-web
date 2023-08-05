import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Carousel } from 'primeng/carousel';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ResponseBody } from 'src/app/modals/response';
import { AuthService } from 'src/app/Modules/auth/auth.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss']
})
export class HomeScreenComponent extends BaseComponent implements OnInit {
  currentUser = null
  statistics: any
  @ViewChild('carousel') carousel: Carousel ;

  currentMode = 'Tasks'
  header = 'PENDING TASKS'
  currentLang ='en'

  displayTaskDetails = false
  displayAddEditTask = false
  displayAddEditCalender = false
  displayCalenderDetails = false
  constructor(private authService: AuthService, public translate: TranslateService,
    
    public messageService: MessageService) {
    super(messageService, translate)
  }
  ngOnInit(): void {


  }


}
