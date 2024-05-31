import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stone-return-details',
  templateUrl: './stone-return-details.component.html',
  styleUrls: ['./stone-return-details.component.scss']
})
export class StoneReturnDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  jobDate = new Date();
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
  
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
  subJobNoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stonereturndetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: ['',[Validators.required]],
    jobDesc: ['',[Validators.required]],
    subjobno: [''],
    subjobDesc : [''],
    designcode: [''],
    salesorderno: [''],
    process: ['',[Validators.required]],
    processname: [''],
    worker: ['',[Validators.required]],
    workername: [''],
    stockCode: [''],
    stockCodeDes: [''],
    batchid: [''],
    broken: [''],
    location: [''],
    pieces: [''],
    size: [''],
    sieve: [''],
    carat: [''],
    color: [''],
    clarity: [''],
    unitrate: [''],
    shape: [''],
    sieveset: [''],
    amount: [''],
    pointerwt: [''],
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    SMAN: [''],
    FLAG: [null]
  });
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    if (this.content) {
      this.stonereturndetailsFrom.controls.FLAG.setValue(this.content.HEADERDETAILS.FLAG)
      if (this.content.HEADERDETAILS.FLAG == 'VIEW') {
        this.viewMode = true;
      }
      this.setFormValues()
    }
  }

  setFormValues() {
    console.log(this.content,'formfunction')
    if (!this.content) return
    this.stonereturndetailsFrom.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.stonereturndetailsFrom.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.stonereturndetailsFrom.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.VOCDATE)
    this.stonereturndetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.stonereturndetailsFrom.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)
    this.stonereturndetailsFrom.controls.CURRENCY_CODE.setValue(this.content.CURRENCY_CODE || this.content.HEADERDETAILS.currency)
    this.stonereturndetailsFrom.controls.CURRENCY_RATE.setValue(this.content.CURRENCY_RATE || this.content.HEADERDETAILS.currencyrate)
    this.stonereturndetailsFrom.controls.SMAN.setValue(this.content.SMAN || this.content.HEADERDETAILS.enterdBy)

    this.stonereturndetailsFrom.controls.jobNumber.setValue(this.content[0].JOB_NUMBER)
    this.stonereturndetailsFrom.controls.jobDesc.setValue(this.content[0].JOB_DESCRIPTION)
    this.stonereturndetailsFrom.controls.subjobno.setValue(this.content[0].UNQ_JOB_ID)
    this.stonereturndetailsFrom.controls.subjobDesc.setValue(this.content[0].JOB_DESCRIPTION)
    this.stonereturndetailsFrom.controls.designcode.setValue(this.content[0].DESIGN_CODE)
    this.stonereturndetailsFrom.controls.salesorderno.setValue(this.content[0].PROCESS_NAME)
    this.stonereturndetailsFrom.controls.process.setValue(this.content[0].PROCESS_CODE)
    this.stonereturndetailsFrom.controls.processname.setValue(this.content[0].PROCESS_NAME)
    this.stonereturndetailsFrom.controls.worker.setValue(this.content[0].WORKER_CODE)
    this.stonereturndetailsFrom.controls.workername.setValue(this.content[0].WORKER_NAME)
    this.stonereturndetailsFrom.controls.stock.setValue(this.content[0].STOCK_CODE)
    this.stonereturndetailsFrom.controls.stockdes.setValue(this.content[0].STOCK_DESCRIPTION)
    this.stonereturndetailsFrom.controls.sieveset.setValue(this.content[0].SIEVE_SET)
    this.stonereturndetailsFrom.controls.broken.setValue(this.content.JOB_SO_NUMBER)
    this.stonereturndetailsFrom.controls.pieces.setValue(this.content[0].PCS)
    this.stonereturndetailsFrom.controls.size.setValue(this.content[0].SIZE)
    this.stonereturndetailsFrom.controls.sieve.setValue(this.content[0].SIEVE)
    this.stonereturndetailsFrom.controls.color.setValue(this.content[0].COLOR)
    this.stonereturndetailsFrom.controls.clarity.setValue(this.content[0].CLARITY)
   
  };

  subJobNoCodeSelected(e:any){
    this.stonereturndetailsFrom.controls.subjobno.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.subjobDesc.setValue(e.job_description);
    this.stonereturndetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.jobDesc.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }

  setPostData(form:any){
    return {
      "SRNO": this.content[0]?.SRNO || 0,
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.subjobno),
      "UNQ_JOB_ID": this.comService.nullToString(form.jobNumber),
      "JOB_DESCRIPTION": form.jobDesc,
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DESIGN_CODE": this.comService.nullToString(form.designcode),
      "DIVCODE": "",
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDes),
      "SIEVE": this.comService.nullToString(form.sieve),
      "SHAPE": this.comService.nullToString(form.shape),
      "COLOR": this.comService.nullToString(form.color),
      "CLARITY": this.comService.nullToString(form.clarity),
      "SIZE": this.comService.nullToString(form.size),
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.comService.nullToString(form.process),
      "PROCESS_NAME": this.comService.nullToString(form.processname),
      "WORKER_CODE": this.comService.nullToString(form.worker),
      "WORKER_NAME": this.comService.nullToString(form.workername),
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE":this.comService.nullToString(form.location),
      "STOCK_CODE_BRK": "",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "NAVSEQNO": 0,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "",
      "SMAN": this.comService.nullToString(form.SMAN),
      "REMARKS": "",
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "ISBROCKEN": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.comService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.comService.nullToString(form.YEARMONTH),
      "RET_TO_DESC": "",
      "PICTURE_NAME": "",
      "RET_TO": "",
      "ISMISSING": 0,
      "SIEVE_SET":  form.sieveset || "",
      "SUB_STOCK_CODE": ""
    }
  }
  
  submitValidations(form:any){
    if (this.comService.nullToString(form.jobNumber) == '') {
      this.toastr.error('Job Number code required')
      return true
    }
    if (this.comService.nullToString(form.subjobno) == '') {
      this.toastr.error('Sub Job Number code required')
      return true
    }
    if (this.comService.nullToString(form.process) == '') {
      this.toastr.error('process code required')
      return true
    }
    if (this.comService.nullToString(form.worker) == '') {
      this.toastr.error('worker code required')
      return true
    }
    return false
  }
  formSubmit(flag: any) {
    if (this.submitValidations(this.stonereturndetailsFrom.value)) return;
    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData(this.stonereturndetailsFrom.value)
    }
    // this.close(postData);
    this.saveDetail.emit(dataToparent);
  }
  changeJobClicked() {
    this.formSubmit('CONTINUE')
    this.stonereturndetailsFrom.reset()
  }
  resetStockDetails() {
    this.stonereturndetailsFrom.controls.stockCode.setValue('')
    this.stonereturndetailsFrom.controls.stockCodeDes.setValue('')
    // this.stoneIssueDetailsFrom.controls.DIVCODE.setValue('')
    // this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    // this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    // this.setValueWithDecimal('PURITY', 0, 'PURITY')
    // this.setValueWithDecimal('NET_WT', 0, 'THREE')
    // this.setValueWithDecimal('KARAT', 0, 'THREE')
    // this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

subJobNumberValidate(event?: any) {
  let postData = {
    "SPID": "040",
    "parameter": {
      'strUNQ_JOB_ID': this.stonereturndetailsFrom.value.subjobno,
      'strBranchCode': this.comService.nullToString(this.branchCode),
      'strCurrenctUser': ''
    }
  }

  this.comService.showSnackBarMsg('MSG81447')
  let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result) => {
      console.log(postData, 'uuu')
      this.comService.closeSnackBarMsg()
      if (result.dynamicData && result.dynamicData[0].length > 0) {
        let data = result.dynamicData[0]
        this.stonereturndetailsFrom.controls.process.setValue(data[0].PROCESS)
        this.stonereturndetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
        this.stonereturndetailsFrom.controls.worker.setValue(data[0].WORKER)
        this.stonereturndetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
        this.stonereturndetailsFrom.controls.stock.setValue(data[0].STOCK_CODE)
        this.stonereturndetailsFrom.controls.stockdes.setValue(data[0].STOCK_DESCRIPTION)
        this.stonereturndetailsFrom.controls.designcode.setValue(data[0].DESIGN_CODE)
        this.stonereturndetailsFrom.controls.batchid.setValue(data[0].WORKERDESC)
        this.stonereturndetailsFrom.controls.broken.setValue(data[0].PROCESSDESC)
        this.stonereturndetailsFrom.controls.location.setValue(data[0].LOCTYPE_CODE)
        this.stonereturndetailsFrom.controls.pieces.setValue(data[0].pieces)
        this.stonereturndetailsFrom.controls.size.setValue(data[0].SIZE)
        this.stonereturndetailsFrom.controls.sieve.setValue(data[0].SIEVE)
        this.stonereturndetailsFrom.controls.carat.setValue(data[0].KARAT_CODE)
        this.stonereturndetailsFrom.controls.color.setValue(data[0].COLOR)
        this.stonereturndetailsFrom.controls.unitrate.setValue(data[0].unitrate)
        this.stonereturndetailsFrom.controls.shape.setValue(data[0].SHAPE)
        this.stonereturndetailsFrom.controls.sieveset.setValue(data[0].SIEVE_SET)
        this.stonereturndetailsFrom.controls.amount.setValue(data[0].AMOUNTFC)
        this.stonereturndetailsFrom.controls.pointerwt.setValue(data[0].pointerwt)

      } else {
        this.comService.toastErrorByMsgId('MSG1747')
      }
    }, err => {
      this.comService.closeSnackBarMsg()
      this.comService.toastErrorByMsgId('MSG1531')
    })
  this.subscriptions.push(Sub)
}
jobNumberValidate(event: any) {
  if (event.target.value == '') return
  let postData = {
    "SPID": "028",
    "parameter": {
      'strBranchCode': this.comService.nullToString(this.branchCode),
      'strJobNumber': this.comService.nullToString(event.target.value),
      'strCurrenctUser': this.comService.nullToString(this.comService.userName)
    }
  }

  this.comService.showSnackBarMsg('MSG81447')
  let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result) => {
      this.comService.closeSnackBarMsg()
      if (result.status == "Success" && result.dynamicData[0]) {
        let data = result.dynamicData[0]
        if (data[0] && data[0].UNQ_JOB_ID != '') {
          this.jobNumberDetailData = data
          this.stonereturndetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
          this.stonereturndetailsFrom.controls.subjobDesc.setValue(data[0].JOB_DESCRIPTION)


          this.subJobNumberValidate()
        } else {
          this.comService.toastErrorByMsgId('MSG1531')
          return
        }
      } else {
        this.comService.toastErrorByMsgId('MSG1747')
      }
    }, err => {
      this.comService.closeSnackBarMsg()
      this.comService.toastErrorByMsgId('MSG1531')
    })
  this.subscriptions.push(Sub)
}

}
