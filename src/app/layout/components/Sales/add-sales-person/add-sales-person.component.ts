import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesPersonService } from '../../../../services/sales person/sales-person.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountyService } from '../../../../services/county/county.service';
import { SubCountyService } from '../../../../services/subCounty/sub-county.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import PNotify from 'pnotify/dist/es/PNotify';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-sales-person',
  templateUrl: './add-sales-person.component.html',
  styleUrls: ['./add-sales-person.component.scss']
})

export class AddSalesPersonComponent implements OnInit {
  dataSending = false;
  updatedSalesPerson;
  salesPersonId;
  updatePerson;
  ready = false;
  dialogView;
  filteredCounties: Observable<string[]>;
  filteredSubCounties: Observable<string[]>;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private salesPersonService: SalesPersonService,
    private countyService: CountyService,
    private subCountyService: SubCountyService,
    public dialogRef: MatDialogRef<AddSalesPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public display: any
  ) {
    this.dialogView = display.view;
    this.route.paramMap.subscribe((params) => {
      this.salesPersonId = params.get('salesPersonId');
      // console.log('ID received to this component: ', this.salesPersonId);
      // console.log(this.salesPersonId);
      if (this.salesPersonId) {
        this.salesPersonService.getSalesPerson(this.salesPersonId).subscribe((response) => {

          this.updatePerson = response;
          // console.log('Person to show in this form person: ', this.updatePerson);
          // this.updatePerson = mockData.filter(person => this.personID == person.ID)[0];
          // console.log('Person to show in this form is: ', this.updatePerson)
          this.addSalesform = this._formBuilder.group({
            nationalId: [this.updatePerson.nationalId, Validators.required],
            name: [this.updatePerson.name, Validators.required],
            gender: [this.updatePerson.gender, Validators.required],
            phone1: [this.updatePerson.phone1, Validators.required],
            email: [this.updatePerson.email, Validators.required],
            team: [this.updatePerson.team, Validators.required],
            county: [this.updatePerson.county, Validators.required],
            teamLeader: [this.updatePerson.teamLeader, Validators.required],
            countyId: [this.updatePerson.countyId, Validators.required],
            subCounty: [this.updatePerson.countyId, Validators.required],
            subCountyId: [this.updatePerson.subCountyId, Validators.required],
            address: [this.updatePerson.address, Validators.required],
            input1: [this.updatePerson.input1],
            input2: [this.updatePerson.input2],
            additionalInfo: [this.updatePerson.additionalInfo],
          })
          this.getCounties();
          this.ready = true;
        });

      }
      else {
        // console.log('In else block')
        this.ready = true;
        this.addSalesform = this._formBuilder.group({
          nationalId: ['', Validators.required],
          name: ['', Validators.required],
          gender: ['', Validators.required],
          phone1: ['', Validators.required],
          email: ['', Validators.required],
          team: ['', Validators.required],
          teamLeader: ['', Validators.required],
          county: ['', Validators.required],
          countyId: ['', Validators.required],
          subCounty: ['', Validators.required],
          subCountyId: ['', Validators.required],
          address: ['', Validators.required],
          input1: [''],
          input2: [''],
          additionalInfo: [''],
        });
        this.getCounties();
        this.ready = true;
      }
    });
  }
  addSalesform: FormGroup;
  counties;
  subCounties;
  ngOnInit() {

    //Getting the list of counties
    // this.countyService.getCounties().subscribe((response) => {
    //   this.counties = response;
    //   // console.log('Counties received from server are: ', this.counties)
    // })
    //Getting a list of sub-counties
    this.subCountyService.getSubCounties().subscribe((response) => {
      this.subCounties = response;
      // console.log('Sub Counties received from the server are: ', this.subCounties)
    })
  }
  private _filter(value) {
    // console.log('value: ', value);
    const filterValue = value.toLowerCase();
    return this.counties.filter(county => county.name.toLowerCase().indexOf(filterValue) === 0);
  }
  displayFn(county?: any): string | undefined {
    return county ? county.name : undefined
  }
  getCounties() {
    // Getting the list of counties
    this.countyService.getCounties().subscribe((response) => {
      this.counties = response;
      this.filteredCounties = this.addSalesform.get('county').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(value => this._filter(value))
      );
    });
  }
  getSubCounties() {
    // Getting the list of Sub Counties
    this.subCountyService.getSubCounties().subscribe((response) => {
      this.counties = response;
      this.filteredSubCounties = this.addSalesform.get('subCounty').valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(value => this._filter(value))
      );
    });
  }
  addSalesPerson(salesPerson) {
    this.addSalesform.patchValue({
      countyId: this.addSalesform.value.county.countyId
    });
    salesPerson.countyId = this.addSalesform.value.county.countyId;
    if (!salesPerson.countyId) {
      PNotify.error({
        title: 'Please selecte a valid county',
        minHeight: '75px'
      });
      return;
    }
    delete salesPerson.county;
    console.log('Value of customer form after setting is: ', salesPerson);
    this.dataSending = true;
    this.salesPersonService.addSalesPerson(salesPerson).subscribe((response) => {
      if (this.dialogView) {
        PNotify.success({
          title: 'Person added Successfully',
          minHeight: '75px'
        });
        this.dialogRef.close();
        this.dataSending = false;
      }
      else {
        PNotify.success({
          title: 'Person added Successfully',
          text: 'Redirecting to list page',
          minHeight: '75px'
        })
        // document.getElementById('submitButton').style.display = 'initial'
        this.dataSending = false;
        this.router.navigate(['searchsalesperson']);
      }

    }, (error) => {
      console.log('Following error occured: ', error);
      PNotify.error({
        title: 'Error occured while adding person',
        text: 'Failed to add new person',
        minHeight: '75px'
      });
      document.getElementById('submitButton').style.display = 'initial';
      this.dataSending = false;
    });
    // PNotify.defauPNotifylts.delay = 1500

    // this.snackBar.openFromComponent(AddSalesPersonComponent, {
    //   duration: 2000,
    // });
  }
  updateSalesPerson(salesPerson) {
    // document.getElementById('submitButton').style.display = 'none'
    this.dataSending = true;
    this.updatedSalesPerson = this._formBuilder.group({
      salesPersonId: [this.salesPersonId],
      nationalId: [salesPerson.nationalId],
      name: [salesPerson.name],
      gender: [salesPerson.gender],
      phone1: [salesPerson.phone1],
      phone2: [salesPerson.phone2],
      email: [salesPerson.email],
      team: [salesPerson.team],
      teamLeader: [salesPerson.teamLeader],
      countyId: [salesPerson.countyId],
      subCountyId: [salesPerson.subCountyId],
      address: [salesPerson.address],
      additionalInfo: [salesPerson.additionalInfo],
      input1: [salesPerson.input1],
      input2: [salesPerson.input2]
    })
    this.updatedSalesPerson.patchValue({
      countyId: salesPerson.county.countyId
    });
    console.log('Update customerForm before sending to service: ', this.updatedSalesPerson.value);
    this.salesPersonService.updateSalesPerson(this.updatedSalesPerson.value, this.salesPersonId).subscribe((response) => {
      // console.log('Person sent to back-end')
      PNotify.success({
        title: 'Person updated Successfully',
        text: 'Redirecting to list page',
        minHeight: '75px'
      });
      this.dataSending = false;
      // document.getElementById('submitButton').style.display = 'initial'
      this.router.navigate(['searchsalesperson']);
    }, (error) => {
      console.log('Error occured: ', error)
      PNotify.error({
        title: 'Error occured while updating person',
        text: 'Failed to update the person',
        minHeight: '75px'
      });
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
    });
  }
}
