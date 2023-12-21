import { Component, Input, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from 'sweetalert2';


@Component({
  selector: "app-scheme-master",
  templateUrl: "./scheme-master.component.html",
  styleUrls: ["./scheme-master.component.scss"],
})
export class SchemeMasterComponent implements OnInit {
  @Input() content!: any;
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];  
  branchCode?: String;
  yearMonth?: String;

  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

 

  schemeMasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    prefix: [""],
    description: [""],
    frequency: [""],
    tenurePeriod: [""],
    installmentAmount: [""],
    bonusInstallment: [""],
    receiptModeone : [""],
    receiptModeTwo: [""],
    cancelCharges: [""],
    receiptModeThree: [""],
    depositIn: [""],
    startDate: [""],
    remarks: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  prefixSelected(e:any){
    console.log(e);
    this.schemeMasterForm.controls.prefix.setValue(e.PREFIX_CODE);
  }

  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.schemeMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'SchemeMaster/InsertSchemeMaster'
    let postData ={
          "MID": 0,
          "BRANCH_CODE": this.branchCode,
          "SCHEME_CODE": this.schemeMasterForm.value.code,
          "SCHEME_NAME": this.schemeMasterForm.value.description,
          "SCHEME_UNIT": 0,
          "SCHEME_BONUS": 0,
          "SCHEME_PERIOD": 0,
          "SCHEME_REMARKS": this.schemeMasterForm.value.remarks,
          "SCHEME_AMOUNT": 0,
          "SCHEME_METALCURRENCY": 0,
          "CANCEL_CHARGE": 0,
          "SCHEME_FREQUENCY": this.schemeMasterForm.value.frequency,
          "STATUS": true,
          "START_DATE": this.schemeMasterForm.value.startDate,
          "SCHEME_CURRENCY_CODE": "",
          "PREFIX_CODE": this.schemeMasterForm.value.prefix,
          "BONUS_RECTYPE": "string",
          "CANCEL_RECTYPE": "string",
          "INST_RECTYPE": "string",
          "SCHEME_FIXEDAMT": true
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
    .subscribe((result) => {
      if (result.response) {
        if (result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.schemeMasterForm.reset()
              this.tableData = []
              this.close()
            }
          });
        }
      } else {
        this.toastr.error('Not saved')
      }
    }, err => alert(err))
  this.subscriptions.push(Sub);
};

setFormValues() {
  if(!this.content) return
  console.log(this.content);
  this.schemeMasterForm.controls.mid.setValue(this.content.MID);
  this.schemeMasterForm.controls.code.setValue(this.content.SCHEME_CODE);
  this.schemeMasterForm.controls.description.setValue(this.content.SCHEME_NAME);
  this.schemeMasterForm.controls.remarks.setValue(this.content.SCHEME_REMARKS);
  this.schemeMasterForm.controls.frequency.setValue(this.content.SCHEME_FREQUENCY);
  this.schemeMasterForm.controls.startDate.setValue(this.content.START_DATE);
  this.schemeMasterForm.controls.prefix.setValue(this.content.PREFIX_CODE);
}

update(){
  if (this.schemeMasterForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'SchemeMaster/UpdateSchemeMaster/' + this.schemeMasterForm.value.branchCode + this.schemeMasterForm.value.code
  let postData = {
    "MID": 0,
    "BRANCH_CODE": this.branchCode,
    "SCHEME_CODE": this.schemeMasterForm.value.code,
    "SCHEME_NAME": this.schemeMasterForm.value.description,
    "SCHEME_UNIT": 0,
    "SCHEME_BONUS": 0,
    "SCHEME_PERIOD": 0,
    "SCHEME_REMARKS": this.schemeMasterForm.value.remarks,
    "SCHEME_AMOUNT": 0,
    "SCHEME_METALCURRENCY": 0,
    "CANCEL_CHARGE": 0,
    "SCHEME_FREQUENCY": this.schemeMasterForm.value.frequency,
    "STATUS": true,
    "START_DATE": this.schemeMasterForm.value.startDate,
    "SCHEME_CURRENCY_CODE": "",
    "PREFIX_CODE": this.schemeMasterForm.value.prefix,
    "BONUS_RECTYPE": "string",
    "CANCEL_RECTYPE": "string",
    "INST_RECTYPE": "string",
    "SCHEME_FIXEDAMT": true
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
              this.schemeMasterForm.reset()
              this.tableData = []
              this.close();
            }
          });
        }
      } else {
        this.toastr.error('Not saved')
      }
    }, err => alert(err))
  this.subscriptions.push(Sub)
}

// SchemeMaster/UpdateSchemeMaster

deleteSchemeMaster() {
  if (!this.content.WORKER_CODE) {
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
      let API = '/SchemeMaster/DeleteSchemeMaster/' + this.schemeMasterForm.value.branchCode + this.schemeMasterForm.value.code;
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
                  this.schemeMasterForm.reset()
                  this.tableData = []
                  this.close();
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
                  this.schemeMasterForm.reset()
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
