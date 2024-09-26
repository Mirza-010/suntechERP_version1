import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-issue-details',
  templateUrl: './metal-issue-details.component.html',
  styleUrls: ['./metal-issue-details.component.scss']
})
export class MetalIssueDetailsComponent implements OnInit {

  @ViewChild('overlayjobNumDes') overlayjobNumDes!: MasterSearchComponent;
  @ViewChild('overlaylocation') overlaylocation!: MasterSearchComponent;
  @ViewChild('overlaystockcode') overlaystockcode!: MasterSearchComponent;
  @ViewChild('overlayworkerCodeDes') overlayworkerCodeDes!: MasterSearchComponent;
  @ViewChild('overlayprocessCode') overlayprocessCode!: MasterSearchComponent;
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() content!: any;
  @Input() isViewChangeJob: boolean = true;
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  columnhead: any[] = ['DIVCODE', 'STOCK_CODE', 'KARAT', 'COLOR', 'Req.Pcs', 'Req.Wt ', 'Issued Pcs', 'Issued Wt', 'Bal.pcs', 'Bal.Wt'];
  vocMaxDate = new Date();
  currentDate = new Date();
  branchCode?: String;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  jobNumberDetailData: any[] = [];
  userName = localStorage.getItem('username');
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  isViewContinue!: boolean;
  viewMode: boolean = false;
  masterMetalChecked: boolean = false;
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
    WHERECONDITION: `JOB_CLOSED_ON is null and  Branch_code = '${this.comService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 253,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strWorker='',@strCurrentUser='${this.comService.userName}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 254,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@strProcess='',@blnActive=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 272,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@DIVISION='G',@JOBNO='',@SUBJOBNO='',@STOCKCODE='',@LOOKUPFLAG='1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  toStockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 272,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@DIVISION='G',@JOBNO='',@SUBJOBNO='',@STOCKCODE='',@LOOKUPFLAG='1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  divCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "division = 'G'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subJobNoCodeData: MasterSearchModel = {

  }

  metalIssueDetailsForm: FormGroup = this.formBuilder.group({
    VOCNO: [''],
    VOCDATE: [''],
    VOCTYPE: [''],
    BRANCH_CODE: [''],
    EXCLUDE_TRANSFER_WT: [false],
    JOB_DATE: [''],
    JOB_SO_NUMBER: [''],
    jobNumber: ['', [Validators.required]],
    jobNumDes: ['', [Validators.required]],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode: ['', [Validators.required]],
    processCodeDesc: ['', [Validators.required]],
    workerCode: ['', [Validators.required]],
    workerCodeDes: ['', [Validators.required]],
    pictureName: [''],
    DESIGN_CODE: [''],
    PART_CODE: [''],
    UNQ_DESIGN_ID: [''],
    uniqueId: [''],
    treeNumber: [''],
    jobPurity: [''],
    stockCode: ['', [Validators.required]],
    stockCodeDes: ['', [Validators.required]],
    pcs: [''],
    PURITY: [''],
    GROSS_WT: [''],
    NET_WT: [''],
    STONE_WT: [''],
    PURE_WT: [''],
    toStockCode: [''],
    toStockCodeDes: [''],
    toDIVCODE: [''],
    Comments: [''],
    location: [''],
    totalAmountFc: [''],
    DIVCODE: [''],
    KARAT_CODE: [''],
    KARAT: [''],
    subStockCode: [''],
    totalAmountLc: [''],
    purityDiff: [''],
    amountFc: [''],
    JOB_PCS: [''],
    amountLc: [''],
    masterMetal: [false],
    FLAG: [null]
  });
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
    private renderer: Renderer2,
    private cdref: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#jobNumbercode')?.focus();
    this.branchCode = this.comService.branchCode;
    if (this.content && this.content.FLAG) {
      this.setInitialValues()
      this.metalIssueDetailsForm.controls.FLAG.setValue(this.content.FLAG)
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.masterMetalChecked = true;
      }
    } else {
      this.setNewFormValue()
    }

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    let branchParam = this.comService.allbranchMaster
    // console.log(branchParam);
    this.metalIssueDetailsForm.controls.location.setValue(branchParam.DMFGMLOC)
    // console.log(this.metalIssueDetailsForm.controls.location.value);
    this.cdref.detectChanges();
  }



  setNewFormValue() {
    if (this.content?.HEADERDETAILS) {
      this.metalIssueDetailsForm.controls.VOCTYPE.setValue(this.content.HEADERDETAILS.VOCTYPE)
      this.metalIssueDetailsForm.controls.VOCNO.setValue(this.content.HEADERDETAILS.VOCNO)
      this.metalIssueDetailsForm.controls.VOCDATE.setValue(this.content.HEADERDETAILS.vocdate)
      this.metalIssueDetailsForm.controls.BRANCH_CODE.setValue(this.content.HEADERDETAILS.BRANCH_CODE)
    }
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
  }
  setInitialValues() {
    if (!this.content) return;


    this.metalIssueDetailsForm.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.metalIssueDetailsForm.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.metalIssueDetailsForm.controls.VOCDATE.setValue(new Date(this.content.VOCDATE) || this.content.HEADERDETAILS.vocdate)
    this.metalIssueDetailsForm.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)

    this.metalIssueDetailsForm.controls.JOB_DATE.setValue(this.content.JOB_DATE)
    this.metalIssueDetailsForm.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.processCode.setValue(this.content.PROCESS_CODE)
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(this.content.PROCESS_NAME)
    this.metalIssueDetailsForm.controls.workerCode.setValue(this.content.WORKER_CODE)
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(this.content.WORKER_NAME)
    this.metalIssueDetailsForm.controls.DIVCODE.setValue(this.content.DIVCODE)
    this.metalIssueDetailsForm.controls.pcs.setValue(this.content.PCS)
    this.metalIssueDetailsForm.controls.subJobNo.setValue(this.content.UNQ_JOB_ID)
    this.metalIssueDetailsForm.controls.JOB_SO_NUMBER.setValue(this.content.JOB_SO_NUMBER)
    this.metalIssueDetailsForm.controls.subJobNoDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(this.content.STOCK_DESCRIPTION)
    this.metalIssueDetailsForm.controls.toStockCode.setValue(this.content.STOCK_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(this.content.STOCK_DESCRIPTION);
    this.metalIssueDetailsForm.controls.toDIVCODE.setValue(this.content.DIVCODE);
    this.metalIssueDetailsForm.controls.KARAT_CODE.setValue(this.content.KARAT_CODE)
    this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(this.content.DESIGN_CODE)
    this.metalIssueDetailsForm.controls.location.setValue(this.content.LOCATION_CODE);
    this.metalIssueDetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(this.content.EXCLUDE_TRANSFER_WT);
    this.metalIssueDetailsForm.controls.JOB_PCS.setValue(this.content.JOB_PCS);
    this.setValueWithDecimal('PURE_WT', this.content.PURE_WT, 'THREE')
    this.setValueWithDecimal('GROSS_WT', this.content.GROSS_WT, 'METAL')
    this.setValueWithDecimal('PURITY', this.content.PURITY, 'PURITY')
    this.setValueWithDecimal('NET_WT', this.content.NET_WT, 'THREE')
    this.setValueWithDecimal('KARAT', this.content.KARAT, 'THREE')
    this.setValueWithDecimal('STONE_WT', this.content.STONE_WT, 'STONE')
    this.setValueWithDecimal('jobPurity', this.content.JOB_PURITY, 'PURITY')
    this.setValueWithDecimal('PURITY', this.content.TO_PURITY, 'PURITY')

    this.tableData = [{
      DIVCODE: this.content.DIVCODE,
      STOCK_CODE: this.content.STOCK_CODE,
      METAL: this.content.GROSS_WT,
      STONE: this.content.STONE_WT,
    }]
  };
  locationCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(e.job_description);
    // this.metalIssueDetailsForm.controls.subJobNo.setValue(e.job_number);
    // this.metalIssueDetailsForm.controls.subJobNoDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  stockCodeSelected(e: any) {
    console.log(e, 'e')
    this.metalIssueDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(e.DESCRIPTION);
    this.metalIssueDetailsForm.controls.DIVCODE.setValue(e.DIVISION);
    // this.metalIssueDetailsForm.controls.pcs.setValue(e.PCS);
    // this.metalIssueDetailsForm.controls.toStockCode.setValue(e.STOCK_CODE);
    // this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(e.DESCRIPTION);
    // this.metalIssueDetailsForm.controls.toDIVCODE.setValue(e.DIVISION_CODE);
    this.stockCodeValidate()
  }

  toStockCodeSelected(e: any) {
    console.log(e, 'e')
    this.metalIssueDetailsForm.controls.toStockCode.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(e.DESCRIPTION);
    this.metalIssueDetailsForm.controls.toDIVCODE.setValue(e.DIVISION_CODE);
  }

  processCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.processCode.setValue(e.PROCESS_CODE);
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(e.DESCRIPTION);
    this.workerCodeData.WHERECONDITION = `@strProcess='${e.PROCESS_CODE}',@blnActive='true'`
  }

  subJobNoCodeSelected(e: any) {
  }

  workerCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(e.DESCRIPTION);
    this.processCodeData.WHERECONDITION = `@strWorker='${e.WORKER_CODE}',@strCurrentUser='${this.comService.userName}'`
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


  onFileChangedimage(event: any) {
    this.imageurl = event.target.files[0]
    console.log(this.imageurl)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result;
      };
    }
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
  changeJobClicked() {
    // this.formSubmit('CONTINUE')
    this.metalIssueDetailsForm.reset()
  }
  resetStockDetails() {
    this.metalIssueDetailsForm.controls.stockCode.setValue('')
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue('')
    this.metalIssueDetailsForm.controls.toStockCode.setValue('')
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue('')
    this.metalIssueDetailsForm.controls.DIVCODE.setValue('')
    this.metalIssueDetailsForm.controls.toDIVCODE.setValue('')
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }

  setPostData() {
    let form = this.metalIssueDetailsForm.value
    // console.log(this.comService.getCurrencyRate(this.comService.compCurrency));    
    let currRate = this.comService.getCurrencyRate(this.comService.compCurrency)

    return {
      "SRNO": this.comService.emptyToZero(this.content.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.nullToString(form.JOB_DATE),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.jobNumber),
      "UNQ_JOB_ID": this.comService.nullToString(form.subJobNo),
      "JOB_DESCRIPTION": this.comService.nullToString(form.jobNumDes),
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DESIGN_CODE": this.comService.nullToString(form.DESIGN_CODE),
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDes),
      "SUB_STOCK_CODE": this.comService.nullToString(form.stockCode),
      "KARAT_CODE": this.comService.nullToString(form.KARAT_CODE),
      "JOB_PCS": this.comService.emptyToZero(form.JOB_PCS),
      "PCS": form.pcs,
      "GROSS_WT": form.GROSS_WT,
      "PURITY": form.PURITY,
      "PURE_WT": this.comService.emptyToZero(form.PURE_WT),
      "RATE_TYPE": '',
      "METAL_RATE": 0,
      "CURRENCY_CODE": this.comService.compCurrency,
      "CURRENCY_RATE": this.comService.emptyToZero(currRate),
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "TOTAL_RATEFC": 0,
      "TOTAL_RATELC": 0,
      "TOTAL_AMOUNTFC": this.comService.emptyToZero(form.totalAmountFc),
      "TOTAL_AMOUNTLC": this.comService.emptyToZero(form.totalAmountLc),
      "PROCESS_CODE": this.comService.nullToString(form.processCode),
      "PROCESS_NAME": this.comService.nullToString(form.processCodeDesc),
      "WORKER_CODE": this.comService.nullToString(form.workerCode),
      "WORKER_NAME": this.comService.nullToString(form.workerCodeDes),
      "UNQ_DESIGN_ID": this.comService.nullToString(form.UNQ_DESIGN_ID),
      "WIP_ACCODE": "",
      "UNIQUEID": this.comService.emptyToZero(form.uniqueId),
      "LOCTYPE_CODE": this.comService.nullToString(form.location),
      "AMOUNTFC": this.comService.emptyToZero(form.amountFc),
      "AMOUNTLC": this.comService.emptyToZero(form.amountLc),
      "PICTURE_NAME": this.comService.nullToString(form.pictureName),
      "PART_CODE": this.comService.nullToString(form.PART_CODE),
      "MASTER_METAL": false || form.masterMetal,
      "STONE_WT": this.comService.emptyToZero(form.STONE_WT),
      "NET_WT": this.comService.emptyToZero(form.NET_WT),
      "DT_BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.comService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.comService.yearSelected,
      "TO_STOCK_CODE": this.comService.nullToString(form.toStockCode),
      "TO_STOCK_DESCRIPTION": this.comService.nullToString(form.toStockCodeDes),
      "PUDIFF": this.comService.emptyToZero(form.purityDiff),
      "JOB_PURITY": this.comService.emptyToZero(form.jobPurity),
      "EXCLUDE_TRANSFER_WT": form.EXCLUDE_TRANSFER_WT,
      "TO_DIVCODE": this.comService.nullToString(form.DIVCODE),
      "TO_PURITY": this.comService.nullToString(form.PURITY)
    }
  }
  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobNumber) == '') {
      this.comService.toastErrorByMsgId('MSG1358')//Job number is required
      return true
    }
    if (this.comService.nullToString(form.workerCode) == '') {
      this.comService.toastErrorByMsgId('MSG1951')//Worker code is required
      return true
    }
    if (this.comService.nullToString(form.processCode) == '') {
      this.comService.toastErrorByMsgId('MSG1680')//Process code is required
      return true
    }
    if (this.comService.nullToString(form.stockCode) == '') {
      this.comService.toastErrorByMsgId('MSG1816')//Stock code is required
      return true
    }
    if (this.comService.emptyToZero(form.GROSS_WT) == 0) {
      this.comService.toastErrorByMsgId('MSG1293')//Gross weight is required
      return true
    }
    return false
  }
  /**use: to save data to grid*/
  formSubmit(flag: any) {
    if (this.submitValidations(this.metalIssueDetailsForm.value)) return;
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
  masterMetalChange(event: any) {
    console.log(event);
    console.log(event.target.checked);
    this.masterMetalChecked = event.target.checked

  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.metalIssueDetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  stoneValidate() {
    if (this.calculateNetWt()) {
      this.setValueWithDecimal('GROSS_WT', this.tableData[0].METAL, 'METAL')
      this.setValueWithDecimal('STONE_WT', this.tableData[0].STONE, 'STONE')
    }
  }
  grossValidate() {
    if (this.calculateNetWt()) {
      this.setValueWithDecimal('GROSS_WT', this.tableData[0].METAL, 'METAL')
      this.setValueWithDecimal('STONE_WT', this.tableData[0].STONE, 'STONE')
    }
  }


  /**use: for stone wt and gross wt calculation */
  private calculateNetWt(): boolean {
    let form = this.metalIssueDetailsForm.value
    let GROSS_WT = this.comService.emptyToZero(form.GROSS_WT)
    let STONE_WT = this.comService.emptyToZero(form.STONE_WT)
    let PURITY = this.comService.emptyToZero(form.PURITY);
    if (STONE_WT > GROSS_WT) {
      this.comService.toastErrorByMsgId('MSG1840')//	Stone weight cannot be greater than gross weight
      return true
    }
    // this.setValueWithDecimal('NET_WT', GROSS_WT - STONE_WT, 'THREE')

    let NET_WT = GROSS_WT - STONE_WT;
    this.setValueWithDecimal('NET_WT', NET_WT, 'THREE');

    // Calculate PURE_WT as NET_WT * PURITY
    let PURE_WT = NET_WT * PURITY;
    this.setValueWithDecimal('PURE_WT', PURE_WT, 'THREE');
    return false;
  }
  setStockCodeWhereCondition() {
    let form = this.metalIssueDetailsForm.value;
    this.stockCodeData.WHERECONDITION = `@DIVISION='${this.comService.nullToString(form.DIVCODE)}',`
    this.stockCodeData.WHERECONDITION += `@JOBNO='${this.comService.nullToString(form.jobNumber)}',`
    this.stockCodeData.WHERECONDITION += `@SUBJOBNO='${this.comService.nullToString(form.subJobNo)}',`
    this.stockCodeData.WHERECONDITION += `@STOCKCODE='${this.comService.nullToString(form.stockCode)}',@LOOKUPFLAG='1'`
  }
  //TODO 2 subjob method
  jobNumberValidate(event: any) {
    this.showOverleyPanel(event, 'jobNumber')
    if (event.target.value == '' || this.viewMode) return
    let postData = {
      "SPID": "064",
      "parameter": {
        'BRANCHCODE': this.comService.nullToString(this.branchCode),
        'JOBNO': this.comService.nullToString(event.target.value),
        'STRSHOWPROCESS': 'Y'
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            this.jobNumberDetailData = data
            this.metalIssueDetailsForm.controls.subJobNo.setValue(data[0].UNQ_JOB_ID)
            this.metalIssueDetailsForm.controls.jobNumDes.setValue(data[0].JOB_DESCRIPTION)
            this.metalIssueDetailsForm.controls.subJobNoDes.setValue(data[0].SUB_JOB_DESCRIPTION)
            this.metalIssueDetailsForm.controls.DIVCODE.setValue("G");
            this.metalIssueDetailsForm.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.metalIssueDetailsForm.controls.PART_CODE.setValue(data[0].PART_CODE)
            this.metalIssueDetailsForm.controls.KARAT_CODE.setValue(data[0].KARAT_CODE)
            this.setValueWithDecimal('jobPurity', data[0].JOB_PURITY, 'PURITY')
            this.subJobNumberValidate()
            this.setStockCodeWhereCondition()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.metalIssueDetailsForm.controls.jobNumber.setValue('')
            this.showOverleyPanel(event, 'jobNumber')
            return
          }
        } else {
          this.metalIssueDetailsForm.controls.jobNumber.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        }
        this.overlayjobNumDes.closeOverlayPanel()
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.metalIssueDetailsForm.value.subJobNo,
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': '',
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.metalIssueDetailsForm.controls.subJobNoDes.setValue(data[0].DESCRIPTION)
          this.metalIssueDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          this.metalIssueDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          this.processCodeData.WHERECONDITION = `@strWorker='${data[0].WORKER}',@strCurrentUser='${this.comService.userName}'`
          this.workerCodeData.WHERECONDITION = `@strProcess='${data[0].PROCESS}',@blnActive=1`
          this.metalIssueDetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.metalIssueDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.metalIssueDetailsForm.controls.stockCodeDes.setValue(data[0].STOCK_DESCRIPTION)
          // this.metalIssueDetailsForm.controls.toStockCode.setValue(data[0].STOCK_CODE);
          // this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(data[0].STOCK_DESCRIPTION);
          // this.metalIssueDetailsForm.controls.toDIVCODE.setValue(data[0].DIVCODE);
          // this.metalIssueDetailsForm.controls.masterMetal.setValue(false);
          this.comService.formControlSetReadOnly('toDIVCODE', true)
          this.comService.formControlSetReadOnly('toStockCode', true)
          this.comService.formControlSetReadOnly('toStockCodeDes', true)
          this.metalIssueDetailsForm.controls.workerCodeDes.setValue(data[0].WORKERDESC)
          this.metalIssueDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)

          // this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
          // this.metalIssueDetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          // this.metalIssueDetailsForm.controls.JOB_PCS.setValue(data[0].PCS1)
          // this.metalIssueDetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)

          // this.metalIssueDetailsForm.controls.pcs.setValue(data[0].PCS)
          // this.setValueWithDecimal('PURE_WT', data[0].PURE_WT.toFixed(3), 'THREE')
          // this.setValueWithDecimal('GROSS_WT', data[0].METAL, 'METAL')
          // this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
          // this.setValueWithDecimal('KARAT', data[0].KARAT, 'THREE')
          // this.setValueWithDecimal('STONE_WT', data[0].STONE, 'STONE')
          // this.setValueWithDecimal('NET_WT', data[0].METAL - data[0].STONE, 'THREE')
          // let purityFlag = this.comService.getCompanyParamValue('ALLOWPURITYCHANGEINMETALISSUE')
          // if (!purityFlag && data[0].PURITY != '') {
          //   this.stockCodeData.WHERECONDITION = this.stockCodeData.WHERECONDITION + `AND PURITY='${data[0].PURITY}'`
          // }
          this.FillMtlRequiredDetail()
          // this.setStockCodeCondition()
          // this.meltingIssuedetailsFrom.controls.MetalWeightFrom.setValue(
          //   this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))
          // // this.stockCodeScrapValidate()
          this.metalIssueDetailsForm.controls.location.setValue(
            this.comService.allbranchMaster.DMFGMLOC
          )
          // this.meltingIssuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
        }
        // else {
        //   this.metalIssueDetailsForm.controls.subJobNo.setValue('')
        //   this.comService.toastErrorByMsgId('MSG1747')
        // }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  WorkerCodeValidate(event?: any) {
    if (event.target.value == '' || this.viewMode == true) return;
    this.showOverleyPanel(event, 'workerCodeDes')
    let form = this.metalIssueDetailsForm.value;
    let postData = {
      "SPID": "103",
      "parameter": {
        strBranch_Code: this.comService.nullToString(form.BRANCH_CODE),
        strJob_Number: '',
        strUnq_Job_Id: '',
        strMetalStone: '',
        strProcess_Code: this.comService.nullToString(form.PROCESS_CODE),
        strWorker_Code: this.comService.nullToString(form.WORKER_CODE),
        strStock_Code: '',
        strUserName: '',
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {

        } else {
          this.overlayworkerCodeDes.showOverlayPanel(event)
          this.metalIssueDetailsForm.controls.workerCodeDes.setValue('')
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1747')
      })
    this.subscriptions.push(Sub)
  }
  stockCodeValidate(event?: any) {
    if (this.viewMode) return;
    if (event.target.value == ''){
      this.showOverleyPanel(event, 'stockCode');
      return
    };

    let postData = {
      "SPID": "133",
      "parameter": {
        DIVISION: this.comService.nullToString(this.metalIssueDetailsForm.value.DIVCODE),
        JOBNO: this.comService.nullToString(this.metalIssueDetailsForm.value.jobNumber),
        SUBJOBNO: this.comService.nullToString(this.metalIssueDetailsForm.value.subJobNo),
        STOCKCODE: this.comService.nullToString(event.target.value),
        LOOKUPFLAG: '0',
      }
    };

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        if (result.status === "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0];
          if (data) {
            // Handle the valid stock case
            let stockData = data[0]; 
            let purity = stockData.PURITY || 0;
            let division = stockData.DIVISION || 0;
            let pcs = stockData.BALANCE_PCS || 0;
            let description = stockData.DESCRIPTION || 0;
            let stoneWeight = stockData.STONE_WT || 0;
            // Set the purity value in the form
            this.metalIssueDetailsForm.controls.PURITY.setValue(purity);
            this.metalIssueDetailsForm.controls.pcs.setValue(pcs);
            this.metalIssueDetailsForm.controls.stockCodeDes.setValue(description);
            this.metalIssueDetailsForm.controls.STONE_WT.setValue(stoneWeight);
          } 
        } else {
          this.comService.toastErrorByMsgId('MSG1747');
          this.metalIssueDetailsForm.controls.stockCode.setValue('');
        }
      }, err => {
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531');
        this.metalIssueDetailsForm.controls.stockCode.setValue('');
        this.showOverleyPanel(event, 'stockCode');
      });

    this.subscriptions.push(Sub);
  }

  FillMtlRequiredDetail() {
    let postData = {
      "SPID": "056",
      "parameter": {
        'strjob_Number': this.metalIssueDetailsForm.value.jobNumber,
        'strUnq_Job_Id': this.metalIssueDetailsForm.value.subJobNo,
        'strBranch_Code': this.comService.nullToString(this.branchCode),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          this.tableData = result.dynamicData[0]
          console.log(this.tableData);
          // console.log(Object.keys(this.tableData[0]));

          // this.columnhead = Object.keys(this.tableData[0])
        }
      }
      )
    this.subscriptions.push(Sub)
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.metalIssueDetailsForm.value[formControlName] != '') return;

    switch (formControlName) {
      case 'jobNumber':
        this.overlayjobNumDes.showOverlayPanel(event);
        break;
      case 'location':
        this.overlaylocation.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlaystockcode.showOverlayPanel(event);
        break;
      case 'workerCodeDes':
        this.overlayworkerCodeDes.showOverlayPanel(event);
        break;
      case 'processCode':
        this.overlayprocessCode.showOverlayPanel(event);
        break;
      default:
        // Handle default case if necessary
        break;
    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;

    if (event.target.value == '' || this.viewMode) return;

    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    };

    this.comService.showSnackBarMsg('MSG81447');

    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0]);
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531');
          this.metalIssueDetailsForm.controls[FORMNAME].setValue('');
          LOOKUPDATA.SEARCH_VALUE = '';
          // Conditionally call showOverleyPanel based on FORMNAME
          if (FORMNAME === 'location' || FORMNAME === 'processCode') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return;
        }
      }, err => {
        console.log(err);

        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      });

    this.subscriptions.push(Sub);
  }
  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;
    if (event.target.value == '' || this.viewMode == true) return;

    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "ORDER_TYPE": LOOKUPDATA.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    };

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        let data = result.dynamicData[0];
        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let searchResult = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE);
            if (searchResult && searchResult.length == 0) {
              this.metalIssueDetailsForm.controls[FORMNAME].setValue('');
              LOOKUPDATA.SEARCH_VALUE = '';
              this.openOverlayPanelFormWise(event, FORMNAME)
              return;
            }
            let result = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE)
            if (result) this.setDescriptions(result, FORMNAME)
          }
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      });
    this.subscriptions.push(Sub);
  }
  setDescriptions(result: any, FORMNAME: string) {
    switch (FORMNAME) {
      case 'processCode':
        this.metalIssueDetailsForm.controls.processCodeDesc.setValue(result[0].DESCRIPTION)
        break;
      case 'workerCode':
        this.metalIssueDetailsForm.controls.workerCodeDes.setValue(result[0].DESCRIPTION)
        break;
      default:
    }
  }
  openOverlayPanelFormWise(event: any, FORMNAME: string) {
    switch (FORMNAME) {
      case 'processCode':
        this.showOverleyPanel(event, 'processCode');
        break;
      default:
    }
  }

}






