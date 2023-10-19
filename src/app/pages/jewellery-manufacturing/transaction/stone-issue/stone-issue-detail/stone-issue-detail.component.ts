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
  selector: 'app-stone-issue-detail',
  templateUrl: './stone-issue-detail.component.html',
  styleUrls: ['./stone-issue-detail.component.scss']
})
export class StoneIssueDetailComponent implements OnInit {

  columnhead1:any[] = ['Div','Stock Code','Shape','Color','Clarity','Size','Sieve Set','Pcs'];

  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];
    user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.stoneissuedetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }




  stoneissuedetailsFrom: FormGroup = this.formBuilder.group({
    jobnumber:[''],
    jobdes:[''],
    subjobnumber:[''],
   designcode:[''],
   partcode:[''],
   salesorderno:[''],
   process:[''],
   processname:[''],
    worker:[''],
    workername:[''],
    stock:[''],
    batchid:[''],
    location:[''],
    pieces:[''],
    shape:[''],
    clarity:[''],
    karat:[''],
    size:[''],
    sieveset:[''],
    unitrate:[''],
    sieve:[''],
    amount:[''],
    color:[''],
    stockbal:[''],
    pointerwt:[''],
    otheratt:[''],
    remarks:[''],
  });


removedata(){
  this.tableData.pop();
}
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.stoneissuedetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": this.stoneissuedetailsFrom.value.jobnumber || "",
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": this.stoneissuedetailsFrom.value.subjobnumber || "",
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.stoneissuedetailsFrom.value.jobdes || "",
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stoneissuedetailsFrom.value.designcode || "",
      "DIVCODE": "",
      "STOCK_CODE": this.stoneissuedetailsFrom.value.stock || "",
      "STOCK_DESCRIPTION": this.stoneissuedetailsFrom.value.stock || "",
      "SIEVE": this.stoneissuedetailsFrom.value.sieve || "",
      "SHAPE":this.stoneissuedetailsFrom.value.shape || "",
      "COLOR":this.stoneissuedetailsFrom.value.color || "",
      "CLARITY": this.stoneissuedetailsFrom.value.clarity || "",
      "SIZE": this.stoneissuedetailsFrom.value.size || "",
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.stoneissuedetailsFrom.value.process || "",
      "PROCESS_NAME": this.stoneissuedetailsFrom.value.processname || "",
      "WORKER_CODE": this.stoneissuedetailsFrom.value.worker || "",
      "WORKER_NAME": this.stoneissuedetailsFrom.value.workername || "",
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.stoneissuedetailsFrom.value.location || "",
      "PICTURE_NAME": "",
      "PART_CODE": this.stoneissuedetailsFrom.value.partcode || "",
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": 0,
      "SIEVE_SET": "",
      "SUB_STOCK_CODE": "",
      "D_REMARKS": "",
      "SIEVE_DESC": "",
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissuedetailsFrom.value.otheratt || "", 
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
                this.stoneissuedetailsFrom.reset()
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

  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.stoneissuedetailsFrom.controls.jobnumber.setValue(this.content.JOB_NUMBER)
    this.stoneissuedetailsFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneissuedetailsFrom.controls.subjobnumber.setValue(this.content.JOB_SO_NUMBER)
    this.stoneissuedetailsFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.stoneissuedetailsFrom.controls.partcode.setValue(this.content.PART_CODE)
    this.stoneissuedetailsFrom.controls.salesorderno.setValue(this.content.WORKER_CODE)
    this.stoneissuedetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stoneissuedetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stoneissuedetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneissuedetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneissuedetailsFrom.controls.stock.setValue(this.content.STOCK_CODE)
    this.stoneissuedetailsFrom.controls.batchid.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.stoneissuedetailsFrom.controls.pieces.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stoneissuedetailsFrom.controls.clarity.setValue(this.content.CLARITY)
    this.stoneissuedetailsFrom.controls.karat.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stoneissuedetailsFrom.controls.sieveset.setValue(this.content.SIEVE_SET)
    this.stoneissuedetailsFrom.controls.unitrate.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stoneissuedetailsFrom.controls.amount.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stoneissuedetailsFrom.controls.stockbal.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.pointerwt.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.otheratt.setValue(this.content.OTHER_ATTR)
    this.stoneissuedetailsFrom.controls.remarks.setValue(this.content.REMARKS)
  }


  update(){
    if (this.stoneissuedetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/'+ this.stoneissuedetailsFrom.value.branchCode + this.stoneissuedetailsFrom.value.yearMonth
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "str",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": this.stoneissuedetailsFrom.value.jobnumber || "",
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": this.stoneissuedetailsFrom.value.subjobnumber || "",
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.stoneissuedetailsFrom.value.jobdes || "",
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stoneissuedetailsFrom.value.designcode || "",
      "DIVCODE": "",
      "STOCK_CODE": this.stoneissuedetailsFrom.value.stock || "",
      "STOCK_DESCRIPTION": this.stoneissuedetailsFrom.value.stock || "",
      "SIEVE": this.stoneissuedetailsFrom.value.sieve || "",
      "SHAPE":this.stoneissuedetailsFrom.value.shape || "",
      "COLOR":this.stoneissuedetailsFrom.value.color || "",
      "CLARITY": this.stoneissuedetailsFrom.value.clarity || "",
      "SIZE": this.stoneissuedetailsFrom.value.size || "",
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.stoneissuedetailsFrom.value.process || "",
      "PROCESS_NAME": this.stoneissuedetailsFrom.value.processname || "",
      "WORKER_CODE": this.stoneissuedetailsFrom.value.worker || "",
      "WORKER_NAME": this.stoneissuedetailsFrom.value.workername || "",
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.stoneissuedetailsFrom.value.location || "",
      "PICTURE_NAME": "",
      "PART_CODE": this.stoneissuedetailsFrom.value.partcode || "",
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": 0,
      "SIEVE_SET": "",
      "SUB_STOCK_CODE": "",
      "D_REMARKS": "",
      "SIEVE_DESC": "",
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissuedetailsFrom.value.otheratt || "",  
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
                this.stoneissuedetailsFrom.reset()
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
    if (!this.content.VOCTYPE) {
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
        let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.stoneissuedetailsFrom.value.branchCode + this.stoneissuedetailsFrom.value.yearMonth
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
                    this.stoneissuedetailsFrom.reset()
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
                    this.stoneissuedetailsFrom.reset()
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
  
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }


}
