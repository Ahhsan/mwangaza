import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableExporterModule } from 'mat-table-exporter';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AddSalesPersonComponent } from './layout/components/Sales/add-sales-person/add-sales-person.component';
import { LoginComponent } from './layout/components/login/login.component';
import { MasterLayoutComponent } from './master-layout/master-layout.component';
import { NewLoanComponent } from './layout/components/loan/new-loan/new-loan.component';
import { ListSalesComponent } from './layout/components/Sales/list-sales/list-sales.component';
import { NewCustomerComponent } from './layout/components/customer/new-customer/new-customer.component';
import { CustomerListComponent } from './layout/components/customer/customer-list/customer-list.component';
import { NewOrganizationComponent } from './layout/components/organization/new-organization/new-organization.component';
import { ListOrganizationComponent } from './layout/components/organization/list-organization/list-organization.component';
import { NewProductComponent } from './layout/components/products/new-product/new-product.component';
import { ProductListComponent } from './layout/components/products/product-list/product-list.component';
import { NewAdminComponent } from './layout/components/admin/new-admin/new-admin.component';
import { ListAdminComponent } from './layout/components/admin/list-admin/list-admin.component';
import { LoanListComponent } from './layout/components/loan/loan-list/loan-list.component';
import { ReceivePaymentComponent } from './layout/components/payments/receive-payment/receive-payment.component';
import { MakePaymentComponent } from './layout/components/payments/make-payment/make-payment.component';
import { AuthGuard } from './guards/auth.guard';
import { TokenInterceptorService } from './services/token/token-interceptor.service';
import { CollectionsReportComponent } from './layout/components/reports/collections-report/collections-report.component';
import { EndUserReportComponent } from './layout/components/reports/end-user-report/end-user-report.component';
import { AmountCollectedReportComponent } from './layout/components/reports/amount-collected-report/amount-collected-report.component';
import { DebtorsReportComponent } from './layout/components/reports/debtors-report/debtors-report.component';
import { SalesReportComponent } from 'app/layout/components/reports/sales-report/sales-report/sales-report.component';
import { CurrencyPipe } from '@angular/common';
import { OtherComponent } from './layout/components/other/other/other.component';


const appRoutes: Routes = [
    {
        path: '',
        component: MasterLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: '/login',
                pathMatch: 'full'
            },
            {
                path: 'saveSalesPerson',
                component: AddSalesPersonComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'searchsalesperson',
                component: ListSalesComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'newcustomer',
                component: NewCustomerComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'searchcustomer',
                component: CustomerListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'neworganization',
                component: NewOrganizationComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'searchorganization',
                component: ListOrganizationComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'newproduct',
                component: NewProductComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'searchpoduct',
                component: ProductListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'newloan',
                component: NewLoanComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'searchLoan',
                component: LoanListComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'newadmin',
                component: NewAdminComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'searchadmin',
                component: ListAdminComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'receivePayments',
                component: ReceivePaymentComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'makePayments',
                component: MakePaymentComponent,
                canActivate: [AuthGuard]

            },
            {
                path: 'collectionsReport',
                component: CollectionsReportComponent,
                canActivate: [AuthGuard]

            },
            {
                path: 'endUserReport',
                component: EndUserReportComponent,
                canActivate: [AuthGuard]

            },
            {
                path: 'amountCollectedReport',
                component: AmountCollectedReportComponent,
                canActivate: [AuthGuard]

            },
            {
                path: 'salesReport',
                component: SalesReportComponent,
                canActivate: [AuthGuard]

            },
            
            {
                path: 'debtorsReport',
                component: DebtorsReportComponent,
                canActivate: [AuthGuard]

            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
    },

    {
        path: '**',
        redirectTo: 'salesperson'
    },
    {
        path: 'other',
        component: OtherComponent,
        // canActivate: [AuthGuard]

    },
];

@NgModule({
    imports: [
        BrowserModule,
        FlexLayoutModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatTableModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        MatTableExporterModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatDialogModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule
    ],
    declarations: [
        AppComponent,
        MasterLayoutComponent
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,

    ],
    bootstrap: [
        AppComponent
    ],
    providers: [AuthGuard, {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true
    }, { provide: MatDialogRef, useValue: {}, },
        CurrencyPipe,
    ]

})
export class AppModule {
}
