import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/fee/fee/fee.component';

@Component({
  selector: 'app-money-receipt',
  templateUrl: './money-receipt.component.html',
  styleUrls: ['./money-receipt.component.scss']
})
export class MoneyReceiptComponent{

  payDate = new FormControl(new Date());
  payAmount = new FormControl();
  amountArr: number[];
  paidDateArr: string[];
  constructor(
    public dialogRef: MatDialogRef<MoneyReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      // console.log(data);
      this.amountArr = data.row.PaidAmount.split(',');
      this.paidDateArr = data.row.PaidDate.split(',');
      // console.log(this.amountArr);
      // this.payAmount.setValue((data.row.Amount - data.row.Discount) + (data.row.Amount - data.row.Discount) * data.row.Tax / 100);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  moneyFormat(amt){
    // tslint:disable-next-line: radix
    return '₹ ' + parseInt(amt).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

}
