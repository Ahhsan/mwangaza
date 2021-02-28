import { Component, OnInit, Output, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from '../../../../services/loan/loan.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CustomerService } from '../../../../services/customer/customer.service';
import { LoanPaymentService } from '../../../../services/loanPayments/loan-payment.service';
import PNotify from 'pnotify/dist/es/PNotify';
import * as _moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { paymentDialog } from '../make-payment/paymentDialog';


@Component({
    selector: 'app-make-payment',
    templateUrl: './make-payment.component.html',
    styleUrls: ['./make-payment.component.scss']
})

export class MakePaymentComponent implements OnInit {
    loanId;
    loan;
    customer;
    amountEntry;
    moment: any = _moment;

    constructor(
        private route: ActivatedRoute, 
        private loanService: LoanService, 
        private loanPaymentService: LoanPaymentService, 
        private customerService: CustomerService, 
        public dialog: MatDialog) {
        this.route.paramMap.subscribe((params) => {
            this.loanId = params.get('loanId');
        });
    }

    // tslint:disable-next-line:typedef
    ngOnInit() {
        this.getLoan();
    }

    // tslint:disable-next-line:typedef
    getLoan() {
        this.amountEntry = 0;
        this.loanService.getLoan(this.loanId).subscribe((response) => {
            this.loan = response;
            console.log('Loan return from the server is: ', this.loan)
            this.customerService.getCustomer(this.loan.customerId).subscribe((resp) => {
                this.customer = resp;
                this.loan.loanProducts.forEach(product => {
                    product.loanPayments.forEach(payment => {

                        // console.log('Inside PAYMENT loop:');
                        // console.log(payment);

                        if (payment.loanPaymentId === product.loanPayments[0].loanPaymentId) {

                        }

                    });
                });
                console.log('Customer sent from server: ', this.customer);
            }, (error) => {
                console.log('Error while getting customer: ', error);
            });
        }, (error) => {
            console.log('Error while receiving loan: ', error);
        });
    }

    // tslint:disable-next-line:typedef
    makePayment(loanPayment) {
        loanPayment.receiptNumber = 3;
        loanPayment.dateReceived = _moment().utc().format();
        loanPayment.amountReceived = this.amountEntry;
        console.log('Payment against which amount will be received: ', loanPayment);
        this.loanPaymentService.makePayment(loanPayment).subscribe((response) => {
            // console.log('Payment successfully processed: ', response);
            PNotify.success({
                title: 'Payment successfully processed.',
                minHeight: '75px'
            });
            this.getLoan();
        }, (error) => {
            PNotify.error({
                title: 'Error while making payments...',
                minHeight: '75px'
            });
        });
    }

    makePaymentNew(payment) {
        alert('Product received: ' + payment)


    }

    openDialog(loanProduct): void {
        console.log('Received loan product is: ', loanProduct);
        const dialogRef = this.dialog.open(paymentDialog, {
            width: '250px',
            data: {
                dataKey: loanProduct
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.getLoan();
        });

    }
}






