import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/api.service';
import { Gallary } from 'src/app/modals/gallary';

@Injectable({
  providedIn: 'root'
})
export class MobileAppService {

  constructor(private api: ApiService) { }
  createPost(post: Gallary): Observable<any> {
    let body = {
      data: {
        ads:post.ads,
        textEN:post.textEN,
        textAR:post.textAR,
        pin:false,
      }
    }
    return this.api.post<any>(`mobile-ads`, body);
  }
  updatePost(post: Gallary): Observable<any> {
    let body = {
      data: {
        textEN:post.textEN,
        textAR:post.textAR,
      }
    }
    console.log(post);
    
    return this.api.put<any>(`mobile-ads/${post.id}`, body);
  }
  uploadMedia(img: any): Observable<any> {
    return this.api.post<any>(`upload`, img);
  }
  deleteMedia(id): Observable<any> {
    return this.api.delete<any>(`upload/files/${id}`);
  }
  getPosts(): Observable<any> {
    return this.api.get<any>(`mobile-ads?populate=*&sort[0]=createdAt:desc`);
  }
  deletePost(id): Observable<any> {
    return this.api.delete<any>(`/mobile-ads/${id}`); 
   }
  publishedPost(published,id): Observable<any> {
    let body={data:{published}}
    return this.api.put<any>(`/mobile-ads/${id}`,body); 
   }
  pinPost(pin,id): Observable<any> {
    let body={data:{pin}}
    return this.api.put<any>(`/mobile-ads/${id}`,body); 
   }
  getMainSettings(): Observable<any> {
    return this.api.get<any>(`/main-settings-mobile`); 
   }
}
