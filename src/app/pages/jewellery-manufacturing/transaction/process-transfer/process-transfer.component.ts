import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProcessTransferDetailsComponent } from './process-transfer-details/process-transfer-details.component';

@Component({
  selector: 'app-process-transfer',
  templateUrl: './process-transfer.component.html',
  styleUrls: ['./process-transfer.component.scss']
})
export class ProcessTransferComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];
  detailData: any[] = [];
  userName = this.commonService.userName;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  branchCode?: String;
  yearMonth?: String;
  tableRowCount: number = 0;
  PTFDetailsToSave: any[] = [];
  detailScreenDataToSave: any[] = [];
  labourChargeDetailsToSave: any[] = [];

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
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
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
  /**Procces */
  processTransferFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocdate: ['', [Validators.required]],
    vocno: [''],
    salesman: [''],
    SalesmanName: [''],
    currency: [''],
    currencyrate: [''],
    Narration: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {

  }


  ngOnInit(): void {
    this.setCompanyCurrency()
    this.setInitialValues() //load all initial values
  }

  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.processTransferFrom.controls.vocdate.setValue(this.commonService.currentDate)
    this.processTransferFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.processTransferFrom.controls.vocdate.setValue(new Date(date))
    }
  }
  openProcessTransferDetails(data?: any) {
    if (data) {
      data[0].HEADERDETAILS = this.processTransferFrom.value;
    } else {
      data = [{ HEADERDETAILS: this.processTransferFrom.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(ProcessTransferDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;
    modalRef.result.then((result) => {
      if (result) {
        this.setValuesToHeaderGrid(result) //USE: set Values To Detail table

        this.setDataFromDetailScreen()
        this.setHeaderGridDetails()
        // this.setLabourChargeDetails()
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
  }
  /**USE: on clicking row Opens new detail adding screen */
  onRowClickHandler(event: any) {
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
    let allDataSelected = [detailRow[0].DATA]
    this.openProcessTransferDetails(allDataSelected)
  }

  setValuesToHeaderGrid(detailDataToParent: any) {
    let PROCESS_FORMDETAILS = detailDataToParent.PROCESS_FORMDETAILS
    if (PROCESS_FORMDETAILS.SRNO) {
      console.log('fired');
      this.swapObjects(this.tableData, [PROCESS_FORMDETAILS], (PROCESS_FORMDETAILS.SRNO - 1))
    } else {
      this.tableRowCount += 1
      PROCESS_FORMDETAILS.SRNO = this.tableRowCount
    }

    this.tableData.push(PROCESS_FORMDETAILS)

    if (detailDataToParent) {
      this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
    }
  }
  /*USE: Function to swap object in array1 with object from array2 at the specified index */
  swapObjects(array1: any, array2: any, index: number) {
    // Check if the index is valid
    if (index >= 0 && index < array1.length) {
      array1[index] = array2[0];
    } else {
      console.error('Invalid index');
    }
  }
  salesmanSelected(event: any) {
    this.processTransferFrom.controls.salesman.setValue(event.SALESPERSON_CODE)
    this.processTransferFrom.controls.SalesmanName.setValue(event.DESCRIPTION)
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.processTransferFrom.controls.currency.setValue((event.target.value).toUpperCase())
    } else {
      this.processTransferFrom.controls.currency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.processTransferFrom.controls.currency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.processTransferFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.processTransferFrom.controls.currencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.processTransferFrom.controls.currency.setValue('')
      this.processTransferFrom.controls.currencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  deleteTableData() {

  }


  removedata() {
    this.tableData.pop();
  }

  setLabourChargeDetails() {
    let detailScreenData = this.detailData[0].DATA
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS

    this.labourChargeDetailsToSave.push(
      {
        "REFMID": 0,
        "BRANCH_CODE": this.commonService.branchCode,
        "YEARMONTH": this.commonService.yearSelected,
        "VOCTYPE": this.processTransferFrom.value.voctype,
        "VOCNO": 0,
        "SRNO": 0,
        "JOB_NUMBER": this.commonService.nullToString(detailScreenData.jobno),
        "STOCK_CODE": this.commonService.nullToString(detailScreenData.stockCode),
        "UNQ_JOB_ID": this.commonService.nullToString(detailScreenData.subjobno),
        "METALSTONE": "",
        "DIVCODE": "",
        "PCS": 0,
        "GROSS_WT": 0,
        "LABOUR_CODE": "",
        "LAB_RATE": 0,
        "LAB_ACCODE": "",
        "LAB_AMTFC": 0,
        "UNITCODE": ""
      }
    )
  }
  /**USE: set details from detail screen */
  setDataFromDetailScreen() {
    let detailScreenData = this.detailData[0].DATA
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS
    
    this.detailScreenDataToSave.push({
      "VOCNO": 0,
      "VOCTYPE": this.processTransferFrom.value.voctype,
      "VOCDATE": this.commonService.formatMMDDYY(this.processTransferFrom.value.vocdate),
      "JOB_NUMBER": this.commonService.nullToString(detailScreenData.jobno),
      "JOB_SO_NUMBER": this.commonService.emptyToZero(detailScreenData.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.commonService.nullToString(detailScreenData.subjobno),
      "JOB_DESCRIPTION": this.commonService.nullToString(detailScreenData.DESCRIPTION),
      "BRANCH_CODE": this.commonService.branchCode,
      "DESIGN_CODE": this.commonService.nullToString(detailScreenData.DESIGN_CODE),
      "METALSTONE": "",
      "DIVCODE": "",
      "STOCK_CODE":  this.commonService.nullToString(detailScreenData.stockCode),
      "STOCK_DESCRIPTION": "",
      "COLOR": "",
      "CLARITY": "",
      "SHAPE": "",
      "SIZE": "",
      "PCS": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "NET_WT": 0,
      "RATE": 0,
      "AMOUNT": 0,
      "PROCESS_CODE":  this.commonService.nullToString(detailScreenData.processTo),
      "WORKER_CODE": this.commonService.nullToString(detailScreenData.workerTo),
      "UNQ_DESIGN_ID": this.commonService.nullToString(detailScreenData.subjobno),
      "REFMID": 0,
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "CURRENCY_CODE": this.commonService.nullToString(this.processTransferFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.processTransferFrom.value.currencyrate),
      "YEARMONTH": this.commonService.yearSelected,
      "LOSS_QTY": this.commonService.emptyToZero(detailScreenData.stdLoss),
      "LABOUR_CODE": "",
      "LAB_RATE": 0,
      "LAB_AMT": 0,
      "BRKSTN_STOCK_CODE": "",
      "BRKSTN_DIVISION_CODE": "",
      "BRKSTN_WEIGHT": 0,
      "BRKSTN_RATEFC": 0,
      "BRKSTN_RATELC": 0,
      "BRKSTN_AMTFC": 0,
      "BRKSTN_AMTLC": 0,
      "MAIN_WORKER": "",
      "FRM_WORKER": this.commonService.nullToString(detailScreenData.workerFrom),
      "FRM_PROCESS": this.commonService.nullToString(detailScreenData.processFrom),
      "CRACCODE": "",
      "LAB_ACCODE": "",
      "LAB_AMTFC": 0,
      "TO_PROCESS": this.commonService.nullToString(detailScreenData.processTo),
      "TO_WORKER": this.commonService.nullToString(detailScreenData.workerTo),
      "LAB_RATEFC": 0,
      "RATEFC": 0,
      "PRINTED": true,
      "PUREWT": this.commonService.emptyToZero(Number(detailScreenData.MetalWeightFrom)*Number(detailScreenData.StonePcsFrom)),
      "PURITY": this.commonService.emptyToZero(detailScreenData.PURITY),
      "SQLID": "",
      "ISBROCKEN": 0,
      "TREE_NO": this.commonService.nullToString(detailScreenData.treeno),
      "SETTED": true,
      "SETTED_PCS": 0,
      "SIEVE": "string",
      "FULL_RECOVERY": 0,
      "RECOVERY_DATE": "2023-10-21T07:24:35.989Z",
      "RECOV_LOSS": 0,
      "RECOV_LOSS_PURE": 0,
      "BROKENSTONE_PCS": 0,
      "BROKENSTONE_WT": 0,
      "ISMISSING": 0,
      "PROCESS_TYPE": "",
      "IS_AUTHORISE": true,
      "SUB_STOCK_CODE": "",
      "KARAT_CODE": "",
      "SIEVE_SET": "",
      "SCRAP_STOCK_CODE": "",
      "SCRAP_SUB_STOCK_CODE": "",
      "SCRAP_PURITY": 0,
      "SCRAP_WT": 0,
      "SCRAP_PURE_WT": 0,
      "SCRAP_PUDIFF": 0,
      "SCRAP_ACCODE": "",
      "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
      "ISSUE_GROSS_WT": 0,
      "ISSUE_STONE_WT": 0,
      "ISSUE_NET_WT": 0,
      "JOB_PCS": 0,
      "DESIGN_TYPE": "",
      "TO_STOCK_CODE": "",
      "FROM_STOCK_CODE": "",
      "FROM_SUB_STOCK_CODE": "",
      "LOSS_PURE_WT": 0,
      "EXCLUDE_TRANSFER_WT": true,
      "IRON_WT": 0,
      "IRON_SCRAP_WT": 0,
      "GAIN_WT": 0,
      "GAIN_PURE_WT": 0,
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z",
      "PUREWTTEMP": 0
    })
  }
  setHeaderGridDetails() {
    let detailScreenData = this.detailData[0].DATA
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS

    this.PTFDetailsToSave.push({
      "SRNO": 0,
      "UNIQUEID": 0,
      "VOCNO": 0,
      "VOCDATE": this.commonService.nullToString(this.processTransferFrom.value.vocdate),
      "VOCTYPE": this.commonService.nullToString(this.processTransferFrom.value.voctype),
      "BRANCH_CODE": this.branchCode,
      "JOB_NUMBER": this.commonService.nullToString(detailScreenData.jobno),
      "JOB_DATE": this.commonService.nullToString(detailScreenData.JOB_DATE),
      "UNQ_JOB_ID": this.commonService.nullToString(detailScreenData.subjobno),
      "UNQ_DESIGN_ID": "",
      "DESIGN_CODE": this.commonService.nullToString(detailScreenData.DESIGN_CODE),
      "SEQ_CODE": this.commonService.nullToString(detailScreenData.SEQ_CODE),
      "JOB_DESCRIPTION": "",
      "CURRENCY_CODE":  this.commonService.nullToString(this.processTransferFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.processTransferFrom.value.currencyrate),
      "FRM_PROCESS_CODE": this.commonService.nullToString(detailScreenData.processFrom),
      "FRM_PROCESSNAME": this.commonService.nullToString(detailScreenData.PROCESSDESC),
      "FRM_WORKER_CODE": this.commonService.nullToString(detailScreenData.workerFrom),
      "FRM_WORKERNAME": this.commonService.nullToString(detailScreenData.WORKERDESC),
      "FRM_PCS": this.commonService.emptyToZero(detailScreenData.StoneWeighFrom),
      "FRM_STONE_WT": this.commonService.emptyToZero(detailScreenData.StoneWeighFrom),
      "FRM_STONE_PCS": this.commonService.emptyToZero(detailScreenData.StonePcsFrom),
      "FRM_METAL_WT":  this.commonService.emptyToZero(detailScreenData.MetalWeightFrom),
      "FRM_METAL_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsFrom),
      "FRM_PURE_WT": this.commonService.emptyToZero(detailScreenData.PUREWT),
      "FRM_NET_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightFrom),
      "TO_PROCESS_CODE": this.commonService.nullToString(detailScreenData.processTo),
      "TO_PROCESSNAME": this.commonService.nullToString(detailScreenData.processToDescription),
      "TO_WORKER_CODE": this.commonService.nullToString(detailScreenData.workerTo),
      "TO_WORKERNAME": this.commonService.nullToString(detailScreenData.workerToDescription),
      "TO_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsTo),
      "TO_METAL_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsTo),
      "TO_STONE_WT": this.commonService.emptyToZero(detailScreenData.StoneWeightTo),
      "TO_STONE_PCS": this.commonService.emptyToZero(detailScreenData.StonePcsTo),
      "TO_METAL_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightTo),
      "TO_PURE_WT": this.commonService.emptyToZero(Number(detailScreenData.MetalWeightTo)*Number(detailScreenData.StonePcsTo)),
      "TO_NET_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightTo),
      "LOSS_QTY": this.commonService.emptyToZero(detailScreenData.stdLoss),
      "LOSS_PURE_QTY": this.commonService.emptyToZero(Number(detailScreenData.stdLoss)*Number(detailScreenData.PURITY)),
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "COSTFC_PER_PCS": 0,
      "COSTLC_PER_PCS": 0,
      "LAB_CODE": "",
      "LAB_UNIT": "",
      "LAB_RATEFC": 0,
      "LAB_RATELC": 0,
      "LAB_ACCODE": "",
      "LOSS_ACCODE": "",
      "FRM_WIP_ACCODE": "",
      "TO_WIP_ACCODE": "",
      "RET_METAL_DIVCODE": "",
      "RET_METAL_STOCK_CODE": "",
      "RET_STONE_DIVCODE": "",
      "RET_STONE_STOCK_CODE": "",
      "RET_METAL_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_STONE_WT": 0,
      "RET_METAL_RATEFC": 0,
      "RET_METAL_RATELC": 0,
      "RET_METAL_AMOUNTFC": 0,
      "RET_METAL_AMOUNTLC": 0,
      "RET_STONE_RATEFC": 0,
      "RET_STONE_RATELC": 0,
      "RET_STONE_AMOUNTFC": 0,
      "RET_STONE_AMOUNTLC": 0,
      "IN_DATE": "2023-10-21T07:24:35.989Z",
      "OUT_DATE": "2023-10-21T07:24:35.989Z",
      "TIME_TAKEN_HRS": 0,
      "METAL_DIVISION": "",
      "LOCTYPE_CODE": "",
      "PICTURE_PATH": "",
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "JOB_PCS": 0,
      "STONE_WT": this.commonService.emptyToZero(detailScreenData.StoneWeightTo),
      "STONE_PCS": this.commonService.emptyToZero(detailScreenData.StonePcsTo),
      "METAL_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightTo),
      "METAL_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsTo),
      "PURE_WT": this.commonService.emptyToZero(Number(detailScreenData.stdLoss)*Number(detailScreenData.PURITY)),
      "GROSS_WT": this.commonService.emptyToZero(detailScreenData.GrossWeightTo),
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "",
      "RET_LOC_STN": "",
      "MAIN_WORKER": "",
      "MKG_LABACCODE": "",
      "REMARKS": this.commonService.nullToString(detailScreenData.remarks),
      "TREE_NO": this.commonService.nullToString(detailScreenData.treeno),
      "STD_TIME": this.commonService.emptyToZero(detailScreenData.stdtime),
      "WORKER_ACCODE": "",
      "PRODLAB_ACCODE": "",
      "DT_BRANCH_CODE": this.commonService.branchCode,
      "DT_VOCTYPE": this.commonService.getqueryParamVocType(),
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.commonService.yearSelected,
      "ISSUE_REF": this.commonService.nullToString(detailScreenData.ISSUE_REF),
      "IS_AUTHORISE": true,
      "TIME_CONSUMED": 0,
      "SCRAP_STOCK_CODE":  this.commonService.nullToString(detailScreenData.stockCode),
      "SCRAP_SUB_STOCK_CODE": "",
      "SCRAP_PURITY": 0,
      "SCRAP_WT": 0,
      "SCRAP_PURE_WT": 0,
      "SCRAP_PUDIFF": 0,
      "SCRAP_ACCODE": "",
      "APPROVED_DATE": this.commonService.formatYYMMDD(detailScreenData.approveddate),
      "APPROVED_USER": this.commonService.nullToString(detailScreenData.approvedby),
      "SCRAP_PCS": 0,
      "SCRAP_STONEWT": 0,
      "SCRAP_NETWT": 0,
      "FROM_IRONWT": 0,
      "FROM_MSTOCKCODE": "",
      "TO_MSTOCKCODE": "",
      "DESIGN_TYPE": "",
      "TO_IRONWT": 0,
      "FRM_DIAGROSS_WT": 0,
      "EXCLUDE_TRANSFER_WT": true,
      "SCRAP_DIVCODE": "",
      "IRON_SCRAP_WT": 0,
      "GAIN_WT": 0,
      "GAIN_PURE_WT": 0,
      "GAIN_ACCODE": "",
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z"
    })
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.processTransferFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let detailScreenData = this.detailData[0].DATA
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS
    let API = 'JobProcessTrnMasterDJ/InsertJobProcessTrnMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.commonService.nullToString(this.processTransferFrom.value.voctype),
      "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "VOCNO": this.commonService.nullToString(this.processTransferFrom.value.vocno),
      "VOCDATE": this.commonService.nullToString(this.processTransferFrom.value.vocdate),
      "YEARMONTH": this.commonService.nullToString(this.yearMonth),
      "DOCTIME": "2023-10-21T07:24:35.989Z",
      "SMAN": this.commonService.nullToString(this.processTransferFrom.value.salesman),
      "REMARKS": this.commonService.nullToString(this.processTransferFrom.value.Narration),
      "CURRENCY_CODE": this.commonService.nullToString(this.processTransferFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.processTransferFrom.value.currencyrate),
      "NAVSEQNO": this.commonService.yearSelected,
      "LAB_TYPE": this.commonService.emptyToZero(detailScreenData.METALLAB_TYPE),
      "AUTOPOSTING": 0,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.formatYYMMDD(this.commonService.currentDate),
      "JOB_PROCESS_TRN_DETAIL_DJ": this.PTFDetailsToSave, //header grid details
      "JOB_PROCESS_TRN_STNMTL_DJ": this.detailScreenDataToSave, //detail screen data
      "JOB_PROCESS_TRN_LABCHRG_DJ": this.labourChargeDetailsToSave // labour charge details
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
                this.processTransferFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => this.toastr.error('Not saved'))
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);
    this.processTransferFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.processTransferFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.processTransferFrom.controls.vocno.setValue(this.content.VOCNO)
    this.processTransferFrom.controls.salesman.setValue(this.content.SMAN)
    this.processTransferFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.processTransferFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
  }


  update() {
    if (this.processTransferFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobProcessTrnMasterDJ/UpdateJobProcessTrnMasterDJ/' + this.processTransferFrom.value.branchCode + this.processTransferFrom.value.voctype + this.processTransferFrom.value.vocno + this.processTransferFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "VOCTYPE": this.processTransferFrom.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.processTransferFrom.value.vocno || "",
      "VOCDATE": this.processTransferFrom.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-21T07:24:35.989Z",
      "SMAN": this.processTransferFrom.value.salesman || "",
      "REMARKS": "",
      "CURRENCY_CODE": this.processTransferFrom.value.currency || "",
      "CURRENCY_RATE": this.processTransferFrom.value.currencyrate || "",
      "NAVSEQNO": 0,
      "LAB_TYPE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
      "JOB_PROCESS_TRN_DETAIL_DJ": [],
      "JOB_PROCESS_TRN_STNMTL_DJ": [],
      "JOB_PROCESS_TRN_LABCHRG_DJ": []
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
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
                this.processTransferFrom.reset()
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
      this.commonService.showSnackBarMsg('Please select Data to delete')
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
        let API = 'JobProcessTrnMasterDJ/DeleteJobProcessTrnMasterDJ/' +
          this.processTransferFrom.value.branchCode + '/' +
          this.processTransferFrom.value.voctype + '/' +
          this.processTransferFrom.value.vocno + '/' +
          this.processTransferFrom.value.yearMonth
        this.commonService.showSnackBarMsg('Loading....')
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            this.commonService.closeSnackBarMsg()
            if (result && result.status == "Success") {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.processTransferFrom.reset()
                  this.tableData = []
                  this.close('reloadMainGrid')
                }
              });
            } else {
              this.commonService.showSnackBarMsg('Error Something went wrong')
            }
          }, err => {
            this.commonService.closeSnackBarMsg()
            this.commonService.showSnackBarMsg('Error Something went wrong')
          })
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
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
