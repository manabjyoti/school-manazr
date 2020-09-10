import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Options, ImageResult } from 'ngx-image2dataurl';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { ImageService } from 'src/app/services/image.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  id: any;
  src = '../../../../assets/faces-clipart/male.png';
  loading = false;
  fileName: string;
  options: Options = {
    resize: {
      maxHeight: 120,
      maxWidth: 120
    },
    allowedExtensions: ['JPG', 'PnG']
  };

  constructor(private authService: AuthService, public progressbar: ProgressBarService,
              public alertService: AlertService, private imageService: ImageService) { }

  selected(imageResult: ImageResult) {
    if (imageResult.error) { alert(imageResult.error); }
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
    const d = new Date();
    const file = new File([this.dataURLtoBlob(this.src)], this.fileName);
    // this.form.controls.photo.setValue(fileName, {onlySelf: true});
    // return;
    this.progressbar.startLoading();
    const fileUploadObserver = {
      next: x => {
        this.progressbar.completeLoading();
        this.loading = false;
        if (this.imageService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.imageService.message.message);
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.imageService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong' + err);
      },
    };
    this.imageService.uploadImage(file).subscribe(fileUploadObserver);
  }

  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  ngOnInit(): void {
    this.id = this.authService.decodedToken.data.id;
    // this.getPhoto();
    this.fileName = 'org_avatar_' + this.authService.myuser.organizationId + '.jpg';
    this.src = environment.uploadFilesURL + this.fileName;
  }

}
