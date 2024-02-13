import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheme-register',
  templateUrl: './scheme-register.component.html',
  styleUrls: ['./scheme-register.component.scss']
})
export class SchemeRegisterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild('add_scheme') add_scheme: any;
  @ViewChild('pos_customer_search') pos_customer_search: any;

  formdata = new FormData();
  isLoading: boolean = false
  viewOnly: boolean = false;
  isViewSchemeMasterGrid: boolean = true;

  selectedFieldValue: string = '';
  VIEWEDITFLAG: string = '';

  schemeReceiptList: any[] = [];
  schemeReceiptListHead: any[] = [];
  newSchemeItems: any[] = [];
  SchemeMasterDetails: any[] = [];
  IdTypesList: any[] = [];
  schemeArray: any[] = []
  dataToEditrow: any[] = [];
  detailArray: any[] = []
  newSchemeLength: number = 0
  dataIndex: any;
  currentDate: any = new Date();

  customerMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterWithName: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'NAME',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterWithMobile: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'MOBILE',
    SEARCH_HEADING: 'Pos Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SCHEMEMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 59,
    SEARCH_FIELD: 'SCHEME_CODE',
    SEARCH_HEADING: 'Scheme Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "status = 1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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
  Attachedfile: any[] = [];

  schemeRegistrationForm: FormGroup = this.formBuilder.group({
    SchemeId: [''],
    SCHEME_CODE: [''],
    Code: ['', Validators.required],
    Name: ['', Validators.required],
    MobileNo: [''],
    Email: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
    PanNo: [''],
    Branch: [''],
    DateOfJoining: [''],
    AlertBeforeDays: [''],
    CancellationCharge: [''],
    TenurePeriod: [''],
    MaturingDate: [''],
    InstallmentAmount: [0],
    BonusInstallment: [''],
    Units: [1],
    Frequency: [''],
    TotalAmountToPay: [''],
    SchemeType: [''],
    Salesman: ['', Validators.required],
    SalesmanName: [''],
    SumAssured: [''],
    Remarks: [''],
    SendAlert: [false],
    VOCTYPE: [''],
    VOCDATE: [''],
    SCH_REMINDER_MODE: [0],
    SCH_PARTIALLY_PAID: [false],
    PAY_STATUS: [false],
    REMAINDER_SEND: [true],
    SCH_SEND_ALERT: [true],
    SCH_CANCEL: [false],
    SCH_REDEEM: [false],
    SCH_STATUS: [''],
    SCH_REMINDER_DAYS: [0],
    UNIQUEID: [0],
    SCH_CUSTOMER_ID: [''],
    Attachedfile: [null],
  });
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private activeModal: NgbActiveModal,
    private snackBar: MatSnackBar,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.editMainGridDetails = this.editMainGridDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }
  ngOnInit(): void {
    this.schemeRegistrationForm.controls.Branch.setValue(this.commonService.branchCode);
    this.schemeRegistrationForm.controls.DateOfJoining.setValue(this.currentDate)
    this.schemeRegistrationForm.controls.VOCDATE.setValue(this.currentDate)
    this.schemeRegistrationForm.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.setInitialValues()
  }
  ngAfterViewInit(): void {
    this.getIDtypes() //ID master list
  }
  SalesmanSelected(event: any) {
    this.schemeRegistrationForm.controls.Salesman.setValue(event.SALESPERSON_CODE)
    this.schemeRegistrationForm.controls.SalesmanName.setValue(event.DESCRIPTION)
  }
  setInitialValues() {
    if (!this.content) return;
    this.schemeRegistrationForm.controls.VOCTYPE.setValue(this.content.PAY_VOCTYPE)
    this.schemeRegistrationForm.controls.Code.setValue(this.content.SCH_SCHEME_CODE)
    this.schemeRegistrationForm.controls.Name.setValue(this.content.SCH_CUSTOMER_NAME)
    this.schemeRegistrationForm.controls.MobileNo.setValue(this.content.SCH_ALERT_MOBILE)
    this.schemeRegistrationForm.controls.Email.setValue(this.content.SCH_ALERT_EMAIL)
    this.getSchemeRegistrationDetail(this.content.SCH_CUSTOMER_ID)
  }
  //schemeid EDIT and VIEW Value Change
  getSchemeRegistrationDetail(SCH_CUSTOMER_ID: any) {
    let API = `SchemeRegistration/GetSchemeRegistrationDetail/${SCH_CUSTOMER_ID}`
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.SchemeMasterDetails = data.Details
          this.schemeRegistrationForm.controls.Branch.setValue(data.PAY_BRANCH_CODE)
          this.schemeRegistrationForm.controls.Salesman.setValue(data.SALESPERSON_CODE)
          this.schemeRegistrationForm.controls.TotalAmountToPay.setValue((data.SCH_INST_AMOUNT_CC * data.SCH_SCHEME_PERIOD) + data.SCHEME_BONUS)
          this.schemeRegistrationForm.controls.SCHEME_CODE.setValue(data.SCH_SCHEME_CODE)
          this.schemeRegistrationForm.controls.SchemeId.setValue(data.SCH_SCHEME_CODE)
          this.schemeRegistrationForm.controls.Units.setValue(data.SCH_UNITS)
          this.schemeRegistrationForm.controls.SendAlert.setValue(data.SCH_SEND_ALERT)
          this.schemeRegistrationForm.controls.TenurePeriod.setValue(data.SCH_SCHEME_PERIOD)
          this.schemeRegistrationForm.controls.Frequency.setValue(data.SCH_METALCURRENCY)
          this.schemeRegistrationForm.controls.InstallmentAmount.setValue(data.SCH_INST_AMOUNT_CC)
          this.schemeRegistrationForm.controls.CancellationCharge.setValue(data.SCH_CANCEL_AMT)
          this.schemeRegistrationForm.controls.SumAssured.setValue(data.SCH_ASSURED_AMT_FC)
          this.schemeRegistrationForm.controls.MobileNo.setValue(data.SCH_ALERT_MOBILE)
          this.schemeRegistrationForm.controls.Email.setValue(data.SCH_ALERT_EMAIL)
          this.schemeRegistrationForm.controls.BonusInstallment.setValue(data.SCHEME_BONUS)
          this.schemeRegistrationForm.controls.Remarks.setValue(data.REMARKS)
          this.schemeRegistrationForm.controls.PanNo.setValue(data.PAN_NUMBER)
          this.schemeRegistrationForm.controls.DateOfJoining.setValue(data.SCH_JOIN_DATE)
          this.schemeRegistrationForm.controls.VOCDATE.setValue(data.VOCDATE)

          let params = {
            "ID": 1,
            "SCHEME_UNIQUEID": this.commonService.nullToString(data.Details[0].UNIQUEID),
            "SCHEME_ID": this.commonService.nullToString(data.SCH_CUSTOMER_CODE),
            "SCHEME_UNITS": this.commonService.emptyToZero(data.SCH_UNITS),
            "SCHEME_TOTAL_VALUE": this.commonService.emptyToZero(data.PAY_AMOUNTFC),
            "SCHEME_STARTED": this.commonService.nullToString(this.commonService.formatDateTime(data.SCH_JOIN_DATE)),
            "SCHEME_ENDEDON": this.commonService.nullToString(this.commonService.formatDateTime(data.SCH_EXPIRE_DATE)),
            "SCHEME_STATUS": this.commonService.nullToString(data.SCH_STATUS?.toString() == '1' ? 'Active' : 'InActive'),
            "SCHEME_UNITVALUE": this.commonService.emptyToZero(Number(data.SCH_UNITS) * Number(data.PAY_AMOUNTFC)),
            "SCHEME_CUSTCODE": this.commonService.nullToString(this.schemeRegistrationForm.value.Code),
            "BRANCH_CODE": data.Branch || new Date(1 / 1 / 1753).toISOString(),
            "PCS_SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
            "SalesManCode": this.commonService.nullToString(data.Salesman),
            "AttachmentPath": '',
            "BANK_ACCOUNTNO": "",
            "BANK_IBANNO": "",
            "BANK_SWIFTID": "",
            "BANK_EMISTARTDATE": this.commonService.formatDateTime(this.currentDate),
            "BANK_EMIENDDATE": this.commonService.formatDateTime(this.currentDate),
            "ACTIVE": true,
            "SCHEME_REMARKS": '',
            "CUSTOMER_ACCOUNTNO": '',
            "BANK_DATE": this.commonService.formatDateTime(this.currentDate),
            "SCHEME_BLOCK": data.SCH_REDEEM ? 1 : 0,
            "SCHEME_ControlRedeemDate": this.commonService.formatDateTime(this.currentDate),
          }
          this.newSchemeItems.push(params)

          let datas = {
            "schemeData": params,
            // "ImageData": {
            //   "BRANCH_CODE": this.commonService.branchCode || "",
            //   "VOCTYPE": "PCR",
            //   "YEARMONTH": this.commonService.yearSelected,
            //   "VOCNO": 0
            // },
            // "Images": data.Attachedfile || []
          }
          this.detailArray.push(datas)

          this.commonService.closeSnackBarMsg();
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
        this.commonService.closeSnackBarMsg();
      })
    this.subscriptions.push(Sub)
  }

  /**schemeID change function */
  schemeIDChange(event: any) {
    if (event.target.value == "") return;
    let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${event.target.value}`;
    let Sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((result: any) => {
        let sataus = result.status.trim().toLowerCase();
        if (sataus == "success") {
          if (result.response["SCHEME_CUSTCODE"]) {
            let event = {
              target: { value: result.response["SCHEME_CUSTCODE"] },
            };
            this.searchValueChange(event, "CODE", true);
          }
          this.newSchemeItems = [];
          this.newSchemeItems.push(result.response);
        } else {
          Swal.fire({
            title: "Scheme Id Not Found",
            text: "",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          });
        }
      });
    this.subscriptions.push(Sub);
  }
  customizeText(data: any) {
    let num = Number(data.value).toFixed(2)
    return num
  }
  /**USE: grid click event */
  onRowClickHandler(event: any) {
    this.VIEWEDITFLAG = 'EDIT'
    this.dataIndex = event.dataIndex
  }
  customizeDate(data: any) {
    if (!data.value) return
    return data.value.slice(0, 10)
  }
  openAttchments(e: any) {
    const columnName = e.column?.dataField;
    const cellValue = e.data[columnName];

    // Handle the cell click event based on the column and value
    if (columnName === 'IS_ATTACHMENT_PRESENT') {
      // let SCHEME_UNIQUEID = e.row.data.SCHEME_UNIQUEID;
      let API = `SchemeRegistration/GetSchemeAttachments`
      let param = { SCH_CUSTOMER_ID: this.content.SCH_CUSTOMER_ID }
      let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API, param)
        .subscribe((result: any) => {
          if (result.fileCount > 0) {

            for (let j = 0; j < result.file.length; j++) {
              window.open(
                result.file[j],
                '_blank' // <- This is what makes it open in a new window.
              );
            }
          } else {
            this.commonService.toastErrorByMsgId(result.message)
          }
        })
    }
  }
  cancelScheme() {
    this.SchemeMasterDetails = []
    this.schemeRegistrationForm.controls.code.setValue('')
  }
  addScheme() {
    this.isViewSchemeMasterGrid = false
  }
  fetchSchemeWithCustCode() {
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = `SchemeMaster/GetSchemeMasterDetails/${this.schemeRegistrationForm.value.Branch}/${this.schemeRegistrationForm.value.SchemeId}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        if (result.response) {
          let data = result.response
          this.schemeRegistrationForm.controls.Branch.setValue(data.BRANCH_CODE)
          this.schemeRegistrationForm.controls.Frequency.setValue(data.SCHEME_FREQUENCY)
          this.schemeRegistrationForm.controls.Units.setValue(data.SCHEME_UNIT)
          this.schemeRegistrationForm.controls.DateOfJoining.setValue(data.START_DATE)
          this.schemeRegistrationForm.controls.MaturingDate.setValue(data.START_DATE)
          this.schemeRegistrationForm.controls.TenurePeriod.setValue(data.SCHEME_PERIOD)
          this.schemeRegistrationForm.controls.BonusInstallment.setValue(
            this.commonService.decimalQuantityFormat(data.SCHEME_BONUS, 'THREE')
          )
          this.schemeRegistrationForm.controls.TotalAmountToPay.setValue(
            this.commonService.decimalQuantityFormat(data.SCHEME_AMOUNT * data.SCHEME_PERIOD, 'THREE')
          )
          this.schemeRegistrationForm.controls.SumAssured.setValue(
            (data.SCHEME_AMOUNT * data.SCHEME_PERIOD) + data.SCHEME_BONUS
            // this.commonService.decimalQuantityFormat(
            //   (data.SCHEME_AMOUNT * data.SCHEME_PERIOD) + data.SCHEME_BONUS, 'THREE')
          )
          this.schemeRegistrationForm.controls.CancellationCharge.setValue(
            this.commonService.decimalQuantityFormat(data.CANCEL_CHARGE, 'THREE')
          )
          this.schemeRegistrationForm.controls.InstallmentAmount.setValue(
            this.commonService.decimalQuantityFormat(data.SCHEME_AMOUNT, 'THREE')
          )
          let maturingdate = this.commonService.addDaysToDate(this.schemeRegistrationForm.value.DateOfJoining, this.schemeRegistrationForm.value.TenurePeriod)
          this.schemeRegistrationForm.controls.MaturingDate.setValue(maturingdate)
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      })
    this.subscriptions.push(Sub)
  }

  ReminderSendSelected(data: any, value: any) {
    this.SchemeMasterDetails[value.data.SRNO - 1].REMAINDER_SEND = data.REMAINDER_SEND ? true : false;
    //this.stonePrizeMasterForm.controls.sleve_set.setValue(data.CODE)
  }
  addrowsWithAPI() {
    let formValue = this.schemeRegistrationForm.value
    let joindate = this.commonService.formatYYMMDD(new Date(formValue.DateOfJoining))
    let params = {
      BRANCH_CODE: formValue.Branch || this.commonService.branchCode,
      SCHEME_CODE: this.commonService.nullToString(formValue.SchemeId),
      joinDate: this.commonService.nullToString(joindate),
      alertBeforeDays: this.commonService.emptyToZero(formValue.AlertBeforeDays),
      tenure: this.commonService.emptyToZero(formValue.TenurePeriod),
    }
    let API = `SchemeRegistration`
    let sub: Subscription = this.dataService.getDynamicAPIwithParams(API, params)
      .subscribe((resp: any) => {
        if (resp) {
          this.SchemeMasterDetails = resp.response
          this.SchemeMasterDetails.forEach((item: any) => {
            item.RCVD_BRANCH_CODE = this.schemeRegistrationForm.value.Branch
            item.RCVD_VOCTYPE = this.schemeRegistrationForm.value.VOCTYPE
            item.RCVD_YEARMONTH = this.commonService.yearSelected
            item.RCVD_VOCNO = item.RCVD_VOCNO.toString()
            if (item.REMAINDER_SEND.toString() == '0') {
              item.REMAINDER_SEND = false
            } else {
              item.REMAINDER_SEND = true
            }
          })
        } else {
          this.commonService.toastErrorByMsgId('Server Error')
        }
      });
    this.subscriptions.push(sub)
  }
  addRowsToGridFrontend(period?: any) {
    this.SchemeMasterDetails = []
    let noOFInstallment = Number(this.schemeRegistrationForm.value.TenurePeriod) || period
    for (let index = 0; index < noOFInstallment; index++) {
      this.SchemeMasterDetails.push(
        {
          UNIQUEID: 0,
          SCH_CUSTOMER_CODE: this.schemeRegistrationForm.value.code,
          SCH_CUSTOMER_ID: "",
          SRNO: index + 1,
          PAY_DATE: this.schemeRegistrationForm.value.DateOfJoining,
          PAY_AMOUNT_FC: this.schemeRegistrationForm.value.installmentAmount,
          PAY_AMOUNT_CC: this.schemeRegistrationForm.value.installmentAmount,
          PAY_STATUS: this.schemeRegistrationForm.value.PAY_STATUS,
          REMAINDER_DATE: this.schemeRegistrationForm.value.DateOfJoining,
          REMAINDER_SEND: 0,
          DT_BRANCH_CODE: this.schemeRegistrationForm.value.Branch,
          RCVD_DATE: this.schemeRegistrationForm.value.DateOfJoining,
          RCVD_BRANCH_CODE: this.schemeRegistrationForm.value.Branch,
          RCVD_VOCTYPE: this.schemeRegistrationForm.value.VOCTYPE,
          RCVD_VOCNO: 0,
          RCVD_YEARMONTH: 0,
          RCVD_AMOUNTFC: 0,
          RCVD_AMOUNTCC: 0,
          SCHBAL_AMOUNTFC: 0,
          SCHBAL_AMOUNTCC: 0,
          SCH_PARTIALLY_PAID: true,
          RECEIPT_REF: "",
          RECEIPT_MID: 0,
          Images: []
        }
      )

    }
  }
  exportToExcel() {
    this.commonService.exportExcel(this.schemeReceiptList, 'Scheme Details')
  }

  /**USE get Nationalitycode from API */
  getIDtypes() {
    let API = 'GeneralMaster/GetGeneralMasterList/ID MASTER'
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        this.IdTypesList = result.response;
      });
    this.subscriptions.push(Sub)
  }
  //search Value Change SCHEME_CUSTCODE
  searchValueChange(event: any, searchFlag: string, schemeFlag?: boolean) {
    if (event.target.value == '') return
    // let API = `Scheme/CustomerMaster?${searchFlag}=${event.target.value}`
    let API = `PosCustomerMaster/GetCustomerByCode/${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.selectedCustomer(result.response, schemeFlag)
      } else {
        this.reset()
        // this.changeCode(event,searchFlag)
        Swal.fire({
          title: 'Customer Not Found!',
          text: "",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          // if (result.isConfirmed) {
          // }
        })
      }
    }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteTableData() {
    this.newSchemeItems = []
  }
  saveClick() {
    this.schemeRegistrationForm.reset()
    this.isViewSchemeMasterGrid = true;

    this.isLoading = false
    this.schemeReceiptList = [];
    this.schemeReceiptListHead = [];
    this.newSchemeItems = [];
    this.IdTypesList = [];
    this.schemeArray = []
    this.dataToEditrow = [];
  }
  selectedCustomer(data: any, schemeFlag?: boolean) {
    this.schemeRegistrationForm.controls.Code.setValue(data.CODE)
    this.schemeRegistrationForm.controls.MobileNo.setValue(data.MOBILE)
    this.schemeRegistrationForm.controls.Name.setValue(data.NAME)
    this.schemeRegistrationForm.controls.Email.setValue(data.EMAIL)
    // this.schemeRegistrationForm.controls.GovIdType.setValue(data.Idcategory)
    // this.schemeRegistrationForm.controls.GovIdNumber.setValue(data.POSCustIDNo)
    // if (data.CODE && !schemeFlag) this.fetchSchemeWithCustCode()
  }
  selectedScheme(data: any, schemeFlag?: boolean) {
    this.schemeRegistrationForm.controls.SCHEME_CODE.setValue(data.SCHEME_CODE)
    this.schemeRegistrationForm.controls.SchemeId.setValue(data.SCHEME_CODE)
    if (data.SCHEME_CODE) this.fetchSchemeWithCustCode()
  }
  reset() {
    this.schemeRegistrationForm.controls.Code.setValue('')
    this.schemeRegistrationForm.controls.MobileNo.setValue('')
    this.schemeRegistrationForm.controls.Name.setValue('')
    this.schemeRegistrationForm.controls.Email.setValue('')
    this.schemeRegistrationForm.controls.GovIdType.setValue(null)
    this.schemeRegistrationForm.controls.GovIdNumber.setValue('')
  }

  cancel() {
    this.reset()
    this.isViewSchemeMasterGrid = true;
    this.detailArray = []
    this.isLoading = false
    this.schemeReceiptList = [];
    this.schemeReceiptListHead = [];
    this.newSchemeItems = [];
    this.schemeArray = []
    this.dataToEditrow = [];
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }


  addNewRow(data: any) {
    let params = {
      "ID": 1,
      "SCHEME_UNIQUEID": '',
      "SCHEME_ID": this.commonService.nullToString(data.SchemeID),
      "SCHEME_UNITS": this.commonService.emptyToZero(data.Units),
      "SCHEME_TOTAL_VALUE": this.commonService.emptyToZero(data.TotalValue),
      "SCHEME_STARTED": this.commonService.formatDateTime(data.StartDate),
      "SCHEME_ENDEDON": this.commonService.formatDateTime(data.endDate),
      "SCHEME_STATUS": this.commonService.nullToString(data.Status),
      "SCHEME_UNITVALUE": this.commonService.emptyToZero(data.SchemeAmount),
      "SCHEME_CUSTCODE": this.commonService.nullToString(this.schemeRegistrationForm.value.Code),
      "BRANCH_CODE": this.commonService.nullToString(data.Branch),
      "PCS_SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "SalesManCode": this.commonService.nullToString(data.Salesman),
      "AttachmentPath": '',
      "BANK_ACCOUNTNO": "",
      "BANK_IBANNO": "",
      "BANK_SWIFTID": "",
      "BANK_EMISTARTDATE": this.commonService.formatDateTime(this.currentDate),
      "BANK_EMIENDDATE": this.commonService.formatDateTime(this.currentDate),
      "ACTIVE": true,
      "SCHEME_REMARKS": '',
      "CUSTOMER_ACCOUNTNO": '',
      "BANK_DATE": this.commonService.formatDateTime(this.currentDate),
      "SCHEME_BLOCK": data.BlockScheme ? 1 : 0,
      "SCHEME_ControlRedeemDate": this.commonService.formatDateTime(this.currentDate),
    }
    if (this.VIEWEDITFLAG == 'EDIT') {
      this.newSchemeItems[this.dataIndex] = params;
      this.VIEWEDITFLAG = ''
    } else {
      this.newSchemeItems.push(params)
    }

    let datas = {
      "schemeData": params,
      // "ImageData": {
      //   "BRANCH_CODE": this.commonService.branchCode || "",
      //   "VOCTYPE": "PCR",
      //   "YEARMONTH": this.commonService.yearSelected,
      //   "VOCNO": 0
      // },
      "Images": data.Attachedfile || []
    }
    this.detailArray.push(datas)
  }

  replaceObject(updatedObject: any): void {
    const index = this.newSchemeItems.findIndex((item: any) => item.id === updatedObject.id);

    if (index !== -1) {
      // Replace the object at the found index
      this.newSchemeItems[index] = updatedObject;
    }
  }
  onFileChange(input: any) {
    if (input.target.files.length > 0) {
      const file: File = input.target.files[0];
      for (let x = 0; x < input.target.files.length; x++) {
        this.Attachedfile.push(file);
        this.schemeRegistrationForm.controls.Attachedfile.setValue(this.Attachedfile);
        // this.formdata.append("Images[" + x + "].Image.File", file);
      }
    }
  }
  formSubmit() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.editSchemeDetail(this.content)
      this.schemeRegistrationForm.controls.SCH_CUSTOMER_ID.setValue(this.content.SCH_CUSTOMER_ID)
      return
    }
    if (this.schemeRegistrationForm.invalid) {
      this.commonService.toastErrorByMsgId('select all required details!')
      return
    }

    if (this.SchemeMasterDetails.length == 0) {
      this.commonService.toastErrorByMsgId('Process Scheme Before saving')
      return
    }
    let postData = this.setPostData()
    this.isLoading = true;
    this.commonService.showSnackBarMsg('MSG81447');
    let API = 'SchemeRegistration/InsertSchemeRegistration'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result: any) => {
        this.isLoading = false;
        this.commonService.closeSnackBarMsg();
        if (result.status == "Success") {
          this.detailArray = []
          this.formdata = new FormData();
          Swal.fire({
            title: result.status,
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.close('reloadMainGrid')
          })
        } else {
          this.detailArray = []
          this.commonService.toastErrorByMsgId('Scheme Not Saved, try again')
        }
      }, err => {
        this.detailArray = []
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531')
        this.isLoading = false;
      })
    this.subscriptions.push(Sub)
  }

  /**USE: save button click */
  formSubmitWithAttachment() {
    let API = 'SchemeRegistration/InsertWithAttachments'
    if (this.content && this.content.FLAG == 'EDIT') {
      this.editSchemeDetail(this.content)
      this.schemeRegistrationForm.controls.SCH_CUSTOMER_ID.setValue(this.content.SCH_CUSTOMER_ID)
      return
    }
    if (this.schemeRegistrationForm.invalid) {
      this.commonService.toastErrorByMsgId('select all required details!')
      return
    }

    if (this.SchemeMasterDetails.length == 0) {
      this.commonService.toastErrorByMsgId('Process Scheme Before saving')
      return
    }
    // this.schemeArray = this.newSchemeItems.filter((item: any) => item.ID > 0)
    this.setPostData(),
    console.log(this.detailArray,'this.detailArray');
    
    this.detailArray.forEach((item: any, i: any) => {
      // delete item.schemeData['ID'];

      this.formdata.append(`Model.model[${i}].schemeData.MID`,this.content ? this.content.MID : '0');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CUSTOMER_ID`,this.content ? this.content.SCH_CUSTOMER_ID : '0');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CUSTOMER_CODE`,this.schemeRegistrationForm.value.Code);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CUSTOMER_NAME`,this.schemeRegistrationForm.value.Name);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_SCHEME_CODE`,this.schemeRegistrationForm.value.SCHEME_CODE || '');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_METALCURRENCY`,'AMOUNT');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_JOIN_DATE`,this.commonService.formatDate(new Date(this.schemeRegistrationForm.value.DateOfJoining)));
      this.formdata.append(`Model.model[${i}].schemeData.SCH_SCHEME_PERIOD`,this.schemeRegistrationForm.value.TenurePeriod || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_FREQUENCY`,this.schemeRegistrationForm.value.Frequency);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_INST_AMOUNT_FC`,this.schemeRegistrationForm.value.InstallmentAmount);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_INST_AMOUNT_CC`,this.schemeRegistrationForm.value.InstallmentAmount);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ASSURED_AMT_FC`,this.schemeRegistrationForm.value.SumAssured || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ASSURED_AMT_CC`,this.schemeRegistrationForm.value.SumAssured || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_EXPIRE_DATE`,this.commonService.formatDate(new Date(this.schemeRegistrationForm.value.MaturingDate)));
      this.formdata.append(`Model.model[${i}].schemeData.SCH_REMINDER_DAYS`,this.schemeRegistrationForm.value.AlertBeforeDays || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_REMINDER_MODE`,this.schemeRegistrationForm.value.Frequency);
      this.formdata.append(`Model.model[${i}].schemeData.SCHEME_BONUS`,this.schemeRegistrationForm.value.BonusInstallment);
      this.formdata.append(`Model.model[${i}].schemeData.REMARKS`,'REMARKS');
      this.formdata.append(`Model.model[${i}].schemeData.SCH_UNITS`,this.schemeRegistrationForm.value.Units);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CANCEL_AMT`,this.schemeRegistrationForm.value.CancellationCharge);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_STATUS`,'1');
      this.formdata.append(`Model.model[${i}].schemeData.PAY_DATE`,this.commonService.formatDate(new Date(this.schemeRegistrationForm.value.DateOfJoining)));
      this.formdata.append(`Model.model[${i}].schemeData.PAY_BRANCH_CODE`,this.commonService.nullToString(this.commonService.branchCode));
      this.formdata.append(`Model.model[${i}].schemeData.PAY_VOCTYPE`,this.schemeRegistrationForm.value.VOCTYPE);
      this.formdata.append(`Model.model[${i}].schemeData.PAY_VOCNO`,'0');
      this.formdata.append(`Model.model[${i}].schemeData.PAY_YEARMONTH`,this.commonService.nullToString(this.commonService.yearSelected));
      this.formdata.append(`Model.model[${i}].schemeData.PAY_AMOUNTFC`,this.schemeRegistrationForm.value.InstallmentAmount || 0);
      this.formdata.append(`Model.model[${i}].schemeData.PAY_AMOUNTCC`,this.schemeRegistrationForm.value.InstallmentAmount || 0);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ALERT_EMAIL`,this.schemeRegistrationForm.value.Email);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_ALERT_MOBILE`,this.schemeRegistrationForm.value.MobileNo);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_SEND_ALERT`,this.schemeRegistrationForm.value.SendAlert);
      this.formdata.append(`Model.model[${i}].schemeData.PAN_NUMBER`,this.schemeRegistrationForm.value.PanNo);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_PAN_NUMBER`,this.schemeRegistrationForm.value.PanNo);
      this.formdata.append(`Model.model[${i}].schemeData.VOCDATE`,this.commonService.formatDate(this.schemeRegistrationForm.value.VOCDATE));
      this.formdata.append(`Model.model[${i}].schemeData.SCH_CANCEL`,this.schemeRegistrationForm.value.SCH_CANCEL);
      this.formdata.append(`Model.model[${i}].schemeData.SCH_REDEEM`,this.schemeRegistrationForm.value.SCH_REDEEM);
      this.formdata.append(`Model.model[${i}].schemeData.REDEEM_REFERENCE`,`''`);
      this.formdata.append(`Model.model[${i}].schemeData.SCHEME_BRANCH`,this.commonService.branchCode);
      this.SchemeMasterDetails.forEach((item: any, index: any) => {
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].UNIQUEID`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCH_CUSTOMER_CODE`,this.schemeRegistrationForm.value.Code);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCH_CUSTOMER_ID`,'');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SRNO`,item.SRNO || '0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_DATE`,this.commonService.formatDate(new Date(item.PAY_DATE)));
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_AMOUNT_FC`,item.PAY_AMOUNT_FC || 0);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_AMOUNT_CC`,item.PAY_AMOUNT_CC || 0);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].PAY_STATUS`,this.schemeRegistrationForm.value.REMAINDER_SEND);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].REMAINDER_DATE`,this.commonService.formatDate(new Date(item.REMAINDER_DATE)));
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].REMAINDER_SEND`,this.schemeRegistrationForm.value.REMAINDER_SEND);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].DT_BRANCH_CODE`,this.commonService.branchCode);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_DATE`,this.commonService.formatDate(new Date(item.RCVD_DATE)));
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_BRANCH_CODE`,item.RCVD_BRANCH_CODE);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_VOCTYPE`,'SRC');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_VOCNO`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_YEARMONTH`,this.commonService.yearSelected);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_AMOUNTFC`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RCVD_AMOUNTCC`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCHBAL_AMOUNTFC`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCHBAL_AMOUNTCC`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].SCH_PARTIALLY_PAID`,this.schemeRegistrationForm.value.SCH_PARTIALLY_PAID);
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RECEIPT_REF`,'0');
        this.formdata.append(`Model.model[0].schemeData.Details[${index}].RECEIPT_MID`,'0');
      })
      if (this.Attachedfile.length > 0) {
        this.formdata.append(`Model.model[0].imageData.VOCNO`,this.schemeRegistrationForm.value.UNIQUEID);
        this.formdata.append(`Model.model[0].imageData.UNIQUEID`,'');
        this.formdata.append(`Model.model[0].imageData.SRNO`,this.schemeRegistrationForm.value.UNIQUEID);
        this.formdata.append(`Model.model[0].imageData.VOCDATE`,this.commonService.formatDate(new Date(this.schemeRegistrationForm.value.VOCDATE)));
        this.formdata.append(`Model.model[0].imageData.REMARKS`,'REMARKS');
        this.formdata.append(`Model.model[0].imageData.CODE`,this.schemeRegistrationForm.value.Code);
        this.formdata.append(`Model.model[0].imageData.EXPIRE_DATE`,'');
        this.formdata.append(`Model.model[0].imageData.DOC_ACTIVESTATUS`,'');
        this.formdata.append(`Model.model[0].imageData.DOC_LASTRENEWBY`,'');
        this.formdata.append(`Model.model[0].imageData.DOC_LASTRENEWDATE`,'');
        this.formdata.append(`Model.model[0].imageData.DOC_NEXTRENEWDATE`,'');
        this.formdata.append(`Model.model[0].imageData.DOCUMENT_DATE`,this.commonService.formatDate(new Date(this.schemeRegistrationForm.value.VOCDATE)));
        this.formdata.append(`Model.model[0].imageData.DOCUMENT_NO`,'');
        this.formdata.append(`Model.model[0].imageData.FROM_KYC`,'');
        for (let i: number = 0; i < this.Attachedfile.length; i++) {
          this.formdata.append("Model.Images[" + i + "].Image.File", this.Attachedfile[i]);
        }
      }
    })
    //save API
    this.isLoading = true;
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI(API, this.formdata)
      .subscribe((result: any) => {
        this.isLoading = false;
        this.commonService.closeSnackBarMsg();
        if (result.status == "Success") {
          this.detailArray = []
          this.formdata = new FormData();
          Swal.fire({
            title: result.status,
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.close('reloadMainGrid')
          })
        } else {
          this.detailArray = []
          this.commonService.toastErrorByMsgId('Scheme Not Saved, try again')
        }
      }, err => {
        this.detailArray = []
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531')
        this.isLoading = false;
      })
    this.subscriptions.push(Sub)
  }
  editSchemeDetail(data: any) {
    let API = 'SchemeRegistration/UpdateSchemeRegistration/' + data.SCH_CUSTOMER_ID
    let params
    let Sub: Subscription = this.dataService.putDynamicAPI(API, params)
      .subscribe((result) => {
        if (result.status == "Success") {
          Swal.fire({
            title: result.status || 'updated',
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.close('reloadMainGrid')
            }
          })
        } else {
          this.commonService.toastErrorByMsgId(result.message || 'No updated')
        }
      }, err => alert(err))

    this.subscriptions.push(Sub)
  }

  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
  }
  editMainGridDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
  }
  //USE delete row
  deleteRow(e: any) {
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
        let str = e.row.data;
        if (str.SCHEME_UNIQUEID == '') {
          let data = this.newSchemeItems.filter((item: any) => item.ID != str.ID)
          this.newSchemeItems = data
        } else {
          this.deleteSchemeWithUniqueId(str.SCHEME_UNIQUEID)
        }
      }
    })
  }
  deleteSchemeWithUniqueId(SCHEME_UNIQUEID: string) {
    let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${SCHEME_UNIQUEID}`
    let Sub: Subscription = this.dataService.deleteDynamicAPI(API).subscribe((result) => {
      if (result.status == "Success") {
        this.close()
        Swal.fire({
          title: result.message || 'Scheme Deleted!',
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.close('reloadMainGrid')
          }
        })
      } else {
        this.commonService.toastErrorByMsgId(result.message || 'Scheme Not Deleted!')
      }
    }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  setPostData() {
    let params = {
      "MID": this.content ? this.content.MID : 0,
      "SCH_CUSTOMER_ID": this.content ? this.content.SCH_CUSTOMER_ID : "",
      "SCH_CUSTOMER_CODE": this.schemeRegistrationForm.value.Code,
      "SCH_CUSTOMER_NAME": this.schemeRegistrationForm.value.Name,
      "SCH_SCHEME_CODE": this.schemeRegistrationForm.value.SchemeId,
      "SCH_METALCURRENCY": "",
      "SCH_JOIN_DATE": this.commonService.formatDateTime(new Date(this.schemeRegistrationForm.value.DateOfJoining)),
      "SCH_SCHEME_PERIOD": this.commonService.emptyToZero(this.schemeRegistrationForm.value.TenurePeriod),
      "SCH_FREQUENCY": this.schemeRegistrationForm.value.Frequency,
      "SCH_INST_AMOUNT_FC": this.commonService.CCToFC(
        this.commonService.compCurrency,
        this.commonService.emptyToZero(this.schemeRegistrationForm.value.InstallmentAmount)
      ) || 0,
      "SCH_INST_AMOUNT_CC": this.commonService.emptyToZero(this.schemeRegistrationForm.value.InstallmentAmount),
      "SCH_ASSURED_AMT_FC": this.commonService.CCToFC(
        this.commonService.compCurrency,
        this.commonService.emptyToZero(this.schemeRegistrationForm.value.SumAssured)
      ) || 0,
      "SCH_ASSURED_AMT_CC": this.schemeRegistrationForm.value.SumAssured || 0,
      "SCH_EXPIRE_DATE": this.commonService.formatDateTime(new Date(this.schemeRegistrationForm.value.MaturingDate)),
      "SCH_REMINDER_DAYS": this.commonService.emptyToZero(this.schemeRegistrationForm.value.AlertBeforeDays),
      "SCH_REMINDER_MODE": this.schemeRegistrationForm.value.Frequency,
      "SCHEME_BONUS": this.commonService.emptyToZero(this.schemeRegistrationForm.value.BonusInstallment),
      "REMARKS": this.schemeRegistrationForm.value.Remarks,
      "SCH_UNITS": this.commonService.emptyToZero(this.schemeRegistrationForm.value.Units),
      "SCH_CANCEL_AMT": this.commonService.emptyToZero(this.schemeRegistrationForm.value.CancellationCharge),
      "SCH_STATUS": this.schemeRegistrationForm.value.SCH_STATUS,
      "PAY_DATE": this.commonService.formatDateTime(new Date(this.schemeRegistrationForm.value.DateOfJoining)),
      "PAY_BRANCH_CODE": this.schemeRegistrationForm.value.Branch,
      "PAY_VOCTYPE": this.schemeRegistrationForm.value.VOCTYPE,
      "PAY_VOCNO": 0,
      "PAY_YEARMONTH": this.commonService.yearSelected,
      "PAY_AMOUNTFC": 0,
      "PAY_AMOUNTCC": 0,
      "SCH_ALERT_EMAIL": this.schemeRegistrationForm.value.Email,
      "SCH_ALERT_MOBILE": this.schemeRegistrationForm.value.MobileNo,
      "SCH_SEND_ALERT": this.schemeRegistrationForm.value.SendAlert,
      "PAN_NUMBER": this.schemeRegistrationForm.value.PanNo,
      "SCH_PAN_NUMBER": this.schemeRegistrationForm.value.PanNo,
      "VOCDATE": this.schemeRegistrationForm.value.VOCDATE,
      "SCH_CANCEL": true,
      "SCH_REDEEM": true,
      "REDEEM_REFERENCE": "",
      "SCHEME_BRANCH": this.schemeRegistrationForm.value.Branch,
      "Details": this.SchemeMasterDetails || []
    }
    this.detailArray = []
    this.detailArray.push(params)
  }
  formatDateMaturingDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.schemeRegistrationForm.controls.DateOfJoining.setValue(new Date(date))
    }
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.schemeRegistrationForm.controls.DateOfJoining.setValue(new Date(date))
      let maturingdate = this.commonService.addDaysToDate(this.schemeRegistrationForm.value.DateOfJoining, this.schemeRegistrationForm.value.TenurePeriod)
      this.schemeRegistrationForm.controls.MaturingDate.setValue(maturingdate)
    }
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    this.snackBar.dismiss()
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
}
