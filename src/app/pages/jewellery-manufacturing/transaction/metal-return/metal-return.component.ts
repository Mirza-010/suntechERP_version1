import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';
import { MetalReturnDetailsComponent } from './metal-return-details/metal-return-details.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-metal-return',
  templateUrl: './metal-return.component.html',
  styleUrls: ['./metal-return.component.scss']
})
export class MetalReturnComponent implements OnInit {
  divisionMS: any = 'ID';
  orders: any = [];
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  currentFilter: any;
  tableData: any[] = ['Process', 'Worker', 'Job No', 'Sub.Job No', 'Design', 'Stock Code', 'Gross Wt.', 'Net Wt.', 'Purity', 'Pure Wt.'];
  metalReturnDetailsData: any[] = [];
  columnhead: any[] = [''];
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate: any = this.commonService.currentDate;
  userName = this.commonService.userName;
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;

  allMode: string;
  checkBoxesMode: string;

  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

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

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  metalReturnForm: FormGroup = this.formBuilder.group({

    vocType: ['', [Validators.required]],
    vocNo: [1],
    vocDate: [''],
    vocTime: [new Date().toTimeString().slice(0, 5), [Validators.required]],
    enteredBy: [''],
    process: [''],
    worker: [''],
    location: [''],
    remarks: [''],
    FLAG: [null]
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,

  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.setInitialValues()
    this.setAllInitialValues()
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
    }
    if (this.content?.FLAG) {
      this.metalReturnForm.controls.FLAG.setValue(this.content.FLAG)
    }
  }


  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
    // this.companyName = this.commonService.companyName;
    this.yearMonth = this.commonService.yearSelected;
    this.metalReturnForm.controls.vocDate.setValue(this.currentDate)
    this.metalReturnForm.controls.vocType.setValue(this.commonService.getqueryParamVocType())
    //this.commonService.getqueryParamVocType()
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.metalReturnForm.controls.vocdate.setValue(new Date(date))
    }
  }
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobMetalReturnMasterDJ/GetJobMetalReturnMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.metalReturnDetailsData = data.Details
          console.log(this.tableData, 'table')
          data.Details.forEach((element: any) => {
            this.tableData.push({
              SRNO: element.SRNO,
              Job_id: element.JOB_NUMBER,
              Unq_job_id: element.UNQ_JOB_ID,
              Process: element.PROCESS_CODE,
              Design: element.DESIGN_CODE,
              Stock_Code: element.STOCK_CODE,
              Worker: element.WORKER_CODE,
              Description: element.JOB_DESCRIPTION,
              Carat: element.KARAT_CODE,
              Rate: element.RATE_TYPE,
              Division: element.DIVCODE,
              Amount: element.NET_WT,


            })
          });
          this.metalReturnForm.controls.vocType.setValue(data.VOCTYPE)
          this.metalReturnForm.controls.vocNo.setValue(data.VOCNO)
          this.metalReturnForm.controls.vocDate.setValue(data.VOCDATE)
          this.metalReturnForm.controls.process.setValue(data.Details[0].PROCESS_CODE)
          this.metalReturnForm.controls.worker.setValue(data.Details[0].WORKER_CODE)
          this.metalReturnForm.controls.enteredBy.setValue(data.Details[0].SMAN)
          this.metalReturnForm.controls.location.setValue(data.Details[0].LOCTYPE_CODE)
          this.metalReturnForm.controls.remarks.setValue(data.Details[0].REMARKS)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  userDataSelected(value: any) {
    console.log(value);
    this.metalReturnForm.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.process.setValue(e.Process_Code);
  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.worker.setValue(e.WORKER_CODE);
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.location.setValue(e.LOCATION_CODE);
  }

  openaddmetalreturn(data?: any) {
    console.log(data)
    if (data) {
      data[0] = this.metalReturnForm.value;
    } else {
      data = [{ HEADERDETAILS: this.metalReturnForm.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(MetalReturnDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    console.log(data, 'data')
    modalRef.componentInstance.content = data
    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from modal:', postData);
        this.metalReturnDetailsData.push(postData);
        console.log(this.metalReturnDetailsData);
        this.setValuesToHeaderGrid(postData);

      }

    });
  }
  onRowClickHandler(event: any) {

    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
    this.openaddmetalreturn(selectedData)


  }
  setValuesToHeaderGrid(detailDataToParent: any) {
    console.log(detailDataToParent, 'detailDataToParent');
    if (detailDataToParent.SRNO) {
      console.log(this.metalReturnDetailsData);

      this.swapObjects(this.metalReturnDetailsData, [detailDataToParent], (detailDataToParent.SRNO - 1))
    } else {
      this.tableRowCount += 1
      detailDataToParent.SRNO = this.tableRowCount
      // this.tableRowCount += 1
      // this.content.SRNO = this.tableRowCount
    }
    if (detailDataToParent) {
      this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
    }
  }
  swapObjects(array1: any, array2: any, index: number) {
    // Check if the index is valid
    if (index >= 0 && index < array1.length) {
      array1[index] = array2[0];
    } else {
      console.error('Invalid index');
    }
  }
  deleteTableData(): void {
    console.log(this.selectedKey, 'data')
    this.selectedKey.forEach((element: any) => {
      this.metalReturnDetailsData.splice(element.SRNO - 1, 1)
    })
  }
  onSelectionChanged(event: any) {


    this.selectedKey = event.selectedRowKeys;
    console.log(this.selectedKey, 'srno')
    let indexes: Number[] = [];
    this.metalReturnDetailsData.reduce((acc, value, index) => {
      if (this.selectedKey.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
       this.updateMeltingType()
      return
    }

    if (this.metalReturnForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalReturnMasterDJ/InsertJobMetalReturnMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.metalReturnForm.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.metalReturnForm.value.vocNo,
      "VOCDATE": this.metalReturnForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2024-03-05T12:13:39.290Z",
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "",
      "METAL_RATE": 0,
      "TOTAL_AMOUNTFC_METAL": 0,
      "TOTAL_AMOUNTLC_METAL": 0,
      "TOTAL_AMOUNTFC_MAKING": 0,
      "TOTAL_AMOUNTLC_MAKING": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_PURE_WT": 0,
      "SMAN": "string",
      "REMARKS": this.metalReturnForm.value.remarks,
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": "2023-10-06T11:27:36.260Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalReturnDetailsData,
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.metalReturnForm.reset()
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

  updateMeltingType() {
    if (this.metalReturnForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = `JobMetalReturnMasterDJ/UpdateJobMetalReturnMasterDJ/${this.branchCode}/${this.metalReturnForm.value.vocType}/${this.metalReturnForm.value.vocNo}/${this.commonService.yearSelected}`
    let postData = {

      "MID": 0,
      "VOCTYPE": this.metalReturnForm.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.metalReturnForm.value.vocNo,
      "VOCDATE": this.metalReturnForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2024-03-07T05:31:29.356Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "string",
      "METAL_RATE": 0,
      "TOTAL_AMOUNTFC_METAL": 0,
      "TOTAL_AMOUNTLC_METAL": 0,
      "TOTAL_AMOUNTFC_MAKING": 0,
      "TOTAL_AMOUNTLC_MAKING": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_PURE_WT": 0,
      "SMAN": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2024-03-07T05:31:29.356Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "str",
          "VOCDATE": "2024-03-07T05:31:29.357Z",
          "JOB_NUMBER": "string",
          "JOB_DATE": "2024-03-07T05:31:29.357Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": "string",
          "BRANCH_CODE": "string",
          "DESIGN_CODE": "string",
          "DIVCODE": "s",
          "STOCK_CODE": "string",
          "STOCK_DESCRIPTION": "string",
          "SUB_STOCK_CODE": "string",
          "KARAT_CODE": "stri",
          "PCS": 0,
          "GROSS_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "stri",
          "CURRENCY_RATE": 0,
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
          "TOTAL_AMOUNTFC": 0,
          "TOTAL_AMOUNTLC": 0,
          "PROCESS_CODE": "string",
          "PROCESS_NAME": "string",
          "WORKER_CODE": "string",
          "WORKER_NAME": "string",
          "UNQ_DESIGN_ID": "string",
          "WIP_ACCODE": "string",
          "UNIQUEID": 0,
          "LOCTYPE_CODE": "string",
          "RETURN_STOCK": "string",
          "SUB_RETURN_STOCK": "string",
          "STONE_WT": 0,
          "NET_WT": 0,
          "PART_CODE": "string",
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "PUDIFF": 0,
          "JOB_PURITY": 0
        }
      ]
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
                this.metalReturnForm.reset()
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
  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
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
        let API = 'JobMetalReturnMasterDJ/DeleteJobMetalReturnMasterDJ/' + this.metalReturnForm.value.brnachCode + this.metalReturnForm.value.voctype + this.metalReturnForm.value.vocNo + this.metalReturnForm.value.yearMoth;
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
                    this.metalReturnForm.reset()
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
                    this.metalReturnForm.reset()
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

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.process.setValue(e.Process_Code);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE ',
    SEARCH_HEADING: 'WORKER CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workerSelected(e: any) {
    console.log(e);
    this.metalReturnForm.controls.worker.setValue(e.WORKER_CODE);
  }


}
