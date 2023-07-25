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
  lang = 'ar'
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
    console.log(JSON.parse(localStorage.getItem('userAuth')));

    window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.keyCode === 13 ) {
		this.login()
			}
		});
  }
 
  login() {
    if (!this.password || !this.user) return this.errorMessage('Rejected', 'Please Insert reqiure Info')
    this.loading = true
    this.authService.login(this.user, this.password).subscribe((user: any) => {
      this.loading = false
        localStorage.setItem('userAuth', JSON.stringify(user))
        this.router?.navigate(['/calender']);
    }, error => {
      this.loading = false
      console.log(error);
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
