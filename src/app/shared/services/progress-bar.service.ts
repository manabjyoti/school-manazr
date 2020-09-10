import { Injectable } from '@angular/core';
import { NgProgressRef } from 'ngx-progressbar';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  default = '#1B95E0';
  success = 'green';
  error = 'red';
  currentColor = this.default;
  left = 'left';

  progressRef: NgProgressRef;
  constructor() { }

  startLoading() {
    this.currentColor = this.default;
    this.progressRef.start();
  }

  completeLoading() {
    this.progressRef.complete();
  }

  setSuccess(){
    this.currentColor = this.success;
  }
  setError(){
    this.currentColor = this.error;
  }
}
