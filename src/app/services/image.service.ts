import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  message: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  apiUrl: any = environment.apiURL + 'file-upload.php';

  uploadImage(image: File): Observable<any> {
    // console.log(fileName);
    const headers = new HttpHeaders({
      Authorization : 'Bearer ' + this.authService.myRawToken
    });
    const formData = new FormData();

    formData.append('image', image);
    // formData.append('fileName', fileName);
    // formData.append('fileType', fileType);
    return this.http.post(this.apiUrl, formData, {headers}).pipe(
      map((response: any) => {
        this.message = response;
      })
    );
  }
}
