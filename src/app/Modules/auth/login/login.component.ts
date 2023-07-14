import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ResponseBody } from 'src/app/modals/response';
import { UserToken } from 'src/app/modals/UserToken';
import { AuthService } from '../auth.service';
import { MenuService } from 'src/app/Layout/Menu/app.menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(public translate: TranslateService, private authService: AuthService, 
    public messageService: MessageService, private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute,

    @Inject(DOCUMENT) private document: Document) {
    super(messageService, translate)
  }
  lang = localStorage.getItem('currentLang')
  user: string

  password: string
  currentLogo: any
  currentBacground: any

  langs: MenuItem[] = [
    {
      label: 'العربية',
      command: () => {
        this.changeLang('ar')
      }
    },
    {
      label: 'English', command: () => {
        this.changeLang('en')
      }
    },

  ]
  landingPage: any
  primaryColor:any
  ngOnInit(): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.keyCode === 13 ) {
		this.login()
			}
		});
  }
 
  login() {
    this.loading = true
    this.authService.login(this.user, this.password).subscribe((user: ResponseBody<UserToken>) => {
      this.loading = false

      if (!isSet(user.data)) {
        return this.errorMessage(user.message)
      }
      const date = new Date(user.data.expireAt * 1000);
      const authData = {
        user: user.data.user,
        token_data: user.data.token,
        token_expires: date.toString(),
      }

      localStorage.setItem('authData', JSON.stringify(authData))
      this.authService.authData.next(authData)
      // this.router?.navigate(['/'], { relativeTo: this.route });
      window.location.href = '/'+this.landingPage



    }, error => {
      this.loading = false
    })
  }
  changeLang(lang) {
    this.translate.use(lang)
    this.translate.currentLang = lang
    localStorage.setItem('currentLang', lang)
    const htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router?.navigate([this.router?.url], { relativeTo: this.route });
  }
}
