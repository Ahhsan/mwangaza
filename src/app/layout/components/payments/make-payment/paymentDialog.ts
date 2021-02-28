import { Component, OnInit, Output, Inject } from '@angular/core';
import { LoanPaymentService } from '../../../../services/loanPayments/loan-payment.service';
import PNotify from 'pnotify/dist/es/PNotify';
import * as _moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



//Make payment dialog

@Component({
    selector: 'paymentDialog',
    template: `<h1 mat-dialog-title>Make Payment</h1>
    <h4><b>Payment Date:</b> {{date|date:'dd MMMM yyyy'}}</h4>
    <div mat-dialog-content>
    <p style='margin:-1%'>Enter Amount: </p>
    <mat-form-field>
    <input style="
    border-radius: 3px;
    padding: 1%;
    height: 30px;" matInput type='number' [(ngModel)]="payment.amountPayed">
      </mat-form-field>
      <p style='margin:-1%'>Mpesa / Receipt Number:  </p>
      <mat-form-field>
        <input style="
        border-radius: 3px;
        padding: 1%;
        height: 30px;" type='text' matInput [(ngModel)]="payment.recipietNumber">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button (click)="submitPayment()" cdkFocusInitial>Submit</button>
    </div>`,
})

// tslint:disable-next-line:component-class-suffix
export class paymentDialog {
    paymentAmount;
    MpesaCode;
    loanPaymentList;
    payment = {
        loanId: 0,
        loanProductID: 0,
        loanPaymentID: 0,
        amountPayed: 0,
        recipietNumber: ''
        // dateReceived: _moment().utc().format(),
    }
    constructor(
        public dialogRef: MatDialogRef<paymentDialog>,
        @Inject(MAT_DIALOG_DATA) public loanPayment: any,
        private loanPaymentService: LoanPaymentService
        // @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        console.log('Data: ', loanPayment)
        this.loanPaymentList = loanPayment.dataKey.loanPayments
        console.log('LoanPayments: ', this.loanPaymentList)
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    // tslint:disable-next-line:typedef
    submitPayment() {

        let lps = this.loanPaymentList.filter(lpayment => {
            return !lpayment.amountReceived
        })
        console.log('LoanPayment ID: ', lps)
        this.payment.loanId = this.loanPayment.dataKey.loanId;
        this.payment.loanProductID = this.loanPayment.dataKey.loanProductId;
        this.payment.loanPaymentID = lps[0].loanPaymentId
        // tslint:disable-next-line:prefer-const
        console.log('Payment going to be made is: ', this.payment)
        this.loanPaymentService.makePayment(this.payment).subscribe((response) => {
            console.log('Response: ', response)
            PNotify.success({
                title: 'Payment successfully processed.',
                text: 'Redirecting to list page',
                minHeight: '75px'
            });
            this.dialogRef.close();
            // location.reload();
        }, (error) => {
            PNotify.error({
                title: 'Error while making payments...',
                minHeight: '75px'
            });

        })

    }

}
