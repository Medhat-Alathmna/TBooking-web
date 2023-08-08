import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { BaseComponent } from 'src/app/core/base/base.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent  extends BaseComponent implements OnInit {

  email
  password
  confirm
  token

  emailMode:boolean=true

  constructor(public translate: TranslateService, private authService: AuthService, 
    public messageService: MessageService,) { super(messageService, translate) }

  ngOnInit(): void {
  }
  sendEmail() {
    if (!this.email) return this.errorMessage('Rejected', 'Please Insert Email')
    this.loading = true
    this.authService.sendEmail( this.email).subscribe((user: any) => {
      this.loading = false
      this.emailMode=false
    }, error => {
      this.loading = false
      console.log(error);
    })
  }
}
