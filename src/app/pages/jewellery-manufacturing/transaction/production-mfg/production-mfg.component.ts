import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ProductionEntryDetailsComponent } from "./production-entry-details/production-entry-details.component";
import { SavedataModel } from "./savedata-model";

@Component({
  selector: "app-production-mfg",
  templateUrl: "./production-mfg.component.html",
  styleUrls: ["./production-mfg.component.scss"],
})
export class ProductionMfgComponent implements OnInit {
  columnheads: any[] = [
    "JOB_NUMBER", "UNQ_JOB_ID", "DESIGN_CODE",
    "DIVCODE", 'PREFIX', 'STOCK_CODE', 'STOCK_DESCRIPTION', 'SET_REF',
    'KARAT_CODE', 'JOB_PCS', 'GROSS_WT', 'METAL_PCS', 'METAL_WT', 'STONE_PCS',
    'STONE_WT', 'LOSS_WT', 'NET_WT', 'PURITY', 'PURE_WT', 'RATE_TYPE', 'METAL_RATE',
    'CURRENCY_CODE', 'CURRENCY_RATE', 'METAL_GRAM_RATEFC', 'METAL_AMOUNTFC',
    'METAL_AMOUNTLC', 'MAKING_RATEFC', 'MAKING_RATELC', 'MAKING_AMOUNTFC',
    'MAKING_AMOUNTLC', 'STONE_RATEFC', 'STONE_RATELC', 'STONE_AMOUNTFC', 'STONE_AMOUNTLC',
    'LAB_AMOUNTFC', 'LAB_AMOUNTLC', 'RATEFC',
    'RATELC', 'AMOUNTFC', 'AMOUNTLC', 'PROCESS_CODE',
    'PROCESS_NAME', 'WORKER_CODE', 'WORKER_NAME', 'IN_DATE', 'OUT_DATE', 'TIME_TAKEN_HRS', 'COST_CODE',
    'WIP_ACCODE', 'STK_ACCODE', 'SOH_ACCODE', 'PROD_PROC', 'METAL_DIVISION', 'PRICE1PER',
    'PRICE2PER', 'PRICE3PER', 'PRICE4PER', 'PRICE5PER', 'LOCTYPE_CODE', 'WASTAGE_WT', 'WASTAGE_AMTFC',
    'WASTAGE_AMTLC', 'PICTURE_NAME', 'SELLINGRATE', 'LAB_ACCODE', 'CUSTOMER_CODE', 'OUTSIDEJOB',
    'METAL_LABAMTFC', 'METAL_LABAMTLC', 'METAL_LABACCODE', 'SUPPLIER_REF', 'TAGLINES', 'SETTING_CHRG',
    'POLISH_CHRG', 'RHODIUM_CHRG', 'LABOUR_CHRG', 'MISC_CHRG', 'SETTING_ACCODE', 'POLISH_ACCODE',
    'RHODIUM_ACCODE', 'LABOUR_ACCODE', 'MISC_ACCODE', 'WAST_ACCODE', 'REPAIRJOB', 'PRICE1FC',
    'PRICE2FC', 'PRICE3FC', 'PRICE4FC', 'PRICE5FC', 'BASE_CONV_RATE', 'DT_BRANCH_CODE', 'DT_VOCTYPE',
    'DT_VOCNO', 'DT_YEARMONTH', 'YEARMONTH', 'OTH_STONE_WT', 'OTH_STONE_AMT', 'HANDLING_ACCODE',
    'FROM_STOCK_CODE', 'TO_STOCK_CODE', 'JOB_PURITY', 'LOSS_PUREWT', 'PUDIFF', 'STONEDIFF', 'CHARGABLEWT',
    'BARNO', 'LOTNUMBER', 'TICKETNO', 'PROD_PER', 'DESIGN_TYPE', 'D_REMARKS',
    'BARCODEDQTY', 'BARCODEDPCS', 'LASTNO'
  ];
  @Input() content!: any;
  tableData: any[] = [];
  DetailScreenDataToSave: any[] = [];
  STOCK_FORM_DETAILS: any[] = [];
  STOCK_COMPONENT_GRID: any[] = [];
  labourChargeDetailToSave: any[] = [];
  productionMetalRateToSave: any[] = [];
  formDetailCount: number = 0;
  viewMode: boolean = false;
  userName = this.commonService.userName;
  branchCode: string = '';
  yearMonth?: string;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  private subscriptions: Subscription[] = [];
  editMode: boolean = false;
  modalReference!: NgbModalRef;

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'RATE TYPE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  // main form
  productionFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: ["", [Validators.required]],
    VOCDATE: ["", [Validators.required]],
    VOCNO: [1],
    FLAG: [""],
    SRNO: [''],
    SMAN: [""],
    CURRENCY: ["", [Validators.required]],
    CURRENCY_RATE: ["", [Validators.required]],
    BASE_CURRENCY: [""],
    BASE_CURRENCY_RATE: [""],
    baseConvRate: [""],
    TIME: [""],
    METAL_RATE: [""],
    METAL_RATE_TYPE: [""],
    branchto: [""],
    narration: [""],
    STONE_INCLUDE: [false],
    UnfixTransaction: [false],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.setInitialDatas()
    this.setCompanyCurrency()
    this.getRateType()
  }
  setInitialDatas() {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.productionFrom.controls.VOCDATE.setValue(this.commonService.currentDate)
    this.productionFrom.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.productionFrom.controls.TIME.setValue(this.commonService.getTime())
  }
  userDataSelected(value: any) {
    this.productionFrom.controls.SMAN.setValue(value.UsersName);
  }
  branchSelected(e: any) {
    this.productionFrom.controls.branchto.setValue(e.BRANCH_CODE);
  }
  baseCurrencyCodeSelected(e: any) {
    this.productionFrom.controls.BASE_CURRENCY.setValue(e.CURRENCY_CODE);
    this.productionFrom.controls.BASE_CURRENCY_RATE.setValue(e.CONV_RATE);
  }
  /**USE: get rate type on load */
  getRateType() {
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.DIVISION_CODE == 'G' && item.DEFAULT_RTYPE == 1)

    if (data[0].WHOLESALE_RATE) {
      let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
      this.productionFrom.controls.METAL_RATE.setValue(WHOLESALE_RATE)
    }
    this.productionFrom.controls.METAL_RATE_TYPE.setValue(data[0].RATE_TYPE)
  }
  /**USE: Rate type selection */
  rateTypeSelected(event: any) {
    this.productionFrom.controls.METAL_RATE_TYPE.setValue(event.RATE_TYPE)
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.RATE_TYPE == event.RATE_TYPE)

    data.forEach((element: any) => {
      if (element.RATE_TYPE == event.RATE_TYPE) {
        let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
        this.productionFrom.controls.METAL_RATE.setValue(WHOLESALE_RATE)
      }
    });
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    this.productionFrom.controls.CURRENCY.setValue(event.CURRENCY_CODE)
    this.setFormDecimal('CURRENCY_RATE', event.CONV_RATE, 'RATE')
    // this.setCurrencyRate()
  }
  setFormNullToString(formControlName: string, value: any) {
    this.productionFrom.controls[formControlName].setValue(
      this.commonService.nullToString(value)
    )
    // this.FORM_VALIDATER[formControlName] = this.commonService.nullToString(value)
  }
  setFormDecimal(formControlName: string, value: any, Decimal: string) {
    let val = this.commonService.setCommaSerperatedNumber(value, Decimal)
    this.productionFrom.controls[formControlName].setValue(val)
    // this.FORM_VALIDATER[formControlName] = val
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.productionFrom.controls.CURRENCY.setValue(CURRENCY_CODE);
    this.productionFrom.controls.BASE_CURRENCY.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.CURRENCY);
    this.setFormDecimal('BASE_CURRENCY_RATE', CURRENCY_RATE[0].CONV_RATE, 'RATE')
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.CURRENCY);
    if (CURRENCY_RATE.length > 0) {
      this.setFormDecimal('CURRENCY_RATE', CURRENCY_RATE[0].CONV_RATE, 'RATE')
    } else {
      this.productionFrom.controls.CURRENCY.setValue('')
      this.productionFrom.controls.CURRENCY_RATE.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
    this.BaseCurrencyRateVisibility(this.productionFrom.value.CURRENCY, this.productionFrom.value.CURRENCY_RATE)
  }
  BaseCurrencyRateVisibility(txtPCurr: any, txtPCurrRate: any) {
    let ConvRateArr: any = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.CURRENCY && item.CMBRANCH_CODE == this.branchCode)
    let baseConvRate = 1 / ConvRateArr[0].CONV_RATE
    this.productionFrom.controls.baseConvRate.setValue(baseConvRate)
  }
  onRowClickHandler(event: any) {
    // this.selectRowIndex = event.data.SRNO
  }
  onRowDblClickHandler(event: any) {
    let selectedData = event.data
    // let detailRow = this.detailData.filter((item: any) => item.SRNO == selectedData.SRNO)
    // this.openProductionEntryDetails(detailRow)
  }
  //use open modal of detail screen
  dataToDetailScreen: any;
  @ViewChild('productionDetailScreen') public ProductionDetailScreen!: NgbModal;
  openProductionEntryDetails(dataToChild?: any) {
    if (dataToChild) {
      this.productionFrom.controls.FLAG.setValue(this.content.FLAG || 'EDIT')
      this.productionFrom.controls.SRNO.setValue(dataToChild.SRNO)
      dataToChild[0].HEADERDETAILS = this.productionFrom.value;
    } else {
      this.productionFrom.controls.FLAG.setValue('ADD')
      this.productionFrom.controls.SRNO.setValue(0)
      dataToChild = [{ HEADERDETAILS: this.productionFrom.value }]
    }
    console.log(dataToChild, 'data to child');
    this.dataToDetailScreen = dataToChild
    this.modalReference = this.modalService.open(this.ProductionDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }
  detailData: any[] = []
  //use: to set the data from child component to post data
  setValuesToHeaderGrid(DATA: any) {
    let detailDataToParent = DATA.PRODUCTION_FORMDETAILS
    if (detailDataToParent.SRNO != 0) {
      this.DetailScreenDataToSave[detailDataToParent.SRNO - 1] =  DATA.JOB_PROCESS_TRN_DETAIL_DJ
      this.detailData[detailDataToParent.SRNO - 1] = { SRNO: detailDataToParent.SRNO, ...DATA }
    } else {
      // if (this.addItemWithCheck(this.DetailScreenDataToSave, detailDataToParent)) return;
      DATA.PRODUCTION_FORMDETAILS.SRNO = this.DetailScreenDataToSave.length + 1
      DATA.JOB_PROCESS_TRN_DETAIL_DJ.SRNO = this.DetailScreenDataToSave.length + 1
      this.detailData.push({ SRNO: this.DetailScreenDataToSave.length + 1, ...DATA })
      this.DetailScreenDataToSave.push(DATA.JOB_PROCESS_TRN_DETAIL_DJ);
    }
    this.setDetailScreenDataToSave(detailDataToParent)
    // this.editFinalArray(DATA)
    if (detailDataToParent.FLAG == 'SAVE') this.closeDetailScreen();
    if (detailDataToParent.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('Details added grid successfully')
    };
  }
  /*USE: detail screen form data set to save */
  setDetailScreenDataToSave(DETAIL_FORM_DATA: any) {
    console.log(DETAIL_FORM_DATA, 'DETAIL_FORM_DATA');

    this.DetailScreenDataToSave.push({
      "UNIQUEID": 0,
      "SRNO": this.formDetailCount,
      "DT_VOCNO": this.commonService.emptyToZero(this.productionFrom.value.VOCNO),
      "DT_VOCTYPE": this.commonService.nullToString(this.productionFrom.value.VOCTYPE),
      "DT_VOCDATE": this.commonService.formatDateTime(this.productionFrom.value.VOCDATE),
      "DT_BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "DT_NAVSEQNO": "",
      "DT_YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
      "JOB_NUMBER": this.commonService.nullToString(DETAIL_FORM_DATA.jobno),
      "JOB_DATE": this.commonService.formatDateTime(DETAIL_FORM_DATA.JOB_DATE),
      "JOB_SO_NUMBER": this.commonService.emptyToZero(DETAIL_FORM_DATA.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.commonService.nullToString(DETAIL_FORM_DATA.subjobno),
      "JOB_DESCRIPTION": this.commonService.emptyToZero(DETAIL_FORM_DATA.jobnoDesc),
      "UNQ_DESIGN_ID": this.commonService.emptyToZero(DETAIL_FORM_DATA.DESIGN_CODE),
      "DESIGN_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.DESIGN_CODE),
      "PART_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.PART_CODE),
      "DIVCODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.DIVCODE),
      "PREFIX": this.commonService.nullToString(DETAIL_FORM_DATA.PREFIX),
      "STOCK_CODE": this.commonService.nullToString(DETAIL_FORM_DATA.STOCK_CODE),
      "STOCK_DESCRIPTION": this.commonService.nullToString(DETAIL_FORM_DATA.STOCK_DESCRIPTION),
      "SET_REF": this.commonService.nullToString(DETAIL_FORM_DATA.SETREF),
      "KARAT_CODE": this.commonService.nullToString(DETAIL_FORM_DATA.KARAT),
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": this.commonService.emptyToZero(DETAIL_FORM_DATA.JOB_PCS),
      "GROSS_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.GROSS_WT),
      "METAL_PCS": 0,
      "METAL_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.METAL_WT),
      "STONE_PCS": this.commonService.emptyToZero(DETAIL_FORM_DATA.STONE_PCS),
      "STONE_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.STONE_WT),
      "LOSS_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.LOSS_WT),
      "NET_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.GROSS_WT),
      "PURITY": this.commonService.emptyToZero(DETAIL_FORM_DATA.PURITY),
      "PURE_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.PURE_WT),
      "RATE_TYPE": this.commonService.nullToString(this.productionFrom.value.METAL_RATE_TYPE),
      "METAL_RATE": this.commonService.emptyToZero(this.productionFrom.value.METAL_RATE),
      "CURRENCY_CODE": this.commonService.nullToString(this.productionFrom.value.CURRENCY),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.productionFrom.value.CURRENCY_RATE),
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.process),
      "PROCESS_NAME": this.commonService.emptyToZero(DETAIL_FORM_DATA.processname),
      "WORKER_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.worker),
      "WORKER_NAME": this.commonService.emptyToZero(DETAIL_FORM_DATA.workername),
      "IN_DATE": this.commonService.formatDateTime(DETAIL_FORM_DATA.START_DATE),
      "OUT_DATE": this.commonService.formatDateTime(DETAIL_FORM_DATA.END_DATE),
      "TIME_TAKEN_HRS": 0,
      "COST_CODE": "",
      "WIP_ACCODE": "",
      "STK_ACCODE": "",
      "SOH_ACCODE": "",
      "PROD_PROC": "",
      "METAL_DIVISION": DETAIL_FORM_DATA.metalValue,
      "PRICE1PER": DETAIL_FORM_DATA.price1per,
      "PRICE2PER": DETAIL_FORM_DATA.price2per,
      "PRICE3PER": DETAIL_FORM_DATA.price3per,
      "PRICE4PER": DETAIL_FORM_DATA.price4per,
      "PRICE5PER": DETAIL_FORM_DATA.price5per,
      "LOCTYPE_CODE": "",
      "WASTAGE_WT": DETAIL_FORM_DATA.wastage,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "",
      "CUSTOMER_CODE": "",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "",
      "SUPPLIER_REF": DETAIL_FORM_DATA.totalLabour,
      "TAGLINES": "",
      "SETTING_CHRG": DETAIL_FORM_DATA.settingChrg,
      "POLISH_CHRG": DETAIL_FORM_DATA.polishChrg,
      "RHODIUM_CHRG": DETAIL_FORM_DATA.rhodiumChrg,
      "LABOUR_CHRG": DETAIL_FORM_DATA.labourChrg,
      "MISC_CHRG": DETAIL_FORM_DATA.miscChrg,
      "SETTING_ACCODE": DETAIL_FORM_DATA.settingChrgDesc,
      "POLISH_ACCODE": DETAIL_FORM_DATA.polishChrgDesc,
      "RHODIUM_ACCODE": DETAIL_FORM_DATA.rhodiumChrgDesc,
      "LABOUR_ACCODE": DETAIL_FORM_DATA.labourChrgDesc,
      "MISC_ACCODE": DETAIL_FORM_DATA.miscChrgDesc,
      "WAST_ACCODE": DETAIL_FORM_DATA.wastage,
      "REPAIRJOB": 0,
      "PRICE1FC": DETAIL_FORM_DATA.price1fc,
      "PRICE2FC": DETAIL_FORM_DATA.price2fc,
      "PRICE3FC": DETAIL_FORM_DATA.price3fc,
      "PRICE4FC": DETAIL_FORM_DATA.price4fc,
      "PRICE5FC": DETAIL_FORM_DATA.price5fc,
      "BASE_CONV_RATE": 0,
      "FROM_STOCK_CODE": "",
      "TO_STOCK_CODE": "",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "",
      "LOTNUMBER": "",
      "TICKETNO": "",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": "",
      "BASE_CURR_RATE": 0
    })
    console.log(this.DetailScreenDataToSave, '111111111111111111111111111');
  }

  deleteTableData() {

  }

  removedata() {
    this.tableData.pop();
  }

  /**USE: production metal rate data setup */
  productionMetalRate() {
    this.productionMetalRateToSave.push({
      "REFMID": 0,
      "SRNO": 0,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "DIVISION_CODE": "",
      "SYSTEM_DATE": "2023-10-17T12:41:20.127Z",
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "CONV_FACTOR": 0
    })
  }
  /**Labour charge detail data to save */
  setLabourChargeDetailToSave() {
    this.labourChargeDetailToSave.push({
      "REFMID": 0,
      "BRANCH_CODE": "",
      "YEARMONTH": "",
      "VOCTYPE": "",
      "VOCNO": 0,
      "SRNO": 0,
      "JOB_NUMBER": "",
      "STOCK_CODE": "",
      "UNQ_JOB_ID": "",
      "METALSTONE": "",
      "DIVCODE": "",
      "PCS": 0,
      "GROSS_WT": 0,
      "LABOUR_CODE": "",
      "LAB_RATE": 0,
      "LAB_ACCODE": "",
      "LAB_AMTFC": 0,
      "UNITCODE": "",
      "DIVISION": "",
      "WASTAGE_PER": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_AMT": 0,
      "WASTAGE_RATE": 0,
      "KARAT_CODE": ""
    })
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.VOCTYPE) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// VOCTYPE code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.VOCDATE) == '') {
      this.commonService.toastErrorByMsgId('MSG1331')// VOCDATE code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.VOCNO) == '') {
      this.commonService.toastErrorByMsgId('MSG3661')// VOCNO code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.CURRENCY) == '') {
      this.commonService.toastErrorByMsgId('MSG1172')// currency code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.CURRENCY_RATE) == '') {
      this.commonService.toastErrorByMsgId('MSG1178')// CURRENCY_RATE code CANNOT BE EMPTY
      return true
    }
    return false;
  }
  setPostData(){
    let form = this.productionFrom.value
    return {
      "MID": 0,
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "VOCNO": this.commonService.nullToString(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(form.VOCDATE),
      "YEARMONTH": this.commonService.nullToString(this.yearMonth),
      "DOCTIME": this.commonService.formatDateTime(this.currentDate),
      "CURRENCY_CODE": this.commonService.nullToString(form.CURRENCY),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.CURRENCY_RATE),
      "METAL_RATE_TYPE": this.commonService.nullToString(form.METAL_RATE_TYPE),
      "METAL_RATE": this.commonService.emptyToZero(form.METAL_RATE),
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN": this.commonService.nullToString(form.SMAN),
      "REMARKS": this.commonService.nullToString(form.narration),
      "NAVSEQNO": this.commonService.emptyToZero(this.yearMonth),
      "FIX_UNFIX": form.UnfixTransaction,
      "STONE_INCLUDE": form.STONE_INCLUDE,
      "AUTOPOSTING": false,
      "POSTDATE": "",
      "BASE_CURRENCY": this.commonService.nullToString(form.BASE_CURRENCY),
      "BASE_CURR_RATE": this.commonService.emptyToZero(form.BASE_CURRENCY_RATE),
      "BASE_CONV_RATE": this.commonService.emptyToZero(form.baseConvRate),
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "JOB_PRODUCTION_SUB_DJ": this.STOCK_FORM_DETAILS,
      "JOB_PRODUCTION_DETAIL_DJ": this.DetailScreenDataToSave,
      "JOB_PRODUCTION_STNMTL_DJ": this.STOCK_COMPONENT_GRID, //component grid from stockscreen
      "JOB_PRODUCTION_LABCHRG_DJ": this.labourChargeDetailToSave,
      "JOB_PRODUCTION_METALRATE_DJ": this.productionMetalRateToSave
    }
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.submitValidations(this.productionFrom.value)) return;

    let postData = this.setPostData()
    let Sub: Subscription = this.dataService
      .postDynamicAPI("JobProductionMaster/InsertJobProductionMaster", postData)
      .subscribe(
        (result) => {
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || "Success",
              text: "",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            }).then((result: any) => {
              if (result.value) {
                this.productionFrom.reset();
                this.tableData = [];
                this.close("reloadMainGrid");
              }
            });
          } else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }


  update() {
    // if (this.productionFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }

    if (this.submitValidations(this.productionFrom.value)) return;


    let API = "JobProductionMaster/UpdateJobProductionMaster/" + this.productionFrom.value.branchCode + this.productionFrom.value.VOCTYPE + this.productionFrom.value.VOCNO + this.productionFrom.value.vocdate;
    let postData = {}

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || "Success",
              text: "",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            }).then((result: any) => {
              if (result.value) {
                this.productionFrom.reset();
                this.tableData = [];
                this.close("reloadMainGrid");
              }
            });
          } else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
      this.commonService.toastErrorByMsgId('MSG1531')
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteConfirmAPi()
      }
    });
  }
  deleteConfirmAPi() {
    let API = "JobProductionMaster/DeleteJobProductionMaster/" +
      this.productionFrom.value.branchCode + this.productionFrom.value.VOCTYPE +
      this.productionFrom.value.VOCNO + this.productionFrom.value.vocdate;
    let Sub: Subscription = this.dataService
      .deleteDynamicAPI(API)
      .subscribe(
        (result) => {
          if (result) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            } else {
              this.commonService.toastErrorByMsgId('MSG1531')
            }
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.productionFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  setMetalRate() {
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  closeDetailScreen() {
    this.modalReference.close()
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
