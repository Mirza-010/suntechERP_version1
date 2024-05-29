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
  selector: 'app-stone-issue-detail',
  templateUrl: './stone-issue-detail.component.html',
  styleUrls: ['./stone-issue-detail.component.scss']
})
export class StoneIssueDetailComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() isViewChangeJob: boolean = true;
  @Input() content!: any;
  columnhead1: any[] = [];
  serialNo: any;
  subJobNo: any;
  tableData: any[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
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
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNumberCodeData: MasterSearchModel = {
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

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "Process_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 41,
    SEARCH_FIELD: 'Stock_Code',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "Stock_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stoneIssueDetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobDes: [''],
    subjobnumber: ['', [Validators.required]],
    subjobDes: [''],
    DESIGN_CODE: [''],
    PART_CODE: [''],
    salesorderno: [0],
    process: ['', [Validators.required]],
    processname: [''],
    worker: ['', [Validators.required]],
    workername: [''],
    stockCode: [''],
    stockCodeDes: [''],
    batchid: [''],
    LOCTYPE_CODE: [''],
    pieces: [],
    shape: [''],
    clarity: [''],
    carat: ['', [Validators.required]],
    size: [],
    SIEVE_SET: [''],
    unitrate: [],
    sieve: [''],
    SIEVE_DESC: [''],
    amount: [],
    color: [''],
    stockbal: [],
    pointerwt: [],
    otheratt: [],
    remarks: [''],
    consignment: [false],
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    KARAT_CODE: [''],
    DIVCODE: [''],
    METAL_STONE: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    FLAG: [null]
  });


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
    // this.srNo= srNo;
    console.log(this.content);
    if (this.content) {
      this.stoneIssueDetailsFrom.controls.FLAG.setValue(this.content.HEADERDETAILS.FLAG)
      if (this.content.HEADERDETAILS.FLAG == 'VIEW') {
        this.viewMode = true;
      }
      this.setFormValues()
    }
  }

  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.stoneIssueDetailsFrom.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }

  onFileChanged(event: any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result;
      };
    }
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.LOCTYPE_CODE.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(e.job_description);
    // this.subJobNo = `${e.job_number}/${this.serialNo}`;
    // this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.subJobNo);
    // this.stoneIssueDetailsFrom.controls.subjobDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
    // this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(e.job_number);
    // this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(e.job_description);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.process.setValue(e.Process_Code);
    this.stoneIssueDetailsFrom.controls.processname.setValue(e.Description);
  }

  workerCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneIssueDetailsFrom.controls.workername.setValue(e.DESCRIPTION);
  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(e.STOCK_CODE);
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(e.STOCK_DESCRIPTION);
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(e.Item);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }

  closed(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
    data.reopen = true;
  }
  onchangeCheckBox(e: any) {
    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }
  removedata() {
    this.tableData.pop();
  }
  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobNumber) == '') {
      this.comService.toastErrorByMsgId('Job number is required')
      return true
    }
    if (this.comService.nullToString(form.worker) == '') {
      this.comService.toastErrorByMsgId('Worker code is required')
      return true
    }
    if (this.comService.nullToString(form.process) == '') {
      this.comService.toastErrorByMsgId('Process code is required')
      return true
    }
    if (this.comService.nullToString(form.stockCode) == '') {
      this.comService.toastErrorByMsgId('Stock code is required')
      return true
    }
    return false
  }
  setPostData() {
    let form: any = this.stoneIssueDetailsFrom.value;
    return {
      "SRNO": this.comService.emptyToZero(this.content?.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.subjobnumber),
      "UNQ_JOB_ID": this.comService.nullToString(form.subjobnumber),
      "JOB_DESCRIPTION": this.comService.nullToString(form.subjobDes),
      "BRANCH_CODE": this.comService.nullToString(this.comService.branchCode),
      "DESIGN_CODE": this.comService.nullToString(form.DESIGN_CODE),
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stock),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDes),
      "SIEVE": this.comService.nullToString(form.sieve),
      "SHAPE": this.comService.nullToString(form.shape),
      "COLOR": this.comService.nullToString(form.color),
      "CLARITY": this.comService.nullToString(form.clarity),
      "SIZE": this.comService.nullToString(form.size),
      "JOB_PCS": 0,
      "PCS": this.comService.emptyToZero(form.pieces),
      "GROSS_WT": 0,
      "CURRENCY_CODE": this.comService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.comService.emptyToZero(form.CURRENCY_RATE),
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": this.comService.emptyToZero(form.unitrate),
      "AMOUNTLC": this.comService.emptyToZero(form.amount),
      "PROCESS_CODE": this.comService.nullToString(form.process),
      "PROCESS_NAME": this.comService.nullToString(form.processname),
      "WORKER_CODE": this.comService.nullToString(form.worker),
      "WORKER_NAME": this.comService.nullToString(form.workername),
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.comService.nullToString(form.LOCTYPE_CODE),
      "PICTURE_NAME": "",
      "PART_CODE": this.comService.nullToString(form.PART_CODE),
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.comService.nullToString(this.comService.branchCode),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.comService.nullToString(this.yearMonth),
      "CONSIGNMENT": this.onchangeCheckBox(form.consignment),
      "SIEVE_SET": 'T' || form.SIEVE_SET,
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": 'T' || this.comService.nullToString(form.remarks),
      "SIEVE_DESC": this.comService.nullToString(form.SIEVE_DESC),
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": "T",
    }
  }
  /**use: to save data to grid*/
  formSubmit(flag: any) {
    if (this.submitValidations(this.stoneIssueDetailsFrom.value)) return;
    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData()
    }
    // this.close(postData);
    this.saveDetail.emit(dataToparent);
    if (flag == 'CONTINUE') {
      this.resetStockDetails()
    }
  }
  changeJobClicked() {
    this.formSubmit('CONTINUE')
    this.stoneIssueDetailsFrom.reset()
  }
  resetStockDetails() {
    this.stoneIssueDetailsFrom.controls.stockCode.setValue('')
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue('')
    // this.stoneIssueDetailsFrom.controls.DIVCODE.setValue('')
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }

  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.branchCode = this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE;
    this.stoneIssueDetailsFrom.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.stoneIssueDetailsFrom.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.stoneIssueDetailsFrom.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.VOCDATE)
    this.stoneIssueDetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.stoneIssueDetailsFrom.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)
    this.stoneIssueDetailsFrom.controls.CURRENCY_CODE.setValue(this.content.CURRENCY_CODE || this.content.HEADERDETAILS.currency)
    this.stoneIssueDetailsFrom.controls.CURRENCY_RATE.setValue(this.content.CURRENCY_RATE || this.content.HEADERDETAILS.currencyrate)

    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.content.JOB_SO_NUMBER)
    this.stoneIssueDetailsFrom.controls.subjobDes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(this.content.DESIGN_CODE)
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(this.content.STOCK_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.stoneIssueDetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stoneIssueDetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stoneIssueDetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stoneIssueDetailsFrom.controls.clarity.setValue(this.content.CLARITY)
    this.stoneIssueDetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stoneIssueDetailsFrom.controls.pieces.setValue(this.content.PCS)
    this.stoneIssueDetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stoneIssueDetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stoneIssueDetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneIssueDetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneIssueDetailsFrom.controls.LOCTYPE_CODE.setValue(this.content.LOCTYPE_CODE)
    this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(this.content.SIEVE_SET)
    this.stoneIssueDetailsFrom.controls.remarks.setValue(this.content.D_REMARKS)
    this.stoneIssueDetailsFrom.controls.amount.setValue(this.content.AMOUNTLC)
    this.stoneIssueDetailsFrom.controls.carat.setValue(this.content.Carat)
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(this.content.DIVCODE)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "071",
      "parameter": {
        'STRJOB_NUMBER': this.comService.nullToString(this.stoneIssueDetailsFrom.value.jobNumber),
        'STRUNQ_JOB_ID': this.comService.nullToString(this.stoneIssueDetailsFrom.value.subjobnumber),
        'STRBRANCH_CODE': this.comService.nullToString(this.comService.branchCode),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(data[0].PART_CODE)

          this.tableData = result.dynamicData[1] || []
          if(this.tableData.length == 0) return;
          this.columnhead1 = Object.keys(this.tableData[0])
          this.stoneIssueDetailsFrom.controls.stockCode.setValue(this.tableData[0].STOCK_CODE)
          this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(this.tableData[0].STOCK_DESCRIPTION)
          this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(this.tableData[0].DESIGN_CODE)
          this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(this.tableData[0].DIVCODE)
          this.stoneIssueDetailsFrom.controls.carat.setValue(this.tableData[0].KARAT)
       
          this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(this.tableData[0].SIEVE_SET)
          this.stoneIssueDetailsFrom.controls.size.setValue(this.tableData[0].SIZE)
          this.stoneIssueDetailsFrom.controls.sieve.setValue(this.tableData[0].SIEVE)
          this.stoneIssueDetailsFrom.controls.SIEVE_DESC.setValue(this.tableData[0].SIEVE_DESC)
          this.stoneIssueDetailsFrom.controls.pieces.setValue(this.tableData[0].PCS)
          this.stoneIssueDetailsFrom.controls.shape.setValue(this.tableData[0].SHAPE)
          this.stoneIssueDetailsFrom.controls.remarks.setValue(this.tableData[0].D_REMARKS)
          // this.stoneIssueDetailsFrom.controls.process.setValue(data[0].PROCESS)
          // this.stoneIssueDetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          // this.stoneIssueDetailsFrom.controls.worker.setValue(data[0].WORKER)
          // this.stoneIssueDetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          this.stoneIssueDetailsFrom.controls.LOCTYPE_CODE.setValue(this.tableData[0].LOCTYPE_CODE)
          // this.stoneIssueDetailsFrom.controls.pieces.setValue(data[0].pieces)
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
        'strBranchCode': this.comService.nullToString(this.comService.branchCode),
        'strJobNumber': this.comService.nullToString(event.target.value),
        'strCurrenctUser': this.comService.nullToString(this.userName)
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            console.log(data, 'pppp')
            this.jobNumberDetailData = data
            this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(data[0].UNQ_JOB_ID)
            this.stoneIssueDetailsFrom.controls.subjobDes.setValue(data[0].JOB_DESCRIPTION)
            this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(data[0].PART_CODE)


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
