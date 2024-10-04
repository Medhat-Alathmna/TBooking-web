import { Component, OnInit, ViewChild } from '@angular/core';
import { Gallary } from 'src/app/modals/gallary';
import { BaseComponent, isSet } from 'src/app/core/base/base.component';
import { ProductsService } from '../../products/services.service';
import { MobileAppService } from '../mobile-app.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { PermissionService } from 'src/app/core/permission.service';

@Component({
  selector: 'app-gallary',
  templateUrl: './gallary.component.html',
  styleUrls: ['./gallary.component.scss']
})
export class GallaryComponent extends BaseComponent implements OnInit {

  editMode: boolean = false
  showPost: boolean = false
  post = new Gallary
  posts: any = []
  uploadPost
  id
  responsiveOptions: any[] | undefined;

  imgUrl = environment.imgUrl
  constructor(private mobileService: MobileAppService, public translates: TranslateService,public permissionService:PermissionService,
    public messageService: MessageService, private confirmationService: ConfirmationService) { super(messageService, translates) }

  ngOnInit(): void {
    this.getPosts()
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }
  showcreateDialog() {
    this.editMode = false
    this.post = new Gallary
    this.showPost = true
  }

  getPosts() {
    this.loading = true
    const subscription = this.mobileService.getPosts().subscribe((results: any) => {
      this.loading = false
      if (!isSet(results)) {
        return
      }
      this.posts = results.data
      subscription.unsubscribe()
    }, error => {
      this.loading = false
      subscription.unsubscribe()
    })
  }
  createPost() {
    const subscription = this.mobileService.createPost(this.post).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.getPosts()
      this.showPost = false

      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  updatePost() {
    this.loading=true
    const subscription = this.mobileService.updatePost(this.post).subscribe((data) => {
      this.loading=false
      if (!isSet(data)) {
        return
      }
      this.getPosts()
      this.showPost = false

      subscription.unsubscribe()
    }, error => {
      this.loading=false
      subscription.unsubscribe()
    })
  }
  uploadMedia(body) {
    this.loading=true
    const subscription = this.mobileService.uploadMedia(body).subscribe((data) => {
      this.loading=false
      if (!isSet(data)) {
        return
      }
      this.post.ads = data
      this.createPost()
      subscription.unsubscribe()
    }, error => {
      this.loading=false
      subscription.unsubscribe()
    })
  }
  uploadFiles(event) {
    const files = event.files
    const formData = new FormData();
    files.forEach((ads) => {
      formData.append('files', ads);
    })
    this.uploadMedia(formData)
  }
  confirm1Delete(post) {
    this.confirmationService.confirm({
      message: this.trans('Are you sure that you want to delete this Post ?'),
      header: this.trans('Confirmation'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => { 
        this.deletePost(post.id)
        post.attributes.ads.data.forEach(x=>{          
          this.onDeleteImage(x.id)
        })
       },
    });
  }
  deletePost(id) {
    const subscription = this.mobileService.deletePost(id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.successMessage(null, 'This post Deleted')
      this.getPosts()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  publishedPost(published, id) {    
    const subscription = this.mobileService.publishedPost(published, id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.successMessage(null, data.data.attributes.published?'This post Published':'This post UnPublished')
      this.getPosts()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }

  pinPost(pin, id) {
    const subscription = this.mobileService.pinPost(pin, id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      this.successMessage(null, 'This post Pinned in the top of list')
      this.getPosts()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })
  }
  showSelectedPost(post) {
    this.post = null
    this.post = post.attributes
    this.post.id=post.id
    this.showPost = true
    this.editMode = true

  }
  onDeleteImage(id) {
    const subscription = this.mobileService.deleteMedia(id).subscribe((data) => {
      if (!isSet(data)) {
        return
      }
      const deleteImg = this.post.ads.data.findIndex(x => x.id == id)
      this.post.ads.data.splice(deleteImg, 1)
      this.successMessage(null, 'This Image Deleted')
      this.getPosts()
      subscription.unsubscribe()
    }, error => {
      subscription.unsubscribe()
    })

  }
  cheackMediaType(type:string,media:any){
     if ( type?.includes(media) ) {
      return true
     }else return false
  }

}
