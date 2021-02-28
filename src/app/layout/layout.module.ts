import { NgModule } from '@angular/core';

import { VerticalLayout1Module } from 'app/layout/vertical/layout-1/layout-1.module';
import { VerticalLayout2Module } from 'app/layout/vertical/layout-2/layout-2.module';
import { VerticalLayout3Module } from 'app/layout/vertical/layout-3/layout-3.module';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule, MatSelectModule, MatRippleModule } from '@angular/material';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableExporterModule } from 'mat-table-exporter';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseSharedModule } from '@fuse/shared.module';
import { HorizontalLayout1Module } from 'app/layout/horizontal/layout-1/layout-1.module';
import { AddSalesPersonComponent } from './components/Sales/add-sales-person/add-sales-person.component';
import { from } from 'rxjs';
import { LoginComponent } from './components/login/login.component';
import { NewLoanComponent } from './components/loan/new-loan/new-loan.component';
import { ListSalesComponent } from './components/Sales/list-sales/list-sales.component';
import { NewCustomerComponent } from './components/customer/new-customer/new-customer.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { NewOrganizationComponent } from './components/organization/new-organization/new-organization.component';
import { ListOrganizationComponent } from './components/organization/list-organization/list-organization.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { NewAdminComponent } from './components/admin/new-admin/new-admin.component';
import { ListAdminComponent } from './components/admin/list-admin/list-admin.component';
import { DialogOverviewExampleDialog } from '@fuse/components/theme-options/theme-options.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoanListComponent } from './components/loan/loan-list/loan-list.component';
import { LoanDetailComponent } from './components/loan/loan-detail/loan-detail.component';
import { ReceivePaymentComponent } from './components/payments/receive-payment/receive-payment.component';
import { MakePaymentComponent } from './components/payments/make-payment/make-payment.component';
import { paymentDialog } from '../layout/components/payments/make-payment/paymentDialog';
import { adminDialog } from '../layout/components/admin/list-admin/list-admin.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/AutoComplete';
// pipes
import { OrderByPipe } from '../layout/pipes/order-by.pipe';
import { CollectionsReportComponent } from './components/reports/collections-report/collections-report.component';
import { EndUserReportComponent } from './components/reports/end-user-report/end-user-report.component';
import { AmountCollectedReportComponent } from './components/reports/amount-collected-report/amount-collected-report.component';
import { DebtorsReportComponent } from './components/reports/debtors-report/debtors-report.component';
import { SalesReportComponent } from './components/reports/sales-report/sales-report/sales-report.component';
import { OtherComponent } from './components/other/other/other.component';

@NgModule({
    imports: [
        VerticalLayout1Module,
        VerticalLayout2Module,
        VerticalLayout3Module,

        HorizontalLayout1Module,
        RouterModule,
        FlexLayoutModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatSortModule,
        MatTableModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatPaginatorModule,
        FormsModule,
        MatSnackBarModule,
        MatInputModule,
        MatRippleModule,
        MatCardModule,
        MatSelectModule,
        MatGridListModule,
        MatIconModule,
        MatStepperModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatCardModule,
        MatSelectModule,
        MatDialogModule,
        MatTableExporterModule,

    ],
    exports: [
        VerticalLayout1Module,
        VerticalLayout2Module,
        VerticalLayout3Module,

        HorizontalLayout1Module,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        MatGridListModule,
        MatIconModule,
        MatStepperModule

    ],
    entryComponents: [DialogOverviewExampleDialog, paymentDialog, adminDialog],
    declarations: [
        OrderByPipe,
        DialogOverviewExampleDialog,
        paymentDialog,
        adminDialog,
        AddSalesPersonComponent,
        LoginComponent,
        NewLoanComponent,
        ListSalesComponent,
        NewCustomerComponent,
        CustomerListComponent,
        NewOrganizationComponent,
        ListOrganizationComponent,
        NewProductComponent,
        ProductListComponent,
        NewAdminComponent,
        ListAdminComponent,
        LoanListComponent,
        LoanDetailComponent,
        ReceivePaymentComponent,
        MakePaymentComponent,
        CollectionsReportComponent,
        EndUserReportComponent,
        AmountCollectedReportComponent,
        DebtorsReportComponent,
        SalesReportComponent,
        OtherComponent
    ],
    providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class LayoutModule {
}
