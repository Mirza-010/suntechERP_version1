import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stone-pricing-master',
  templateUrl: './stone-pricing-master.component.html',
  styleUrls: ['./stone-pricing-master.component.scss']
})
export class StonePricingMasterComponent implements OnInit {

  @Input() content!: any; 
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sleve_setData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sleve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  shapeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  clarityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Clarity',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizefromData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizetoData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sleveData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 38,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sleve',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  currencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  stonePrizeMasterForm: FormGroup = this.formBuilder.group({
    price_code: ['', [Validators.required]],
    sleve_set: ['', [Validators.required]],
    shape: ['', [Validators.required]],
    sleve_form: ['', [Validators.required]],
    sleve_to: ['', [Validators.required]],
    color: [''],
    clarity: [''],
    size_from: [''],
    size_to: [''],
    currency: [''],
    carat_wt: [''],
    size_from_desc: [''],
    size_to_desc: [''],
    wt_from: [''],
    wt_to: [''],
    issue_rate: [''],
    selling: [''],
    selling_rate: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    console.log(this.content);
    if(this.content){
      this.setFormValues()
    }
  }
  setFormValues() {
    if(!this.content) return
    this.stonePrizeMasterForm.controls.price_code.setValue(this.content.CODE)
    this.stonePrizeMasterForm.controls.sleve_set.setValue(this.content.SIEVE_SET)
    this.stonePrizeMasterForm.controls.shape.setValue(this.content.SHAPE)
    this.stonePrizeMasterForm.controls.sleve_form.setValue(this.content.SIEVE)
    this.stonePrizeMasterForm.controls.sleve_to.setValue(this.content.SIEVE_TO)
    this.stonePrizeMasterForm.controls.color.setValue(this.content.COLOR)
    this.stonePrizeMasterForm.controls.clarity.setValue(this.content.CLARITY)
    this.stonePrizeMasterForm.controls.size_from.setValue(this.content.SIZE_FROM)
    this.stonePrizeMasterForm.controls.size_to.setValue(this.content.SIZE_TO)
    this.stonePrizeMasterForm.controls.currency.setValue(this.content.CURRENCYCODE)
    this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.CARAT_WT)
    this.stonePrizeMasterForm.controls.size_from_desc.setValue(this.content.SIZE_FROM)
    this.stonePrizeMasterForm.controls.size_to_desc.setValue(this.content.SIZE_TO)
    this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.WEIGHT_FROM)
    this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.WEIGHT_TO)
    this.stonePrizeMasterForm.controls.issue_rate.setValue(this.content.ISSUE_RATE)
    this.stonePrizeMasterForm.controls.selling.setValue(this.content.SELLING_PER)
    this.stonePrizeMasterForm.controls.selling_rate.setValue(this.content.SELLING_RATE)
  }
  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.stonePrizeMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'StonePriceMasterDJ/InsertStonePriceMaster'
    let postData = {

      "MID": 0,
      "SRNO": 0,
      "CODE": this.stonePrizeMasterForm.value.price_code || "",
      "DESCRIPTION": "",
      "SHAPE": this.stonePrizeMasterForm.value.shape || "",
      "COLOR": this.stonePrizeMasterForm.value.color || "",
      "CLARITY": this.stonePrizeMasterForm.value.clarity || "",
      "SIZE_FROM": this.stonePrizeMasterForm.value.size_from || "",
      "SIZE_TO": this.stonePrizeMasterForm.value.size_to || "",
      "CURRENCYCODE": this.stonePrizeMasterForm.value.currency || "",
      "ISSUE_RATE":  this.stonePrizeMasterForm.value.issue_rate || 0,
      "SELLING_RATE":  this.stonePrizeMasterForm.value.selling_rate || 0,
      "LAST_ISSUE_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "SELLING_PER":  this.stonePrizeMasterForm.value.selling || 0,
      "CARAT_WT":  this.stonePrizeMasterForm.value.carat_wt || 0,
      "SIEVE": "",
      "SIEVE_SET": this.stonePrizeMasterForm.value.sleve_set || "",
      "WEIGHT_FROM":  this.stonePrizeMasterForm.value.wt_from || 0,
      "WEIGHT_TO":  this.stonePrizeMasterForm.value.wt_to || 0,
      "SIEVE_TO":  this.stonePrizeMasterForm.value.sleve_to || "",
      "SIEVEFROM_DESC": "",
      "SIEVETO_DESC": "",
      "LAST_UPDATE": new Date().toISOString()
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.stonePrizeMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update(){
    console.log( this.stonePrizeMasterForm.value);
    if (this.stonePrizeMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'StonePriceMasterDJ/UpdateStonePriceMaster/'+this.content.MID
    let postData = {
      "MID": this.content.MID,
      "SRNO": 0,
      "CODE": this.stonePrizeMasterForm.value.price_code || "",
      "DESCRIPTION": "",
      "SHAPE": this.stonePrizeMasterForm.value.shape || "",
      "COLOR": this.stonePrizeMasterForm.value.color || "",
      "CLARITY": this.stonePrizeMasterForm.value.clarity || "",
      "SIZE_FROM": this.stonePrizeMasterForm.value.size_from || "",
      "SIZE_TO": this.stonePrizeMasterForm.value.size_to || "",
      "CURRENCYCODE": this.stonePrizeMasterForm.value.currency || "",
      "ISSUE_RATE":  this.stonePrizeMasterForm.value.issue_rate || 0,
      "SELLING_RATE":  this.stonePrizeMasterForm.value.selling_rate || 0,
      "LAST_ISSUE_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "SELLING_PER":  this.stonePrizeMasterForm.value.selling || 0,
      "CARAT_WT":  this.stonePrizeMasterForm.value.carat_wt || 0,
      "SIEVE": "",
      "SIEVE_SET": this.stonePrizeMasterForm.value.sleve_set || "",
      "WEIGHT_FROM":  this.stonePrizeMasterForm.value.wt_from || 0,
      "WEIGHT_TO":  this.stonePrizeMasterForm.value.wt_to || 0,
      "SIEVE_TO":  this.stonePrizeMasterForm.value.sleve_to || "",
      "SIEVEFROM_DESC": "",
      "SIEVETO_DESC": "",
      "LAST_UPDATE": new Date().toISOString()
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.stonePrizeMasterForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  /**USE: delete worker master from row */
  deleteStonepriceMaster() {
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'StonePriceMasterDJ/DeleteStonePriceMaster/' + this.content.MID
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.stonePrizeMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.stonePrizeMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  

  priceCodeSelected(data: any) {
    // console.log(data);
    this.stonePrizeMasterForm.controls.price_code.setValue(data.CODE)
  }

  sleve_setDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.sleve_set.setValue(data.CODE)
  }

  shapeDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.shape.setValue(data.CODE)
  }

  slevefromDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.sleve_form.setValue(data.CODE)
  }
  slevetoDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.sleve_to.setValue(data.CODE)
  }
  colorDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.color.setValue(data.CODE)
  }
  clarityDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.clarity.setValue(data.CODE)
  }
  sizefromDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.size_from.setValue(data.CODE)
  }
  sizetoDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.size_to.setValue(data.CODE)
  }
  currencyDataSelected(data: any) {
    this.stonePrizeMasterForm.controls.currency.setValue(data.CURRENCY_CODE)
  }

}