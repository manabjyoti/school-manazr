import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-i-card',
  templateUrl: './i-card.component.html',
  styleUrls: ['./i-card.component.scss']
})
export class ICardComponent implements OnInit, AfterViewInit{

  @Input() card: any;
  @Input() data: any;
  @Input() image = true;
  loading = true;
  imageReady = false;
  @ViewChild('icard') icard: ElementRef;
  @ViewChild('icardHTML') icardHTML: ElementRef;
  @ViewChild('icardimage') icardimage: ElementRef;

  constructor(private authService: AuthService){}

  ngOnInit(){
    // console.log(this.data);
    if (this.data){
      this.loading = false;
      this.data.map(v => {
        v.FullName = v.FirstName + ' ' + v.LastName;
        v.Photo = environment.uploadFilesURL + (v.Photo !== null ? v.Photo : v.Sex + '.png');
        v.Photo = '../../assets/faces-clipart/' + v.Sex + '.png';
        v.orgName = this.authService.myuser.orgName;
      });

      // console.log(this.data);
    } else {
        this.data = [{
          Photo: '../../assets/faces-clipart/male.png',
          FullName: 'Person Name',
          ClassName: 'Class',
          RollNo: '0',
          Address: 'Some Address Goes here...',
          StudentID: 'Student ID',
          orgName: 'Organization Name'
        }];
        this.loading = false;
      }
  }

  ngAfterViewInit(){
    if (this.data && this.icard && this.icardHTML.nativeElement !== ''){
      this.icard.nativeElement.innerHTML = this.icardHTML.nativeElement.outerHTML;
      setTimeout(() => domtoimage.toPng(this.icard.nativeElement)
      .then((dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          // document.body.appendChild(img);
          this.icard.nativeElement.innerHTML = '';
          this.icardHTML.nativeElement.innerHTML = '';
          this.imageReady = true;
          this.icardimage.nativeElement.insertBefore(img, this.icard.nativeElement.childNodes[0]);
      })
      .catch((error) => {
          console.error('oops, something went wrong!', error);
      }), 1000);
    }
  }


}
