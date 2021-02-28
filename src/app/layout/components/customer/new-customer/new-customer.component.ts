import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../../services/customer/customer.service';
import { CountyService } from '../../../../services/county/county.service';
import { SubCountyService } from '../../../../services/subCounty/sub-county.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import PNotify from 'pnotify/dist/es/PNotify';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss']
})

export class NewCustomerComponent implements OnInit {
  dataSending = false;
  customerId;
  updatePerson;
  updatedCustomer;
  ready = false;
  dialogView;
  ref: ComponentRef<any>;
  newCustomerForm: FormGroup;
  counties; // list of counties
  subCounties;
  filteredCounties: Observable<string[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private countyService: CountyService,
    private subCountyService: SubCountyService,
    public dialogRef: MatDialogRef<NewCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public display: any
  ) {
    this.dialogView = display.view;
    this.route.paramMap.subscribe((params) => {
      this.customerId = params.get('customerId');
      if (this.customerId) {
        this.customerService.getCustomer(this.customerId).subscribe((response) => {
          this.updatePerson = response;

          this.newCustomerForm = this._formBuilder.group({
            name: [this.updatePerson.name, Validators.required],
            nationalId: [this.updatePerson.nationalId, Validators.required],
            gender: [this.updatePerson.gender, Validators.required],
            phone1: [this.updatePerson.phone1],
            phone2: [this.updatePerson.phone2],
            bishopName: [this.updatePerson.bishopName, Validators.required],
            bishopPhone: [this.updatePerson.bishopPhone, Validators.required],
            countyId: [this.updatePerson.countyId, Validators.required],
            county: [this.updatePerson.county, Validators.required],
            subCountyId: [this.updatePerson.subCountyId, Validators.required],
            address: [this.updatePerson.address, Validators.required],
            additionalInfo: [this.updatePerson.additionalInfo],
            input1: [this.updatePerson.input1],
            input2: [this.updatePerson.input2],
            defaultingRecord: [''],
          });
          // Getting the list of counties
          this.countyService.getCounties().subscribe((response) => {
            this.counties = response;
            this.filteredCounties = this.newCustomerForm.get('county').valueChanges.pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(value => this._filter(value))
            );
          });
          this.ready = true;
        });
      }
      else {

        this.newCustomerForm = this._formBuilder.group({
          nationalId: ['', Validators.required],
          name: ['', Validators.required],
          gender: ['', Validators.required],
          phone1: [''],
          phone2: [''],
          county: [''],
          countyId: ['', Validators.required],
          subCountyId: ['', Validators.required],
          bishopName: ['', Validators.required],
          bishopPhone: ['', Validators.required],
          address: ['', Validators.required],
          additionalInfo: [''],
          input1: [''],
          input2: [''],
          defaultingRecord: [''],
        });
        // Getting the list of counties
        this.countyService.getCounties().subscribe((response) => {
          this.counties = response;
          this.filteredCounties = this.newCustomerForm.get('county').valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(value => this._filter(value))
          );
        });
        this.ready = true;
      }
    });
  }

  // tslint:disable:typedef
  ngOnInit() {

    // Getting a list of sub-counties
    this.subCountyService.getSubCounties().subscribe((response) => {
      this.subCounties = response;
    });
  }
  private _filter(value) {
    // console.log('value: ', value);
    const filterValue = value.toLowerCase();
    return this.counties.filter(county => county.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(county?: any): string | undefined {
    return county ? county.name : undefined
  }
  addCustomer(customer) {
    
    this.newCustomerForm.patchValue({
      countyId: this.newCustomerForm.value.county.countyId
    });
    // this.newCustomerForm.removeControl('county');
    customer.countyId = this.newCustomerForm.value.county.countyId;
    if (!customer.countyId) {
      PNotify.error({
        title: 'Please selecte a valid county',
        minHeight: '75px'
      });
      return;
    }
    delete customer.county;
    console.log('Value of customer form after setting is: ', this.newCustomerForm.value);
    this.dataSending = true;
    this.customerService.addCustomer(customer).subscribe((response) => {
      if (this.dialogView) {
        PNotify.success({
          title: 'Customer added Successfully',
          minHeight: '75px'
        });
        this.dialogRef.close();
      }
      else {
        PNotify.success({
          title: 'Customer added Successfully',
          text: 'Redirecting to list page',
          minHeight: '75px'
        });
        this.dataSending = false;
        document.getElementById('submitButton').style.display = 'initial';
        this.router.navigate(['searchcustomer']);
      }

    }, (error) => {
      console.log('Following error occured: ', error);
      PNotify.error({
        title: 'Error occured while adding customer',
        text: 'Failed to add new customer',
        minHeight: '75px'
      });
      this.dataSending = false;
    });
  }

  updateCustomer(customer) {
    console.log('updates customer: ', customer);
    this.dataSending = true;
    this.updatedCustomer = this._formBuilder.group({
      customerId: [this.customerId],
      nationalId: [customer.nationalId],
      name: [customer.name],
      gender: [customer.gender],
      phone1: [customer.phone1],
      phone2: [customer.phone2],
      countyId: [customer.county.countyId],
      subCountyId: [customer.subCountyId],
      address: [customer.address],
      additionalInfo: [customer.additionalInfo],
      bishopName: [customer.bishopName],
      bishopPhone: [customer.bishopPhone],
      input1: [customer.input1],
      input2: [customer.input2],
    });
    this.updatedCustomer.patchValue({
      countyId: customer.county.countyId
    });
    console.log('Update customerForm before sending to service: ', this.updatedCustomer.value);
    this.customerService.updateCustomer(this.updatedCustomer.value, this.customerId).subscribe((response) => {
      PNotify.success({
        title: 'Customer updated Successfully',
        text: 'Redirecting to list page',
        minHeight: '75px'
      });
      this.dataSending = false;
      this.router.navigate(['searchcustomer']);
    }, (error) => {
      console.log('An error occured while updating customer: ', error);
      PNotify.error({
        title: 'Error occured while updating customer',
        text: 'Failed to update customer',
        minHeight: '75px'
      });
      this.dataSending = false;
    });
  }
}


