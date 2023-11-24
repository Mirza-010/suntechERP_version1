import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-division-master',
  templateUrl: './metal-division-master.component.html',
  styleUrls: ['./metal-division-master.component.scss']
})
export class MetalDivisionMasterComponent implements OnInit {

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
 
  ngOnInit(): void {
  }

  metaldivisionForm: FormGroup = this.formBuilder.group({
    costcenter:[''],
    stockcode:[''],
    costcentermaking:['']
  })


  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterSelected(e:any){
    console.log(e);
    this.metaldivisionForm.controls.costcenter.setValue(e.COST_CODE);
  }

  costData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costSelected(e:any){
    console.log(e);
    this.metaldivisionForm.controls.costcentermaking.setValue(e.COST_CODE);
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(e:any){
    console.log(e); 
    this.metaldivisionForm.controls.stockcode.setValue(e.STOCK_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.metaldivisionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DivisionMaster/InsertDivisionMaster'
    let postData = {
      "MID": 0,
      "DIVISION_CODE": "s",
      "DESCRIPTION": "string",
      "DIVISION": "s",
      "REPORT_DEFAULT": "s",
      "ABBREVIATION": "stri",
      "SYSTEM_DATE": "2023-11-24T12:22:11.425Z",
      "COSTCODE_METAL": "string",
      "ISCURRENCY": true,
      "DESCRIPTION_OTHER": "string",
      "COSTCODE_MAKING": "string",
      "METAL_PURITY": 0,
      "DESCRIPTION_CHINESE": "string",
      "DESCRIPTION_TURKISH": "string",
      "AUTOFIXSTOCK": "string"
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
                this.metaldivisionForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
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
    if (this.metaldivisionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = '/DivisionMaster/UpdateDivisionMaster/'+this.content.DIVISION_CODE
    let postData = 
    {
      "MID": 0,
      "DIVISION_CODE": "s",
      "DESCRIPTION": "string",
      "DIVISION": "s",
      "REPORT_DEFAULT": "s",
      "ABBREVIATION": "stri",
      "SYSTEM_DATE": "2023-11-24T12:23:04.648Z",
      "COSTCODE_METAL": "string",
      "ISCURRENCY": true,
      "DESCRIPTION_OTHER": "string",
      "COSTCODE_MAKING": "string",
      "METAL_PURITY": 0,
      "DESCRIPTION_CHINESE": "string",
      "DESCRIPTION_TURKISH": "string",
      "AUTOFIXSTOCK": "string"
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
                this.metaldivisionForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  deleteRecord() {
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
        let API = 'DivisionMaster/DeleteDivisionMaster/' + this.content.DIVISION_CODE
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
                    this.metaldivisionForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
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
                    this.metaldivisionForm.reset()
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
}
