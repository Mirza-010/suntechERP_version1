import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  minEndDate: string = '';
  divisionMS: any = 'ID';
  tableData: any[] = [];
  metalDetailData: any[] = [];
  jobNumberDetailData: any[] = [];
  ProcessTypeList: any[] = [{ type: 'GEN' }];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Process';
  designType: string = 'DIAMOND';
  private subscriptions: Subscription[] = [];
  jobNoSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processTransferdetailsForm: FormGroup = this.formBuilder.group({
    SRNO: [0],
    FLAG: [''],
    barCodeNumber: [''],
    JOB_NUMBER: [''],
    jobdes: [''],
    UNQ_JOB_ID: [''],
    subJobDescription: [''],
    approvedby: [''],
    approveddate: [''],
    startdate: [''],
    enddate: [''],
    stdtime: [''],
    timetaken: [''],
    consumed: [''],
    variance: [''],
    treeno: [''],
    remarks: [''],
    toggleSwitchtIssue: [true],
    //DIAMOND DETAIL STARTS
    FRM_PROCESS_CODE: [''],
    TO_PROCESS_CODE: [''],
    TO_PROCESSNAME: [''],
    FRM_WORKER_CODE: [''],
    TO_WORKER_CODE: [''],
    TO_WORKER_CODEDescription: [''],
    FRM_METAL_PCS: [''],
    MetalPcsTo: [''],
    MetalWeightFrom: [''],
    MetalWeightTo: [''],
    FromJobPcs: [''],
    ToJobPcs: [''],
    GrossWeightFrom: [''],
    GrossWeightTo: [''],
    Balance_WT: [''],
    stockCode: [''],
    scrapQuantity: [''],
    location: [''],
    stdLoss: [''],
    stdLossper: [''],
    StonePcsFrom: [''],
    StonePcsTo: [''],
    StoneWeightFrom: [''],
    StoneWeightTo: [''],
    partCode: [''],
    DESIGN_CODE: [''],
    JOB_DATE: [''],
    SEQ_CODE: [''],
    PROCESSDESC: [''],
    WORKERDESC: [''],
    PUREWT: [''],
    PURITY: [''],
    METALLAB_TYPE: [''],
    ISSUE_REF: [''],
    JOB_SO_NUMBER: [''],
    DIVCODE: [''],
    METALSTONE: [''],
    UNQ_DESIGN_ID: [''],
    JOB_DESCRIPTION: [''],
    PICTURE_PATH: [''],
    MAIN_STOCK_CODE: [''],
    SCRAP_PURITY: [''],
    DESIGN_TYPE: [''],
    EXCLUDE_TRANSFER_WT: [false],
    //METAL DETAILS STARTS
    METAL_quantity: [''],
    METAL_FRM_PROCESS_CODE: [''],
    METAL_TO_PROCESS_CODE: [''],
    METAL_TO_PROCESSNAME: [''],
    METAL_FRM_WORKER_CODE: [''],
    METAL_TO_WORKER_CODE: [''],
    METAL_TO_WORKER_CODEDescription: [''],
    METAL_LossBooked: [''],
    METAL_ScrapLocCode: [''],
    METAL_GainGrWt: [''],
    METAL_GainPureWt: [''],
    METAL_FromStockCode: [''],
    METAL_ToStockCode: [''],
    METAL_ScrapStockCode: [''],
    METAL_FromPCS: [''],
    METAL_ToPCS: [''],
    METAL_ScrapPCS: [''],
    METAL_BalPCS: [''],
    METAL_GrossWeightFrom: [''],
    METAL_GrossWeightTo: [''],
    METAL_ScrapGrWt: [''],
    METAL_BalGrWt: [''],
    METAL_StoneWeightFrom: [''],
    METAL_StoneWeightTo: [''],
    METAL_ScrapStoneWt: [''],
    METAL_BalStoneWt: [''],
    METAL_FromIronWeight: [''],
    METAL_ToIronWt: [''],
    METAL_ToIronScrapWt: [''],
    METAL_BalIronWt: [''],
    METAL_FromNetWeight: [''],
    METAL_ToNetWt: [''],
    METAL_ScrapNetWt: [''],
    METAL_BalNetWt: [''],
    METAL_FromPureWt: [''],
    METAL_ToPureWt: [''],
    METAL_ScrapPureWt: [''],
    METAL_BalPureWt: [''],
    
  });


  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) {
  }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setInitialValues() //set all values from parent to child
    this.processTransferdetailsForm.controls['enddate'].disable();
  }
  onStartDateChange() {
    this.processTransferdetailsForm.controls['enddate'].enable();

    const startDateValue = this.processTransferdetailsForm.get('startdate')?.value;

    if (startDateValue) {
      // Enable the end date control
      this.processTransferdetailsForm.controls['enddate'].enable();
  
      // Set the minimum end date to the selected start date
      this.minEndDate = startDateValue;
    }
  
}

  setInitialValues() {
    if (!this.content) return
    let dataFromParent = this.content
    this.processTransferdetailsForm.controls.SRNO.setValue(this.comService.nullToString(this.content.SRNO))
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(dataFromParent.JOB_NUMBER)
    console.log(this.content,'this.content');
    // return
    this.processTransferdetailsForm.controls.jobdes.setValue(dataFromParent.jobdes)
    this.processTransferdetailsForm.controls.UNQ_JOB_ID.setValue(dataFromParent.UNQ_JOB_ID)
    this.processTransferdetailsForm.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(dataFromParent.FRM_WORKER_CODE)
    this.processTransferdetailsForm.controls.TO_WORKER_CODE.setValue(dataFromParent.TO_WORKER_CODE)
    this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(dataFromParent.FRM_PROCESS_CODE)
    this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(dataFromParent.TO_PROCESS_CODE)
    this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(dataFromParent.FRM_METAL_PCS)
    this.processTransferdetailsForm.controls.MetalPcsTo.setValue(dataFromParent.MetalPcsTo)
    this.processTransferdetailsForm.controls.GrossWeightTo.setValue(dataFromParent.GrossWeightTo)
    this.processTransferdetailsForm.controls.approvedby.setValue(dataFromParent.approvedby)
    this.processTransferdetailsForm.controls.startdate.setValue(dataFromParent.startdate)
    this.processTransferdetailsForm.controls.enddate.setValue(dataFromParent.enddate)
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(dataFromParent.JOB_DATE)
    this.processTransferdetailsForm.controls.DESIGN_CODE.setValue(dataFromParent.DESIGN_CODE)
    this.processTransferdetailsForm.controls.SEQ_CODE.setValue(dataFromParent.SEQ_CODE)
    this.processTransferdetailsForm.controls.PROCESSDESC.setValue(dataFromParent.PROCESSDESC)
    this.processTransferdetailsForm.controls.WORKERDESC.setValue(dataFromParent.WORKERDESC)
    this.processTransferdetailsForm.controls.PUREWT.setValue(dataFromParent.PUREWT)
    this.processTransferdetailsForm.controls.MetalWeightFrom.setValue(dataFromParent.MetalWeightFrom)
    this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(dataFromParent.TO_PROCESSNAME)
    this.processTransferdetailsForm.controls.TO_WORKER_CODEDescription.setValue(dataFromParent.TO_WORKER_CODEDescription)
    this.processTransferdetailsForm.controls.PURITY.setValue(dataFromParent.PURITY)
    this.processTransferdetailsForm.controls.METALLAB_TYPE.setValue(dataFromParent.METALLAB_TYPE)
    this.processTransferdetailsForm.controls.remarks.setValue(dataFromParent.remarks)
    this.processTransferdetailsForm.controls.treeno.setValue(dataFromParent.treeno)
    this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(dataFromParent.JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.stockCode.setValue(dataFromParent.stockCode)
    this.processTransferdetailsForm.controls.DIVCODE.setValue(dataFromParent.DIVCODE)
    this.processTransferdetailsForm.controls.METALSTONE.setValue(dataFromParent.METALSTONE)
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.processTransferdetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.branchCode),
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
            this.jobNumberDetailData = data
            this.processTransferdetailsForm.controls.UNQ_JOB_ID.setValue(data[0].UNQ_JOB_ID)
            this.processTransferdetailsForm.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)
            this.processTransferdetailsForm.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.processTransferdetailsForm.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.processTransferdetailsForm.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
            this.processTransferdetailsForm.controls.PROCESSDESC.setValue(data[0].PROCESSDESC)
            this.processTransferdetailsForm.controls.WORKERDESC.setValue(data[0].WORKERDESC)
            this.processTransferdetailsForm.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
            if (data[0].DESIGN_TYPE != '' && (data[0].DESIGN_TYPE).toUpperCase() == 'METAL') this.designType = 'METAL';

            this.processTransferdetailsForm.controls.DESIGN_TYPE.setValue(this.designType)
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

  /**USE: subjobnumber validate API call subjobvalidate  '156516/4/01'*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.processTransferdetailsForm.value.UNQ_JOB_ID,
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(data[0].PROCESS)
          this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(data[0].WORKER)
          this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.processTransferdetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.processTransferdetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.processTransferdetailsForm.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.processTransferdetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          this.processTransferdetailsForm.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          this.processTransferdetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          this.stockCodeScrapValidate()
          this.fillStoneDetails()
          
          this.setValueWithDecimal('MetalWeightFrom',data[0].METAL,'METAL')
          this.setValueWithDecimal('FromJobPcs',data[0].PCS,'AMOUNT')
          this.setValueWithDecimal('ToJobPcs',data[0].PCS,'AMOUNT')
          this.setValueWithDecimal('FRM_METAL_PCS',data[0].PCS,'AMOUNT')
          this.setValueWithDecimal('GrossWeightFrom',data[0].NETWT,'METAL')
          this.setValueWithDecimal('StoneWeightFrom',data[0].STONE,'STONE')
          this.setValueWithDecimal('PUREWT',data[0].PUREWT,'AMOUNT')
          this.setValueWithDecimal('PURITY',data[0].PURITY,'PURITY')
          
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  //stockCode Scrap Validate
  stockCodeScrapValidate() {
    if (this.comService.nullToString(this.processTransferdetailsForm.value.stockCode == '')) return
    let postData = {
      "SPID": "044",
      "parameter": {
        'STRSTOCKCODE': this.comService.nullToString(this.processTransferdetailsForm.value.stockCode)
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.processTransferdetailsForm.controls.MAIN_STOCK_CODE.setValue(data[0].MAIN_STOCK_CODE)
          this.processTransferdetailsForm.controls.SCRAP_PURITY.setValue(data[0].PURITY)

        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE: fillStoneDetails grid data */
  private fillStoneDetails(): void {
    let postData = {
      "SPID": "042",
      "parameter": {
        strJobNumber: this.processTransferdetailsForm.value.JOB_NUMBER,
        strUnq_Job_Id: this.processTransferdetailsForm.value.UNQ_JOB_ID,
        strProcess_Code: this.processTransferdetailsForm.value.FRM_PROCESS_CODE,
        strWorker_Code: this.processTransferdetailsForm.value.FRM_WORKER_CODE,
        strBranch_Code: this.branchCode
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
          if (data) {
            this.metalDetailData = data
            this.formatMetalDetailDataGrid()
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
  formatMetalDetailDataGrid() {
    this.metalDetailData.forEach((element: any) => {
      element.SETTED_FLAG = false
      element.GROSS_WT = this.comService.decimalQuantityFormat(element.GROSS_WT, 'METAL')
      element.STONE_WT = this.comService.decimalQuantityFormat(element.STONE_WT, 'STONE')
      element.PURITY = this.comService.decimalQuantityFormat(element.PURITY, 'PURITY')
    });
  }
  /**USE: barcode Number Validate API call */
  barcodeNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "041",
      "parameter": {
        'BLNPROCESS': this.comService.nullToString(this.processTransferdetailsForm.value.toggleSwitchtIssue ? 1 : 0),
        'STRBRANCH': this.comService.nullToString(this.branchCode),
        'STRYEARMONTH': this.comService.nullToString('2008'),
        'TXTISSUEREF': this.comService.nullToString(event.target.value)
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          console.log(data, 'data');

          if (data[0]) {

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
  toggleSwitchChange(event: any) {
    if (this.processTransferdetailsForm.value.toggleSwitchtIssue) {
      this.MetalorProcessFlag = 'Process'
    } else {
      this.MetalorProcessFlag = 'Metal'
    }
  }
  /**USE: Process Master Validate */
  processMasterValidate(event: any, flag: string): void {
    if (event.target.value == '') return
    event.target.value = (event.target.value).toUpperCase()
    let API: string = `ProcessMasterDj/GetProcessMasterDjWithProcessCode/${event.target.value}`
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.response) {
          let data = result.response
          this.setProcessCodeData(data.PROCESS_CODE, flag)
        } else {
          this.setProcessCodeData('', flag)
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE set processcode to form */
  setProcessCodeData(Code: string, flag: any) {
    if (flag == 'FROM') {
      this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(Code)
    } else {
      this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(Code)
    }
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(event.Process_Code)
    this.processTransferdetailsForm.controls.PROCESSDESC.setValue(event.Description)
   
  }
  processCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(event.Process_Code)
    this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(event.Description)
   

  }

  metalprocessCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_PROCESS_CODE.setValue(event.Process_Code)
  }
  metalprocessCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_PROCESS_CODE.setValue(event.Process_Code)
    this.processTransferdetailsForm.controls.METAL_TO_PROCESSNAME.setValue(event.Description)

  }

  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(event.WORKER_CODE)
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.TO_WORKER_CODEDescription.setValue(event.DESCRIPTION)
  }

  metalworkerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_WORKER_CODE.setValue(event.WORKER_CODE)
  }
  
  metalworkerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.METAL_TO_WORKER_CODEDescription.setValue(event.DESCRIPTION)
  }

  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(event.job_number)
    this.processTransferdetailsForm.controls.jobdes.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  /**USE: SUBMIT detail */
  formSubmit(flag:any) {
    let detailDataToParent: any = {
      PROCESS_FORMDETAILS: [],
      METAL_DETAIL_GRID: [],
      JOB_VALIDATE_DATA: []
    }
    this.processTransferdetailsForm.controls.FLAG.setValue(flag)
    this.calculateGain()
    
    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    detailDataToParent.METAL_DETAIL_GRID = this.metalDetailData; //grid data
    detailDataToParent.JOB_VALIDATE_DATA = this.jobNumberDetailData;
    // this.close(detailDataToParent)
    console.log(detailDataToParent, 'child invoked');
    this.saveDetail.emit(detailDataToParent);
  }
  /**USE: to calculate gain detail */
  private calculateGain() {
    let formValues = this.processTransferdetailsForm.value;
    let gainGrWt = this.calculateGainGrWt(formValues.METAL_GrossWeightTo, formValues.METAL_GrossWeightFrom, formValues.METAL_ScrapGrWt)
    this.processTransferdetailsForm.controls.METAL_GainGrWt.setValue(gainGrWt)
    let gainPureWt = this.calculateGainGrWt(formValues.METAL_ToPureWt, formValues.METAL_FromPureWt, formValues.METAL_ScrapPureWt);
    this.processTransferdetailsForm.controls.METAL_GainPureWt.setValue(gainPureWt)
  }
  calculateGainGrWt(a: any, b: any, c: any) {
    if (!Number(a) && !Number(a) && !Number(a)) return 0
    return (this.comService.emptyToZero(a) - (this.comService.decimalQuantityFormat((Number(b) + Number(c)), 'METAL')))
  }
  setFormValues() {
    if (!this.content) return
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(this.content.JOB_NUMBER)
    this.processTransferdetailsForm.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.processTransferdetailsForm.controls.UNQ_JOB_ID.setValue(this.content.JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.approvedby.setValue(this.content.APPROVED_USER)
    this.processTransferdetailsForm.controls.approveddate.setValue(this.content.APPROVED_DATE)
    this.processTransferdetailsForm.controls.startdate.setValue(this.content.IN_DATE)
    this.processTransferdetailsForm.controls.enddate.setValue(this.content.OUT_DATE)
    this.processTransferdetailsForm.controls.stdtime.setValue(this.content.STD_TIME)
    this.processTransferdetailsForm.controls.timetaken.setValue(this.content.TIME_TAKEN_HRS)
    this.processTransferdetailsForm.controls.treeno.setValue(this.content.TREE_NO)
    this.processTransferdetailsForm.controls.remarks.setValue(this.content.REMARKS)
  }

  close(data?: any) {
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
