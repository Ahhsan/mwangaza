import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NewCustomerComponent } from '../../../../layout/components/customer/new-customer/new-customer.component';
import { NewOrganizationComponent } from '../../../../layout/components/organization/new-organization/new-organization.component';
import { AddSalesPersonComponent } from '../../../../layout/components/Sales/add-sales-person/add-sales-person.component'
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../services/customer/customer.service';
import { SalesPersonService } from 'app/services/sales person/sales-person.service';
import { OrganizationService } from 'app/services/organization/organization.service';
import { ProductService } from '../../../../services/product/product.service';
import { LoanTermService } from '../../../../services/loanTerms/loan-term.service'
import { LoanService } from '../../../../services/loan/loan.service';
import { LoanProductService } from '../../../../services/loanProducts/loan-product.service';
import * as _moment from 'moment';
import { Observable, pipe } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import PNotify from 'pnotify/dist/es/PNotify';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.scss']
})
export class NewLoanComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private customerService: CustomerService,
    private salesPersonService: SalesPersonService,
    private organizationService: OrganizationService,
    private productService: ProductService,
    private loanTermService: LoanTermService,
    private loanService: LoanService,
    private loanProductService: LoanProductService,
    private router: Router,
    public dialog: MatDialog,
    public currencyPipe: CurrencyPipe
  ) { }
  loanDate = _moment().local();
  dataSending = false;
  installmentStartDate;
  newLoanForm: FormGroup;
  loanProductForm: FormGroup;
  customerList;
  salesPersonList;
  organizationList;
  productList;
  loanTermList;
  totalValue = 0;

  date = new Date((new Date().getTime() - 3888000000));
  filteredCustomers: Observable<string[]>;
  filteredSalesPersons: Observable<string[]>;
  filteredOrganizations: Observable<string[]>;
  // filteredProducts: Observable<string[]>;
  filteredProducts: Observable<string[]>[] = []
  // price;
  // quantity;
  // deposit;
  today;
  @Input()
  max: null;
  newRow = { productId: '', price: '', loanTermId: '', quantity: '', deposit: '', total: '' };

  ngOnInit() {
    this.today = _moment().format();
    this.newLoanForm = this._formBuilder.group({
      customerId: ['', Validators.required],
      customer: [''],
      salesPerson: [''],
      organization: [''],
      // product: [''],
      orginizationId: ['', Validators.required],
      salesPersonId: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      notes: ['', Validators.required]
    });
    this.getCustomers();
    this.getSalesPersons();
    this.getOrganizations();
    this.getProducts()
    console.log('After getting customers, salesPerson and organizations')
    this.loanProductForm = this._formBuilder.group({
      products: this._formBuilder.array([
        this.addProductFormGroup()
      ]),
      product: ['oim']
    });
    this.loanProductForm.valueChanges.pipe(debounceTime(20)).subscribe((values) => {

      (this.loanProductForm.get('products') as FormArray).controls.forEach(group => {
        let total = (group.get('quantity').value * group.get('price').value) - group.get('deposit').value;
        group.get('total').setValue(total);
        // group.get('total').setValue(this.currencyPipe.transform(total, 'KES '));
      });

    });

    this.getCustomers();
    this.getSalesPersons();
    this.getOrganizations();
    this.getProducts();
    this.getLoanTerms();
  }
  async getCustomers() {
    this.customerList = await this.customerService.getCustomers().toPromise();
    this.customerList.sort((a, b) => (a.customerId < b.customerId) ? 1 : -1);
    console.log('customerList', this.customerList);

    this.filteredCustomers = this.newLoanForm.get('customer').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.customerFilter(value))
    );
    console.log('filteredCustomers', this.filteredCustomers.subscribe(resp => console.log('filteredCustomers: ', resp)));
  }
  async getSalesPersons() {
    this.salesPersonList = await this.salesPersonService.getSalesPersons().toPromise();
    this.salesPersonList.sort((a, b) => (a.salesPersonId < b.salesPersonId) ? 1 : -1);

    this.filteredSalesPersons = this.newLoanForm.get('salesPerson').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.salesPersonFilter(value))
    );
  }
  async getOrganizations() {
    this.organizationList = await this.organizationService.getOrganizations().toPromise();
    this.organizationList.sort((a, b) => (a.orginizationId < b.orginizationId) ? 1 : -1);

    this.filteredOrganizations = this.newLoanForm.get('organization').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.orginizationName),
      map(value => this.organizationFilter(value))
    );
  }
  getProducts() {
    this.productService.getProducts().subscribe((response) => {
      this.productList = response;
      this.productList.sort((a, b) => (a.productId < b.productId) ? 1 : -1);

      // this.filteredProducts = this.loanProductForm.get('product').valueChanges.pipe(
      //   startWith(''),
      //   map(value => typeof value === 'string' ? value : value.name),
      //   map(value => this.productFilter(value))
      // );
      // console.log('filteredProducts', this.filteredProducts.subscribe(resp => console.log('filteredProducts: ', resp)));
    });

  }
  getLoanTerms() {
    this.loanTermService.getLoanTerms().subscribe((response) => {
      this.loanTermList = response;
    });
  }
  addTableRow() {
    this.newRow = { productId: '', price: '', loanTermId: '', quantity: '', deposit: '', total: '' };
    // this.tableRows.push(this.newRow)
  }
  displayFn(item?: any): string | undefined {
    return item ? item.name : undefined
  }

  organizationdDisplayFn(item?: any): string | undefined {
    console.log('item value in ODfn', item)
    return item ? item.orginizationName : undefined
  }
  private customerFilter(customer) {
    console.log('Customer filter value: ', customer);
    const filterValue = customer.toLowerCase();
    return this.customerList.filter(customer => customer.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private salesPersonFilter(salesPerson) {
    console.log('salesPeron value: ', salesPerson);
    const filterValue = salesPerson.toLowerCase();
    return this.salesPersonList.filter(salesPerson => salesPerson.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private productFilter(product) {
    console.log(product)
    console.log('product filter value: ', product);
    const filterValue = product.toLowerCase();
    return this.productList.filter(product => product.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private organizationFilter(organization) {
    console.log('organizationFilterValue: ', organization);
    const filterValue = organization.toLowerCase();
    return this.organizationList.filter(organization => organization.orginizationName.toLowerCase().indexOf(filterValue) === 0);
  }
  addProductFormGroup(): FormGroup {
    return this._formBuilder.group({
      productId: ['', Validators.required],
      // product: [''],
      price: [0, Validators.required],
      loanTermId: ['', Validators.required],
      quantity: [0, Validators.required],
      deposit: [0, Validators.required],
      total: [0, Validators.required],
    });
  }

  addProductButtonClick(): void {
    
    (<FormArray>this.loanProductForm.get('products')).push(this.addProductFormGroup());
    console.log('Loan Products: ', this.loanProductForm.value);

  }
  

  onPriceChange(e) {
    // Nothing here, just for reference
  }
  onChangedProduct(event, index) {
    console.log('productChangeEvent: ', event)
    const product =
      this.productList.find(product => product.productId === event.value);
    if (product) {
      // console.log('Product is: ', product)
      this.loanProductForm.get(['products', index + '', 'price']).patchValue(product.recomendedRetailPrice);
      const loanTermId = null; // you need to find the loanTermId from loanTermList
      this.loanProductForm.get(['products', index + '', 'loanTermId']).patchValue(product.loanTermId);
    }
  }


  async addNewLoan() {
    console.log('loanProductFormValue: ', this.loanProductForm.value)
    this.newLoanForm.value.invoiceDate = this.loanDate.format();
    let loanProducts = this.loanProductForm.value.products;
    this.newLoanForm.value.loanProducts = loanProducts;

    this.newLoanForm.value.customerId = this.newLoanForm.value.customer.customerId;
    this.newLoanForm.value.salesPersonId = this.newLoanForm.value.salesPerson.salesPersonId;
    this.newLoanForm.value.orginizationId = this.newLoanForm.value.organization.orginizationId;



    console.log('loanForm after setting ids: ', this.newLoanForm.value)
    let loanTerm;
    // document.getElementById('submitButton').style.display = 'none';
    this.dataSending = true;

    // Calculating installment start Date
    if (this.loanDate.date() <= 14) {
      this.installmentStartDate = this.loanDate.add(1, 'M');
      this.installmentStartDate = this.loanDate.date(10);
    }
    else {
      this.installmentStartDate = this.loanDate.add(2, 'M');
      this.installmentStartDate = this.loanDate.date(10);
    }
    // Adding installment start date to each product
    loanProducts.forEach(product => {
      product.installmentStartDate = this.installmentStartDate.format();
    });


    console.log('LoanProducts: ', loanProducts);

    let productsProcessed = 0;
    loanProducts.forEach(async product => {

      await this.loanTermService.getLoanTerm(product.loanTermId).subscribe((response: any) => {
        // console.log('Number of months: ', response.numberOfMonths)
        loanTerm = response.numberOfMonths;
        product.monthlyInstallment = product.total / loanTerm;
      }, error => {
        console.log('Error while retreving loanTermId: ', error);
      });
      productsProcessed++;
      if (productsProcessed === loanProducts.length) {

        // Posting loan after the response of loanTerms Service
        this.loanService.postLoan(this.newLoanForm.value).subscribe((response: any) => {

          console.log('Loan added successfully: ', response);
          PNotify.success({
            title: 'Loan added Successfully',
            text: 'Redirecting to list page',
            minHeight: '75px'
          });
          // document.getElementById('submitButton').style.display = 'initial';
          this.dataSending = false;
          this.router.navigate(['searchLoan']);

        }, (error) => {
          console.log('Error occured while adding loan: ', error);
          PNotify.error({
            title: 'Error occured while adding loan',
            text: 'Failed to add new loan',
            minHeight: '75px'
          });
          // document.getElementById('submitButton').style.display = 'initial';
          this.dataSending = false;
        });
        // Posting of loan ends here
      }
    });




    this.newLoanForm.value.loanProducts = loanProducts;
    console.log('Loan Products: ', this.loanProductForm.value);

  }
  deleteProduct(i) {
    (this.loanProductForm.get('products') as FormArray).removeAt(i);
  }
  // Opening of dialogs
  openCustomerDialog(): void {
    const dialogRef = this.dialog.open(NewCustomerComponent, {
      width: '700px',
      height: '600px',
      data: {
        view: 'dialog'
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      console.log('OpenCustomer Dialog was closed');
      await this.getCustomers().then(() => {
        let customerPreSelectId = this.customerList[0].customerId;
        this.newLoanForm.patchValue({
          customerId: customerPreSelectId
        })
      });
    });

  }

  openOrganizationDialog(): void {
    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '800px',
      height: '600px',
      data: {
        view: 'dialog'
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      console.log('OpenOrganizations was closed');
      await this.getOrganizations().then(() => {
        let organizationPreSelectId = this.organizationList[0].orginizationId;
        this.newLoanForm.patchValue({
          orginizationId: organizationPreSelectId
        });
      });

    });
  }
  openSalesPersonDialog(): void {
    const dialogRef = this.dialog.open(AddSalesPersonComponent, {
      width: '700px',
      height: '600px',
      data: {
        view: 'dialog'
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      console.log('OpenSalesPerson dialog was closed');
      await this.getSalesPersons().then(() => {
        let salesPersonPreSelectId = this.salesPersonList[0].salesPersonId;
        this.newLoanForm.patchValue({
          salesPersonId: salesPersonPreSelectId
        })
      });
    });
  }
}


