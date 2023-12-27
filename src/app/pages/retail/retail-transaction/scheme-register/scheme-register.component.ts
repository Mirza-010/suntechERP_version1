import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AddSchemeComponent } from './add-scheme/add-scheme.component';

@Component({
  selector: 'app-scheme-register',
  templateUrl: './scheme-register.component.html',
  styleUrls: ['./scheme-register.component.scss']
})
export class SchemeRegisterComponent implements OnInit {
  @ViewChild('add_scheme') add_scheme: any;
  @ViewChild('pos_customer_search') pos_customer_search: any;

  formdata = new FormData();   
  isLoading: boolean = false
  viewOnly: boolean = false;
  isViewSchemeMasterGrid: boolean = true;

  selectedFieldValue: string = '';

  schemeReceiptList: any[] = [];
  schemeReceiptListHead: any[] = [];
  newSchemeItems: any[] = [];
  IdTypesList: any[] = [];
  schemeArray: any[] = []
  dataToEditrow: any[] = [];
  detailArray: any[] = []
  indexNumberStart:number = 0
  newSchemeLength:number = 0
  currentDate: any = new Date()
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
  
  schemeRegistrationForm: FormGroup = this.formBuilder.group({
    SchemeId: [''],
    Code: ['', Validators.required],
    Name: ['', Validators.required],
    MobileNo: ['', Validators.required],
    Email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
    GovIdType: [''],
    GovIdNumber: [''],
    VOCTYPE: [''],
    VOCDATE: [''],
    SCH_REMINDER_MODE: [0],
    SCH_PARTIALLY_PAID:[false],
    PAY_STATUS:[true],
    REMAINDER_SEND:[true],
    SCH_SEND_ALERT:[true],
    SCH_CANCEL:[false],
    SCH_REDEEM:[false],
    SCH_STATUS:[0],
    SCH_REMINDER_DAYS:[0],
    UNIQUEID:[0],
  });
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.editMainGridDetails = this.editMainGridDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
    this.deleteRow = this.deleteRow.bind(this);

  }
  ngOnInit(): void {
    this.schemeRegistrationForm.controls.VOCDATE.setValue(this.currentDate)
    this.schemeRegistrationForm.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
  }
  ngAfterViewInit(): void {
    this.getIDtypes() //ID master list
  }
  customizeDate(data: any) {
    if (!data.value) return
    return data.value.slice(0, 10)
  }
  openAttchments(e: any){
    const columnName = e.column?.dataField;
    const cellValue = e.data[columnName];
    
    // Handle the cell click event based on the column and value
    if (columnName === 'IS_ATTACHMENT_PRESENT' ) {
      let SCHEME_UNIQUEID = e.row.data.SCHEME_UNIQUEID;
      let API = `Scheme/GetSchemeAttachments?SCHEME_UNIQUEID=${SCHEME_UNIQUEID}`
      this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        if (result.fileCount > 0) {

          for (let j = 0; j < result.file.length; j++) {
            window.open(
              result.file[j],
              '_blank' // <- This is what makes it open in a new window.
            );
          }
        }else{
          this.toastr.error(result.message, '', {
            timeOut: 1000
          });
        }
      })
    }
  }
  addScheme() {
    this.isViewSchemeMasterGrid = false
  }
  fetchSchemeWithCustCode(SCHEME_CUSTCODE: string) {
    // let API = `Scheme/SchemeMaster?SCHEME_CUSTCODE=${SCHEME_CUSTCODE}`
    let API = `SchemeMaster/GetSchemeMasterDetails/${this.commonService.branchCode}/${SCHEME_CUSTCODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        
        if (result.response && result.response.length > 0) {
          this.newSchemeItems = result.response
          this.newSchemeItems.length
        }else{
          this.newSchemeItems = []
        }
      })
    this.subscriptions.push(Sub)
  }
  exportToExcel(){
    this.commonService.exportExcel(this.schemeReceiptList,'Scheme Details')
  }
  
  /**schemeID change function */
  schemeIDChange(event: any) {
    if (event.target.value == '') return
    // let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${event.target.value}`
    let API = `SchemeMaster/GetSchemeMasterDetails/${this.commonService.branchCode}/${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        let sataus = result.status.trim().toLowerCase()
        if (sataus == 'success') {
          if (result.response['SCHEME_CUSTCODE']) {
            let event = { target: { value: result.response['SCHEME_CUSTCODE'] } }
            this.searchValueChange(event, 'CODE',true)
          }
          this.newSchemeItems = []
          this.newSchemeItems.push(result.response)
        
        } else {
          Swal.fire({
            title: 'Scheme Id Not Found',
            text: "",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        }
      });
    this.subscriptions.push(Sub)
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
  searchValueChange(event: any, searchFlag: string,schemeFlag?: boolean) {
    if (event.target.value == '') return
    // let API = `Scheme/CustomerMaster?${searchFlag}=${event.target.value}`
    let API = `PosCustomerMaster/GetCustomerByCode/${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.selectedCustomer(result.response,schemeFlag)
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

 

  deleteTableData(){

  }
  saveClick(){
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
  selectedCustomer(data: any,schemeFlag?:boolean) {
    this.schemeRegistrationForm.controls.Code.setValue(data.CODE)
    this.schemeRegistrationForm.controls.MobileNo.setValue(data.MOBILE)
    this.schemeRegistrationForm.controls.Name.setValue(data.NAME)
    this.schemeRegistrationForm.controls.Email.setValue(data.EMAIL)
    this.schemeRegistrationForm.controls.GovIdType.setValue(data.Idcategory)
    this.schemeRegistrationForm.controls.GovIdNumber.setValue(data.POSCustIDNo)
    if(data.CODE && !schemeFlag) this.fetchSchemeWithCustCode(data.CODE)
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
    this.indexNumberStart = 0
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

  openMainGridMadalView(data?: any) {
    if(data){
      this.dataToEditrow = []
      this.dataToEditrow.push(data)
    }else{
      this.dataToEditrow = []
    }
    this.modalService.open(this.add_scheme, {
      size: 'lg',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width'
    });
  }
  /**use: open new scheme details */
  openNewSchemeDetails(data?: any) {
    if(data){
      this.dataToEditrow = []
      this.dataToEditrow.push(data)
    }else{
      this.dataToEditrow = []
    }
    if (this.schemeRegistrationForm.invalid) {
      this.toastr.error('', 'select all details!', {
        timeOut: 1000
      });
      return
    }
    const modalRef: NgbModalRef = this.modalService.open(AddSchemeComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;
    modalRef.result.then((result) => {
      if (result) {
        this.addNewRow(result) //USE: set Values To Detail table
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
  }
  
  closeModal() {
    // this.activeModal.close();
    this.modalService.dismissAll()
  }
  // new rows added 
 
  addNewRow(data: any) {
    let params =  {
      "ID": this.indexNumberStart += 1,
      "SCHEME_UNIQUEID": '',
      "SCHEME_ID": this.commonService.nullToString(data.SchemeID),
      "SCHEME_UNITS": this.commonService.emptyToZero(data.Units),
      "SCHEME_TOTAL_VALUE": this.commonService.emptyToZero(data.TotalValue),
      "SCHEME_STARTED": this.commonService.nullToString(this.commonService.formatDateTime(data.StartDate)),
      "SCHEME_ENDEDON": this.commonService.nullToString(this.commonService.formatDateTime(data.endDate)),
      "SCHEME_STATUS": this.commonService.nullToString(data.Status),
      "SCHEME_UNITVALUE": this.commonService.emptyToZero(data.SchemeAmount),
      "SCHEME_CUSTCODE": this.commonService.nullToString(this.schemeRegistrationForm.value.Code),
      "sbranch_code": data.Branch || new Date(1/1/1753).toISOString(),
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
    this.newSchemeItems.push(params)
    
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
    // this.closeModal()
  }
   /**USE: save button click */
   formSubmit() {
    if (this.schemeRegistrationForm.invalid) {
      this.toastr.error('select all details!', 'Error', {
        timeOut: 1000
      });
      return
    }
    
    if (this.indexNumberStart == 0) {
      Swal.fire({
        title: 'Add New Schemes!',
        text: "",
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        // if (result.isConfirmed) {
        // }
      })
      return
    }
    this.schemeArray = this.newSchemeItems.filter((item:any) => item.ID>0 )
    console.log(this.detailArray,'this.detailArray');
    
    this.detailArray.forEach((item:any,index:any)=>{
      delete item.schemeData['ID'];
      this.formdata.append(`Model.model[${index}].schemeData.MID`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.SCH_CUSTOMER_ID`, item.schemeData.SCHEME_ID);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_CUSTOMER_CODE`, item.schemeData.SCHEME_CUSTCODE);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_CUSTOMER_NAME`, this.schemeRegistrationForm.value.Name);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_SCHEME_CODE`, item.schemeData.SCHEME_ID);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_METALCURRENCY`, 'AMOUNT');
      this.formdata.append(`Model.model[${index}].schemeData.SCH_JOIN_DATE`, this.commonService.formatDate(new Date(item.schemeData.SCHEME_STARTED)));
      this.formdata.append(`Model.model[${index}].schemeData.SCH_SCHEME_PERIOD`, (item.schemeData.SchemePeriod)|| 0);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_FREQUENCY`, item.schemeData.SCHEME_CUSTCODE);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_INST_AMOUNT_FC`, item.schemeData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_INST_AMOUNT_CC`, item.schemeData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_ASSURED_AMT_FC`, item.schemeData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_ASSURED_AMT_CC`, item.schemeData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_EXPIRE_DATE`, this.commonService.formatDate(new Date(item.schemeData.SCHEME_ENDEDON)));
      this.formdata.append(`Model.model[${index}].schemeData.SCH_REMINDER_DAYS`, this.schemeRegistrationForm.value.SCH_REMINDER_DAYS);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_REMINDER_MODE`, this.schemeRegistrationForm.value.SCH_REMINDER_MODE);
      this.formdata.append(`Model.model[${index}].schemeData.SCHEME_BONUS`, this.schemeRegistrationForm.value.UNIQUEID);
      this.formdata.append(`Model.model[${index}].schemeData.REMARKS`, this.commonService.formatDate(new Date(item.schemeData.BANK_EMISTARTDATE)));
      this.formdata.append(`Model.model[${index}].schemeData.SCH_UNITS`, item.schemeData.SCHEME_UNITS);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_CANCEL_AMT`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.SCH_STATUS`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.PAY_DATE`, this.commonService.formatDate(this.schemeRegistrationForm.value.VOCDATE));
      this.formdata.append(`Model.model[${index}].schemeData.PAY_BRANCH_CODE`, this.commonService.nullToString(this.commonService.branchCode));
      this.formdata.append(`Model.model[${index}].schemeData.PAY_VOCTYPE`, this.schemeRegistrationForm.value.VOCTYPE);
      this.formdata.append(`Model.model[${index}].schemeData.PAY_VOCNO`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.PAY_YEARMONTH`, this.commonService.nullToString(this.commonService.yearSelected));
      this.formdata.append(`Model.model[${index}].schemeData.PAY_AMOUNTFC`, (item.schemeData.SCHEME_UNITS));
      this.formdata.append(`Model.model[${index}].schemeData.PAY_AMOUNTCC`, item.schemeData.SCHEME_UNITS);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_ALERT_EMAIL`, this.schemeRegistrationForm.value.Email);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_ALERT_MOBILE`, this.schemeRegistrationForm.value.MobileNo);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_SEND_ALERT`, this.schemeRegistrationForm.value.SCH_SEND_ALERT);
      this.formdata.append(`Model.model[${index}].schemeData.PAN_NUMBER`, '');
      this.formdata.append(`Model.model[${index}].schemeData.SCH_PAN_NUMBER`, item.schemeData.SCHEME_UNITS);
      this.formdata.append(`Model.model[${index}].schemeData.VOCDATE`, this.commonService.formatDate(this.schemeRegistrationForm.value.VOCDATE));
      this.formdata.append(`Model.model[${index}].schemeData.SCH_CANCEL`, this.schemeRegistrationForm.value.SCH_CANCEL);
      this.formdata.append(`Model.model[${index}].schemeData.SCH_REDEEM`, this.schemeRegistrationForm.value.SCH_REDEEM);
      this.formdata.append(`Model.model[${index}].schemeData.REDEEM_REFERENCE`, `''`);
      this.formdata.append(`Model.model[${index}].schemeData.SCHEME_BRANCH`, this.commonService.branchCode);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].UNIQUEID`, this.schemeRegistrationForm.value.UNIQUEID);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].SCH_CUSTOMER_CODE`, item.schemeData.SCHEME_CUSTCODE);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].SCH_CUSTOMER_ID`, this.commonService.nullToString(item.schemeData.SCHEME_ID));
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].SRNO`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].PAY_DATE`, this.commonService.formatDate(new Date(item.schemeData.SCHEME_STARTED)));
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].PAY_AMOUNT_FC`, item.schemeData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].PAY_AMOUNT_CC`, item.schemeData.SCHEME_TOTAL_VALUE);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].PAY_STATUS`, this.schemeRegistrationForm.value.PAY_STATUS);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].REMAINDER_DATE`, this.commonService.formatDate(this.schemeRegistrationForm.value.VOCDATE));
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].REMAINDER_SEND`, this.schemeRegistrationForm.value.REMAINDER_SEND);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].DT_BRANCH_CODE`, this.commonService.branchCode);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_DATE`, this.commonService.formatDate(this.schemeRegistrationForm.value.VOCDATE));
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_BRANCH_CODE`, this.commonService.branchCode);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_VOCTYPE`, 'SRC');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_VOCNO`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_YEARMONTH`, this.commonService.yearSelected);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_AMOUNTFC`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RCVD_AMOUNTCC`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].SCHBAL_AMOUNTFC`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].SCHBAL_AMOUNTCC`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].SCH_PARTIALLY_PAID`, this.schemeRegistrationForm.value.SCH_PARTIALLY_PAID);
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RECEIPT_REF`, '0');
      this.formdata.append(`Model.model[${index}].schemeData.Details[0].RECEIPT_MID`, '0');
      // this.formdata.append(`Model[${index}].ImageData.BRANCH_CODE`, item.ImageData.BRANCH_CODE);
      // this.formdata.append(`Model[${index}].ImageData.VOCTYPE`, item.ImageData.VOCTYPE);
      // this.formdata.append(`Model[${index}].ImageData.VOCNO`, item.ImageData.VOCNO);
      for (let i:number = 0; i < item.Images.length; i++) {    
        this.formdata.append("Images["+i+"].Image.File", item.Images[i]);                
      }  
    })
    //save API
    this.isLoading = true;
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('SchemeRegistration/InsertWithAttachments', this.formdata)
      .subscribe((result: any) => {
        this.isLoading = false;
        this.commonService.closeSnackBarMsg();
        if (result.status == "Success") {
          this.detailArray = []
          this.indexNumberStart = 0
          this.formdata = new FormData();
          this.fetchSchemeWithCustCode(this.schemeRegistrationForm.value.Code)
          Swal.fire({
            title: result.status,
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            
          })
        } else {
          Swal.fire({
            title: result.message ? result.message : 'Scheme Not Saved, try again',
            text: "",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        }
      }, err => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531')
        this.isLoading = false;
      })
    this.subscriptions.push(Sub)
  }
  editSchemeDetail(data: any) {
    
    let API = 'SchemeMaster/GetSchemeMasterDetails/'+ this.commonService.branchCode + '' + data.SchemeUniqueNo
    let params = {
      "SCHEME_UNIQUEID": data.SchemeUniqueNo,
      "SCHEME_ID": data.SchemeID || '',
      "SCHEME_UNITS": data.Units || 0,
      "SCHEME_TOTAL_VALUE": data.TotalValue || 0,
      "SCHEME_STARTED": this.commonService.formatDate(data.StartDate) || '',
      "SCHEME_ENDEDON": this.commonService.formatDate(data.endDate) || '',
      "SCHEME_STATUS": data.Status || "",
      "SCHEME_UNITVALUE": 0,
      "SCHEME_CUSTCODE": data.SCHEME_CUSTCODE || "",
      "sbranch_code": data.Branch || '',
      "PCS_SYSTEM_DATE": new Date().toISOString(),
      "SalesManCode": data.Salesman || '',
      "AttachmentPath": '',
      "BANK_ACCOUNTNO": "",
      "BANK_IBANNO": "",
      "BANK_SWIFTID": "",
      "BANK_EMISTARTDATE": new Date().toISOString(),
      "BANK_EMIENDDATE": new Date().toISOString(),
      "ACTIVE": true,
      "SCHEME_REMARKS": '',
      "CUSTOMER_ACCOUNTNO": '',
      "BANK_DATE": new Date().toISOString(),
      "SCHEME_BLOCK": data.BlockScheme ? 1 : 0,
      "SCHEME_ControlRedeemDate": new Date().toISOString()
    }
    let Sub: Subscription = this.dataService.putDynamicAPI(API, params)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.closeModal()
          this.fetchSchemeWithCustCode(this.schemeRegistrationForm.value.Code)
          Swal.fire({
            title: result.status || 'updated',
            text: result.message || "",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            // if (result.isConfirmed) {
            // }
          })
        } else {
          Swal.fire({
            title: 'branch Not Found!',
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

  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openNewSchemeDetails(str)
  }
  editMainGridDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openNewSchemeDetails(str)
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
        if(str.SCHEME_UNIQUEID == ''){
          let data = this.newSchemeItems.filter((item: any) => item.ID != str.ID)
          this.newSchemeItems = data
        }else{
          this.deleteSchemeWithUniqueId(str.SCHEME_UNIQUEID)
        }
      }
    })
  }
  deleteSchemeWithUniqueId(SCHEME_UNIQUEID: string){
    let API = `Scheme/SchemeMaster?SCHEME_UNIQUEID=${SCHEME_UNIQUEID}`
    let Sub: Subscription = this.dataService.deleteDynamicAPI(API).subscribe((result) => {
      if (result.status == "Success") {
        this.fetchSchemeWithCustCode(this.schemeRegistrationForm.value.Code)
         Swal.fire({
          title: result.message || 'Scheme Deleted!',
          text: "",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          // if (result.isConfirmed) {
          // }
        })
      } else {
        this.reset()
        // this.changeCode(event,searchFlag)
        Swal.fire({
          title: result.message || 'Scheme Not Deleted!',
          text: "try again",
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
