import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FeeService } from 'src/app/services/fee.service';
import { ApiResponse } from 'src/app/models/models';
import { AlertService } from 'ngx-alerts';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import * as moment from 'moment';

@Component({
  selector: 'app-optional-fee-manage',
  templateUrl: './optional-fee-manage.component.html',
  styleUrls: ['./optional-fee-manage.component.scss']
})
export class OptionalFeeManageComponent implements OnInit {
  optionalFeeType: any;
  @Input() studentId: string;
  @Input() classId: string;
  @Output() refreshAction = new EventEmitter<string>();
  constructor( private feeService: FeeService, public progressbar: ProgressBarService,
               public alertService: AlertService) { }

  ngOnInit(): void {
    this.getFeeDetails();
  }

  getFeeDetails(){
    this.feeService.listFeeDetails(this.studentId, this.classId).subscribe(
      (res: ApiResponse) => {
        // console.log(res.data.filter(p => p.Compulsory === 0));
        this.optionalFeeType = res.data.filter(p => p.Compulsory === 0);
      }
    );
  }

  checkInclude(row){
    return row.Occurrence !== row.Status;
  }

  saveOptionalFeeType(row, e){
    if (e.checked){
      return;
    }
    this.progressbar.startLoading();
    const feeObserver = {
      next: x => {
        this.progressbar.completeLoading();
        if (this.feeService.message.status === 1){
          this.progressbar.setSuccess();
          this.alertService.success(this.feeService.message.message);
          this.getFeeDetails();
          this.refreshAction.emit(this.studentId);
        }else{
          this.progressbar.setError();
          this.alertService.warning(this.feeService.message.message);
        }
      },
      error: err => {
        console.error(err);
        this.progressbar.completeLoading();
        this.progressbar.setError();
        this.alertService.danger('Something Wrong');
      },
    };
    // this.payDate = moment(result.payDate.value).format('YYYY-MM-DDTHH:mm:ss');

    const datamodel: any = row;
    datamodel.PaidAmount = 0;
    datamodel.StudentId = this.studentId;
    datamodel.PaidDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    for (let i = 0; i <= (row.Occurrence - row.Status); i++){
      datamodel.Status = row.Status + 1;
      console.log(datamodel);
      this.feeService.addUpdateFee(datamodel).subscribe(feeObserver);
    }
  }

}
