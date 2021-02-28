import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../../services/organization/organization.service';
import { CountyService } from '../../../../services/county/county.service';
import { SubCountyService } from '../../../../services/subCounty/sub-county.service';
import { from } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import PNotify from 'pnotify/dist/es/PNotify';
@Component({
  selector: 'app-new-organization',
  templateUrl: './new-organization.component.html',
  styleUrls: ['./new-organization.component.scss']
})
export class NewOrganizationComponent implements OnInit {
  organizadionId;
  dataSending = false;
  organizationToUpdate;
  ready = false;
  dialogView
  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private countyService: CountyService,
    private subCountyService: SubCountyService,
    public dialogRef: MatDialogRef<NewOrganizationComponent>,
    @Inject(MAT_DIALOG_DATA) public display: any

  ) {
    this.dialogView = display.view
    this.route.paramMap.subscribe((params) => {
      this.organizadionId = +params.get('organizationId');
      // console.log('organizationId received to this component is: ', this.organizadionId);
      if (this.organizadionId) {
        this.organizationService.getOrganization(this.organizadionId).subscribe((response) => {
          this.organizationToUpdate = response;
          // console.log('Original organization: ', this.organizationToUpdate);
          this.newOrganizationForm = this._formBuilder.group({
            orginizationName: [this.organizationToUpdate.orginizationName, Validators.required],
            countyId: [this.organizationToUpdate.countyId, Validators.required],
            subCountyId: [this.organizationToUpdate.subCountyId, Validators.required],
            contactPersonUniqueId: [this.organizationToUpdate.contactPersonUniqueId, Validators.required],
            contactPersonName: [this.organizationToUpdate.contactPersonName, Validators.required],
            contactPersonGender: [this.organizationToUpdate.contactPersonGender, Validators.required],
            contactPersonEmail: [this.organizationToUpdate.contactPersonEmail, Validators.required],
            contactPersonPhone: [this.organizationToUpdate.contactPersonPhone, Validators.required],
            input1: [this.organizationToUpdate.input1, Validators.required],
            input2: [this.organizationToUpdate.input2, Validators.required],
          });
          this.ready = true;
        });
      }
      else {
        this.newOrganizationForm = this._formBuilder.group({
          orginizationName: ['', Validators.required],
          countyId: ['', Validators.required],
          subCountyId: ['', Validators.required],
          contactPersonUniqueId: ['', Validators.required],
          contactPersonName: ['', Validators.required],
          contactPersonGender: ['', Validators.required],
          contactPersonEmail: ['', Validators.required],
          contactPersonPhone: ['', Validators.required],
          input1: ['', Validators.required],
          input2: ['', Validators.required],

        });
        this.ready = true;
      }
    });
  }
  newOrganizationForm: FormGroup;
  counties;
  subCounties;

  // tslint:disable-next-line:typedef
  ngOnInit() {

    // Getting the list of counties
    this.countyService.getCounties().subscribe((response) => {
      this.counties = response;
      // console.log('Counties received from server are: ', this.counties);
    });
    // Getting a list of sub-counties
    this.subCountyService.getSubCounties().subscribe((response) => {
      this.subCounties = response;
      // console.log('Sub Counties received from the server are: ', this.subCounties);
    });

  }

  // tslint:disable-next-line:typedef
  addOrganization(organization) {
    // document.getElementById('submitButton').style.display = 'none'
    this.dataSending = true;
    this.organizationService.addOrganization(organization).subscribe((response) => {
      if (this.dialogView) {
        console.log('Organization added successfully');
        PNotify.success({
          title: 'Organization added Successfully',
          minHeight: '75px'
        })
        this.dialogRef.close();
      }
      else {
        console.log('Organization added successfully');
        PNotify.success({
          title: 'Organization added Successfully',
          text: 'Redirecting to list page',
          minHeight: '75px'
        })
        // document.getElementById('submitButton').style.display = 'initial'
        this.dataSending = false;
        this.router.navigate((['searchorganization']))
      }

    }, (error) => {
      console.log('Following error occured while adding organization: ', error)
      PNotify.error({
        title: 'Error while adding Organization',
        text: 'Failed to add new Organization',
        minHeight: '75px'
      })
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
    });
  }

  updateOrganization(organization) {
    // document.getElementById('submitButton').style.display = 'none'
    this.dataSending = true;
    organization.orginizationId = this.organizadionId;
    this.organizationService.updateOrganization(organization, this.organizadionId).subscribe((response) => {
      console.log('Organization Updated: ', response)
      PNotify.success({
        title: 'Organization update Successfully',
        text: 'Redirecting to list page',
        minHeight: '75px'
      })
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
      this.router.navigate((['searchorganization']))
    }, (error) => {
      console.log('An error occured while updating organization: ', error)
      PNotify.error({
        title: 'Error while adding Organization',
        text: 'Failed to add new Organization',
        minHeight: '75px'
      })
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
    })
  }

}
