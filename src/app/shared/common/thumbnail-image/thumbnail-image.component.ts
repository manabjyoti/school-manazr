import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { environment} from '../../../../environments/environment';

@Component({
  template: `<img [src] = "imgURL" />`,
})
export class ThumbnailImageComponent implements ViewCell, OnInit {

  public imgURL: string;
  // public someId: string;

  @Input()
  public value: string;

  @Input()
  rowData: any;

  ngOnInit() {
    if (!this.value || this.value === null || typeof this.value === 'undefined'){
      this.imgURL = environment.uploadFilesURL + this.rowData.Sex + '.png';
    }else{
      this.imgURL = environment.uploadFilesURL + this.value;
    }
    // this.someId = this.value;
  }

}
