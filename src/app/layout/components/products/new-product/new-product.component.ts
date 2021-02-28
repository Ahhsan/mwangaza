import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product/product.service';
import { LoanTermService } from '../../../../services/loanTerms/loan-term.service';
import PNotify from 'pnotify/dist/es/PNotify';
@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})

export class NewProductComponent implements OnInit {
  dataSending = false;
  productId;
  updateProduct;
  updatedProduct;
  loanTerms;
  newProductForm: FormGroup;
  ready = false;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loanTermService: LoanTermService,
    private productService: ProductService) {
    this.route.paramMap.subscribe((params) => {
      this.productId = +params.get('productId');
      // console.log('ID received to this component: ', this.productId);
      // this.productService.getProduct(this.productId).subscribe((response) => {
      //   // console.log('Product to show in this form: ', response);
      // });
      if (this.productId) {
        this.productService.getProduct(this.productId).subscribe((response) => {
          this.updateProduct = response;
          this.newProductForm = this._formBuilder.group({
            name: [this.updateProduct.name, Validators.required],
            recomendedRetailPrice: [this.updateProduct.recomendedRetailPrice, Validators.required],
            loanTermId: [this.updateProduct.loanTermId, Validators.required],
          });
          this.ready = true;
        });
      }
      else {
        this.newProductForm = this._formBuilder.group({
          name: ['', Validators.required],
          recomendedRetailPrice: ['', Validators.required],
          loanTermId: ['', Validators.required],
        });
        this.ready = true;
      }
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.loanTermService.getLoanTerms().subscribe((response) => {
      this.loanTerms = response;
      // console.log('Loanterms received from the server are: ', this.loanTerms);
    }, (error) => console.log('Error while getting loan terms'));
  }

  // tslint:disable-next-line:typedef
  addProduct(product) {
    this.dataSending = true;
    // document.getElementById('submitButton').style.display = 'none'
    this.productService.addProduct(product).subscribe((response) => {
      console.log('Product added succesfully');
      PNotify.success({
        title: 'Product added Successfully',
        text: 'Redirecting to list page',
        minHeight: '75px'
      });
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
      this.router.navigate(['searchpoduct'])
    }, (error) => {
      console.log('Following Error occured while adding product: ', error);
      PNotify.error({
        title: 'Error while adding Product',
        text: 'Failed to add new Product',
        minHeight: '75px'
      });
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
    });
  }

  // tslint:disable-next-line:typedef
  updateExistingProduct(product) {
    this.dataSending = true;
    // document.getElementById('submitButton').style.display = 'none'
    this.updatedProduct = this._formBuilder.group({
      productId: [this.productId],
      name: [product.name],
      loanTermId: [product.loanTermId],
      recomendedRetailPrice: [product.recomendedRetailPrice],
      input1: [product.input1],
      input2: [product.input2]
      // input1: 'input1',
      // input2: 'input2'
    });
    this.productService.updateProduct(this.updatedProduct.value, this.productId).subscribe((response) => {
      console.log('Product sent to server');
      PNotify.success({
        title: 'Product updated Successfully',
        text: 'Redirecting to list page',
        minHeight: '75px'
      });
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
      this.router.navigate(['searchpoduct']);
    }, (error) => {
      console.log('An error occured while updating error: ', error);
      PNotify.error({
        title: 'Error occured while updating Product',
        text: 'Failed to add update Product',
        minHeight: '75px'
      });
      // document.getElementById('submitButton').style.display = 'initial'
      this.dataSending = false;
    });
  }


}
