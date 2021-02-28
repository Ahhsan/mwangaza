import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoanTermService } from '../../../app/services/loanTerms/loan-term.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import PNotify from 'pnotify/dist/es/PNotify';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
    animal: string;
    name: string;
}


@Component({
    selector: 'fuse-theme-options',
    templateUrl: './theme-options.component.html',
    styleUrls: ['./theme-options.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FuseThemeOptionsComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    form: FormGroup;

    @HostBinding('class.bar-closed')
    barClosed: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FormBuilder} _formBuilder
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Renderer2} _renderer
     */
    animal: string;
    name: string;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _renderer: Renderer2,
        private router: Router,
        public dialog: MatDialog
    ) {
        // Set the defaults
        this.barClosed = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Build the config form
        // noinspection TypeScriptValidateTypes
        this.form = this._formBuilder.group({
            colorTheme: new FormControl(),
            customScrollbars: new FormControl(),
            layout: this._formBuilder.group({
                style: new FormControl(),
                width: new FormControl(),
                navbar: this._formBuilder.group({
                    primaryBackground: new FormControl(),
                    secondaryBackground: new FormControl(),
                    folded: new FormControl(),
                    hidden: new FormControl(),
                    position: new FormControl(),
                    variant: new FormControl()
                }),
                toolbar: this._formBuilder.group({
                    background: new FormControl(),
                    customBackgroundColor: new FormControl(),
                    hidden: new FormControl(),
                    position: new FormControl()
                }),
                footer: this._formBuilder.group({
                    background: new FormControl(),
                    customBackgroundColor: new FormControl(),
                    hidden: new FormControl(),
                    position: new FormControl()
                }),
                sidepanel: this._formBuilder.group({
                    hidden: new FormControl(),
                    position: new FormControl()
                })
            })
        });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                // Update the stored config
                this.fuseConfig = config;

                // Set the config form values without emitting an event
                // so that we don't end up with an infinite loop
                this.form.setValue(config, { emitEvent: false });
            });

        // Subscribe to the specific form value changes (layout.style)
        this.form.get('layout.style').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {

                // Reset the form values based on the
                // selected layout style
                this._resetFormValues(value);
            });

        // Subscribe to the form value changes
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                // Update the config
                this._fuseConfigService.config = config;
            });

        // Add customize nav item that opens the bar programmatically
        const customFunctionNavItem = {
            id: 'custom-function',
            title: 'Navigation',
            type: 'group',
            icon: 'settings',
            children: [
                {
                    id: 'customize',
                    //   title   : 'Customize',
                    // type    : 'item',
                    // icon    : 'settings',
                    function: () => {
                        this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                {
                    id: 'salesperson',
                    title: 'Sales Person',
                    type: 'collapsable',
                    icon: 'person_add',
                    // url: '/addSalesPerson',
                    children: [
                        {
                            id: 'newsalesperson',
                            type: 'item',
                            title: 'New Sales Person',
                            url: '/saveSalesPerson',
                            // url: this.router.navigate(['/saveSalesPerson','save']),
                            icon: 'add'
                        },
                        {
                            id: 'searchsalesperson',
                            type: 'item',
                            title: 'Sales Person Search',
                            url: '/searchsalesperson',
                            icon: 'search'
                        },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                {
                    id: 'customer',
                    title: 'Customer',
                    type: 'collapsable',
                    icon: 'face',
                    children: [
                        {
                            id: 'newcustomer',
                            type: 'item',
                            title: 'New Customer',
                            url: '/newcustomer',
                            icon: 'add'
                        },
                        {
                            id: 'searchcustomer',
                            type: 'item',
                            title: 'Customer Search',
                            url: '/searchcustomer',
                            icon: 'search'
                        },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                {
                    id: 'organization',
                    title: 'Organization',
                    type: 'collapsable',
                    icon: 'location_city',
                    children: [
                        {
                            id: 'neworganization',
                            type: 'item',
                            title: 'New Organization',
                            url: '/neworganization',
                            icon: 'add'
                        },
                        {
                            id: 'organizationsearch',
                            type: 'item',
                            title: 'Organization Search',
                            url: '/searchorganization',
                            icon: 'search'
                        },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                {
                    id: 'products',
                    title: 'Products',
                    type: 'collapsable',
                    icon: 'local_mall',
                    children: [
                        {
                            id: 'newproduct',
                            type: 'item',
                            title: 'New Product',
                            url: '/newproduct',
                            icon: 'add'
                        },
                        {
                            id: 'searchpoduct',
                            type: 'item',
                            title: 'Product Search',
                            url: '/searchpoduct',
                            icon: 'search'
                        },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                // {
                //     id: 'LoanTerms',
                //     title: 'Loan Terms',
                //     type: 'item',
                //     // url: '/addSalesPerson',
                //     icon: 'info',

                //     function: () => {
                //         //this.toggleSidebarOpen('themeOptionsPanel');
                //     }
                // },
                {
                    id: 'loan',
                    title: 'Loan',
                    type: 'collapsable',
                    icon: 'attach_money',
                    children: [
                        {
                            id: 'newloan',
                            type: 'item',
                            title: 'New Loan',
                            url: '/newloan',
                            icon: 'add'
                        },
                        {
                            id: 'searchloan',
                            type: 'item',
                            title: 'Loan Search',
                            url: '/searchLoan',
                            icon: 'search'
                        },
                        {
                            id: 'loanterms',
                            type: 'item',
                            title: 'Loan Terms',
                            // url: '/searchloan',
                            icon: 'info',
                            function: () => {
                                this.openDialog();
                            }
                            // function: alert('sadasad') 


                        },
                        // {
                        //     id: 'receivePayments',
                        //     title: 'Receive Payments',
                        //     type: 'item',
                        //     url: '/receivePayments',
                        //     icon: 'person_add',
                        //     function: () => {
                        //         // this.toggleSidebarOpen('themeOptionsPanel');
                        //     }
                        // },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },

                {
                    id: 'AdminManagement',
                    title: 'Admin Management',
                    type: 'collapsable',
                    // url: '/addSalesPerson',
                    icon: 'build',
                    children: [
                        {
                            id: 'newAdmin',
                            type: 'item',
                            title: 'New Admin',
                            url: '/newadmin',
                            icon: 'add'
                        },
                        {
                            id: 'searchAdmin',
                            type: 'item',
                            title: 'Admin Search',
                            url: '/searchadmin',
                            icon: 'search'
                        },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                {
                    id: 'Reports',
                    title: 'Reports',
                    type: 'collapsable',
                    // url: '/addSalesPerson',
                    icon: 'insert_chart',
                    children: [
                        {
                            id: 'collection',
                            type: 'item',
                            title: 'Collections Report',
                            url: '/collectionsReport',
                            icon: 'library_books'
                        },
                        {
                            id: 'endUser',
                            type: 'item',
                            title: 'End User Report',
                            url: '/endUserReport',
                            icon: 'assignment_ind'
                        },
                        {
                            id: 'amountCollected',
                            type: 'item',
                            title: 'Amount Collected Report',
                            url: '/amountCollectedReport',
                            icon: 'account_balance'
                        },
                        {
                            id: 'debtorsReport',
                            type: 'item',
                            title: 'Debtors Report',
                            url: '/debtorsReport',
                            icon: 'receipt'
                        },
                        {
                            id: 'salesReport',
                            type: 'item',
                            title: 'Sales Report',
                            url: '/salesReport',
                            icon: 'receipt'
                        },
                    ],
                    function: () => {
                        // this.toggleSidebarOpen('themeOptionsPanel');
                    }
                },
                {
                    id: 'LogOut',
                    title: 'Log Out',
                    type: 'item',
                    url: '/login',
                    icon: 'power_settings_new',
                    function: () => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        
                        PNotify.success({
                            title: 'Logged out successfully',
                            minHeight: '75px'
                        });
                        this.router.navigate(['login']);
                    }
                },
            ]
        };

        this._fuseNavigationService.addNavigationItem(customFunctionNavItem, 'end');
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Remove the custom function menu
        this._fuseNavigationService.removeNavigationItem('custom-function');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset the form values based on the
     * selected layout style
     *
     * @param value
     * @private
     */
    private _resetFormValues(value): void {
        switch (value) {
            // Vertical Layout #1
            case 'vertical-layout-1':
                {
                    this.form.patchValue({
                        layout: {
                            width: 'fullwidth',
                            navbar: {
                                primaryBackground: 'fuse-navy-700',
                                // secondaryBackground: 'fuse-navy-900',
                                secondaryBackground: 'red',
                                folded: false,
                                hidden: false,
                                position: 'left',
                                variant: 'vertical-style-1'
                            },
                            toolbar: {
                                background: 'fuse-white-500',
                                customBackgroundColor: false,
                                hidden: false,
                                position: 'below-static'
                            },
                            footer: {
                                background: 'fuse-navy-900',
                                customBackgroundColor: true,
                                hidden: false,
                                position: 'below-static'
                            },
                            sidepanel: {
                                hidden: false,
                                position: 'right'
                            }
                        }
                    });

                    break;
                }

            // Vertical Layout #2
            case 'vertical-layout-2':
                {
                    this.form.patchValue({
                        layout: {
                            width: 'fullwidth',
                            navbar: {
                                primaryBackground: 'fuse-navy-700',
                                secondaryBackground: 'fuse-navy-900',
                                folded: false,
                                hidden: false,
                                position: 'left',
                                variant: 'vertical-style-1'
                            },
                            toolbar: {
                                background: 'fuse-white-500',
                                customBackgroundColor: false,
                                hidden: false,
                                position: 'below'
                            },
                            footer: {
                                background: 'fuse-navy-900',
                                customBackgroundColor: true,
                                hidden: false,
                                position: 'below'
                            },
                            sidepanel: {
                                hidden: false,
                                position: 'right'
                            }
                        }
                    });

                    break;
                }

            // Vertical Layout #3
            case 'vertical-layout-3':
                {
                    this.form.patchValue({
                        layout: {
                            width: 'fullwidth',
                            navbar: {
                                primaryBackground: 'fuse-navy-700',
                                secondaryBackground: 'fuse-navy-900',
                                folded: false,
                                hidden: false,
                                position: 'left',
                                layout: 'vertical-style-1'
                            },
                            toolbar: {
                                background: 'fuse-white-500',
                                customBackgroundColor: false,
                                hidden: false,
                                position: 'above-static'
                            },
                            footer: {
                                background: 'fuse-navy-900',
                                customBackgroundColor: true,
                                hidden: false,
                                position: 'above-static'
                            },
                            sidepanel: {
                                hidden: false,
                                position: 'right'
                            }
                        }
                    });

                    break;
                }

            // Horizontal Layout #1
            case 'horizontal-layout-1':
                {
                    this.form.patchValue({
                        layout: {
                            width: 'fullwidth',
                            navbar: {
                                primaryBackground: 'fuse-navy-700',
                                secondaryBackground: 'fuse-navy-900',
                                folded: false,
                                hidden: false,
                                position: 'top',
                                variant: 'vertical-style-1'
                            },
                            toolbar: {
                                background: 'fuse-white-500',
                                customBackgroundColor: false,
                                hidden: false,
                                position: 'above'
                            },
                            footer: {
                                background: 'fuse-navy-900',
                                customBackgroundColor: true,
                                hidden: false,
                                position: 'above-fixed'
                            },
                            sidepanel: {
                                hidden: false,
                                position: 'right'
                            }
                        }
                    });

                    break;
                }
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '250px',
            data: { name: this.name, animal: this.animal }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
    }

}

@Component({
    selector: 'dialog-overview-example-dialog',
    template: `<h1 mat-dialog-title>Loan Terms {{data.name}}</h1>
    <div mat-dialog-content>
      <p>Enter the number of months </p>
      <mat-form-field>
        <input type='number' matInput [(ngModel)]="terms">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data.animal" (click)="submitTerm()" cdkFocusInitial>Submit</button>
    </div>`,
})

// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog {
    terms;
    constructor(
        private loanTermService: LoanTermService,
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    // tslint:disable-next-line:typedef
    submitTerm() {
        // tslint:disable-next-line:prefer-const
        let loanTerm = {
            numberOfMonths: this.terms
        };
        console.log('You are going to add: ', loanTerm, ' term of months');
        this.loanTermService.postLoanTerm(loanTerm).subscribe((response) => {
            console.log('Term added successfully: ', response);
        }, (error) => {
            console.log('An error occured while posting term: ', error);
        });
    }

}
