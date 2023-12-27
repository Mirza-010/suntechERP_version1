import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-process-master',
  templateUrl: './process-master.component.html',
  styleUrls: ['./process-master.component.scss']
})
export class ProcessMasterComponent implements OnInit {
  @Input() content!: any;

  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  processTypeList: any[] = [];

  accountMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Worker A/c Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  approvalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 97,
    SEARCH_FIELD: 'APPR_CODE',
    SEARCH_HEADING: 'Approval Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "APPR_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  approvalProcessData: MasterSearchModel = {
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

  StockProcessData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Recov Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  accountStartData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  accountMiddleData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  accountEndData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'ACCOUNT CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  

  processMasterForm: FormGroup = this.formBuilder.group({
    mid: [''],
    processCode: [''],
    processDesc: [''],
    processType: [null],
    stand_time: [''],
    WIPaccount: [''],
    max_time: [''],
    Position: [''],
    trayWeight: [''],
    approvalCode: [''],
    approvalProcess: [''],
    recStockCode: [''],
    labour_charge: [''],
    accountStart: [''],
    accountMiddle: [''],
    accountEnd: [''],
    loss: [false],
    recovery: [false],
    AllowGain: [false],
    standard_start: [''],
    standard_end: [''],
    min_start: [''],
    min_end: [''],
    max: [''],
    accode_start: [''],
    accode_end: [''],
    accode_middle : [''],
    loss_on_gross: [false],
    FinalProcess: [false],
    Setting: [false],
    LabProcess: [false],
    WaxProcess: [false],
    Stone: [false],
    MergePices: [false],
    LockWeight: [false],
    HaveTreeNo: [false],
    NonQuantity: [false],
    Consumable: [false],
    RefineryAutoProcess: [false],
    ApplyAutoLossToRefinery: [false],
    RepairProcess: [false],
    Metal: [false],
    ApprovalRequired: [false],
    DeductPureWeight: [false],
    StoneIncluded: [false],
    TimeCalculateonProcess: [false],
    RecoveryProcess: [false],
    AutoTransfer: [false],
    ApplySetting: [false],
    loss_standard: [''],
    loss_min: [''],
    loss_max: [''],
 
    
    

  })
  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    if (this.content) {
      this.setFormValues()
    }
    this.getProcessTypeOptions()
  }
  // USE: get select options Process TypeMaster
  private getProcessTypeOptions():void {
    let API = 'ComboFilter/PROCESS TYPE MASTER';
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if(result.response){
        this.processTypeList = result.response;
        this.processTypeList.sort((a:any,b:any)=> a.SRNO - b.SRNO)
      }
    });
    this.subscriptions.push(Sub)
  }

  private setFormValues() {
    if (!this.content) return
    this.processMasterForm.controls.processCode.setValue(this.content.PROCESS_CODE);
    this.processMasterForm.controls.processDesc.setValue(this.content.DESCRIPTION);
    this.processMasterForm.controls.RepairProcess.setValue(this.content.REPAIR_PROCESS);
    this.processMasterForm.controls.FinalProcess.setValue(this.content.FINAL_PROCESS);
    this.processMasterForm.controls.Setting.setValue(this.content.SETTING_PROCESS);
    this.processMasterForm.controls.LockWeight.setValue(this.content.LOCK_WEIGHT);
    this.processMasterForm.controls.LabProcess.setValue(this.content.LAB_PROCESS);
    this.processMasterForm.controls.WaxProcess.setValue(this.content.WAX_PROCESS);
    this.processMasterForm.controls.DeductPureWeight.setValue(this.content.DEDUCT_PURE_WT);
    this.processMasterForm.controls.approvalCode.setValue(this.content.APPR_CODE);
    this.processMasterForm.controls.ApplySetting.setValue(this.content.APPLY_SETTING);
    this.processMasterForm.controls.TimeCalculateonProcess.setValue(this.content.TIMEON_PROCESS);
    this.processMasterForm.controls.StoneIncluded.setValue(this.content.STONE_INCLUDED);
    this.processMasterForm.controls.RecoveryProcess.setValue(this.content.RECOVERY_PROCESS);
    this.processMasterForm.controls.Metal.setValue(this.content.ALLOW_METAL);
    this.processMasterForm.controls.Stone.setValue(this.content.ALLOW_STONE);
    this.processMasterForm.controls.Consumable.setValue(this.content.ALLOW_CONSUMABLE);
    this.processMasterForm.controls.ApprovalRequired.setValue(this.content.APPROVAL_REQUIRED);
    this.processMasterForm.controls.NonQuantity.setValue(this.content.NON_QUANTITY);
    this.processMasterForm.controls.RefineryAutoProcess.setValue(this.content.DF_REFINERY);
    this.processMasterForm.controls.ApplyAutoLossToRefinery.setValue(this.content.AUTO_LOSS);
    this.processMasterForm.controls.HaveTreeNo.setValue(this.content.TREE_NO);
    this.processMasterForm.controls.stand_time.setValue(this.content.STD_TIME);
    this.processMasterForm.controls.max_time.setValue(this.content.MAX_TIME);
    this.processMasterForm.controls.WIPaccount.setValue(this.content.WIP_ACCODE);
    this.processMasterForm.controls.processType.setValue(this.content.PROCESS_TYPE);
    this.processMasterForm.controls.Position.setValue(this.content.POSITION);
    this.processMasterForm.controls.recStockCode.setValue(this.content.RECOV_STOCK_CODE);
    this.processMasterForm.controls.approvalProcess.setValue(this.content.APPR_PROCESS);
    this.processMasterForm.controls.loss_standard.setValue(this.content.STD_LOSS);
    this.processMasterForm.controls.loss_min.setValue(this.content.MIN_LOSS);
    this.processMasterForm.controls.loss_max.setValue(this.content.MAX_LOSS);
    this.processMasterForm.controls.loss_on_gross.setValue(this.content.LOSS_ON_GROSS);
 
  }
  // final save
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateProcessMaster()
      return
    }

    if (this.processMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ProcessMasterDj/InsertProcessMasterDJ'
    let postData = {
      "MID": 0,
      "PROCESS_CODE": this.processMasterForm.value.processCode || "0123",
      "DESCRIPTION": this.processMasterForm.value.processDesc || "",
      "STD_TIME": this.processMasterForm.value.stand_time || "",
      "MAX_TIME":this.processMasterForm.value.max_time || "",
      "LOSS_ACCODE": "",
      "WIP_ACCODE": this.processMasterForm.value.WIPaccount || "",
      "CURRENCY_CODE": "",
      "PROCESS_TYPE": this.processMasterForm.value.processType || "",
      "UNIT": "",
      "NO_OF_UNITS": 0,
      "UNIT_RATE": 0,
      "LAB_ACCODE": "",
      "LAST_NO": "",
      "REPAIR_PROCESS": this.processMasterForm.value.RepairProcess ? 1 : 0,
      "FINAL_PROCESS": this.processMasterForm.value.FinalProcess ? 1 : 0,
      "GAIN_ACCODE": "",
      "TRAY_WT": this.processMasterForm.value.trayWeight || "",
      "SETTING_PROCESS": this.processMasterForm.value.Setting ? 1 : 0,
      "POINTS": 0,
      "LOCK_WEIGHT": this.processMasterForm.value.LockWeight ? 1 : 0,
      "AUTOTRANSFER": 0,
      "MASTER_WEIGHT": 0,
      "MERGE_BLOCK": 0,
      "LAB_PROCESS": this.processMasterForm.value.LabProcess ? 1 : 0,
      "WAX_PROCESS": this.processMasterForm.value.WaxProcess ? 1 : 0,
      "STD_LOSS_QTY": 0,
      "POSITION": this.processMasterForm.value.Position || "",
      "RECOV_MIN": 0,
      "RECOV_ACCODE": "",
      "RECOV_STOCK_CODE": this.processMasterForm.value.recStockCode || "",
      "RECOV_VAR1": 0,
      "RECOV_VAR2": 0,
      "DEDUCT_PURE_WT": this.processMasterForm.value.DeductPureWeight ? 1 : 0,
      "APPR_PROCESS": this.processMasterForm.value.approvalProcess || "",
      "APPR_CODE": this.processMasterForm.value.approvalCode || "",
      "ALLOW_GAIN": true,
      "STD_GAIN": 0,
      "MIN_GAIN": 0,
      "MAX_GAIN": 0,
      "ALLOW_LOSS": true,
      "STD_LOSS": this.processMasterForm.value. loss_standard || "",
      "MIN_LOSS": this.processMasterForm.value.loss_min || "",
      "MAX_LOSS": this.processMasterForm.value.loss_max || "",
      "LOSS_ON_GROSS": this.processMasterForm.value.loss_on_gross || "",
      "JOB_NUMBER": "",
      "LABCHRG_PERHOUR": 0,
      "APPLY_SETTING": this.processMasterForm.value.ApplySetting || true,
      "TIMEON_PROCESS": this.processMasterForm.value.TimeCalculateonProcess || true,
      "STONE_INCLUDED":  this.processMasterForm.value.StoneIncluded || true,
      "RECOVERY_PROCESS": this.processMasterForm.value.RecoveryProcess  || true,
      "ALLOW_METAL": this.processMasterForm.value.Metal || true,
      "ALLOW_STONE": this.processMasterForm.value.Stone || true ,
      "ALLOW_CONSUMABLE": this.processMasterForm.value.Consumable || true,
      "APPROVAL_REQUIRED": this.processMasterForm.value.ApprovalRequired || true,
      "NON_QUANTITY": this.processMasterForm.value.NonQuantity  || true,
      "DF_REFINERY": this.processMasterForm.value.RefineryAutoProcess || true,
      "AUTO_LOSS": this.processMasterForm.value.ApplyAutoLossToRefinery || true,
      "ISACCUPDT": true,
      "TREE_NO": this.processMasterForm.value.HaveTreeNo || true,
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
                this.processMasterForm.reset()
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
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ApprovalCodeSelected(e: any) {
    console.log(e);
    this.processMasterForm.controls.approvalCode.setValue(e.APPR_CODE);
  }
  ApprovalProcessSelected(e: any) {
    console.log(e);
    this.processMasterForm.controls.approvalProcess.setValue(e.Process_Code);
  }
  ACCODESelected(e: any) {
    console.log(e);
    this.processMasterForm.controls.WIP_ACCOUNT.setValue(e.ACCODE);
  }

  StockProcesSelected(e: any){
    console.log(e);
    this.processMasterForm.controls.recStockCode.setValue(e.STOCK_CODE);
  }
  accountStartSelected(e: any){
    console.log(e);
    this.processMasterForm.controls.accountStart.setValue(e.ACCODE);
  }
  accountMiddleSelected(e: any){
    console.log(e);
    this.processMasterForm.controls.accountMiddle.setValue(e.ACCODE);
  }
  accountEndSelected(e: any){
    console.log(e);
    this.processMasterForm.controls.accountEnd.setValue(e.ACCODE);
  }

  updateProcessMaster() {
    console.log(this.processMasterForm.value);
    if ( this.processMasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'ProcessMasterDj/UpdateProcessMasterDJ/' + this.content.MID
    let postData = {
      "MID": 0,
      "PROCESS_CODE": this.processMasterForm.value.processCode || "0123",
      "DESCRIPTION": this.processMasterForm.value.processCode || "0123",
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "LOSS_ACCODE": "",
      "WIP_ACCODE": "",
      "CURRENCY_CODE": "",
      "PROCESS_TYPE": "",
      "UNIT": "",
      "NO_OF_UNITS": 0,
      "UNIT_RATE": 0,
      "LAB_ACCODE": "",
      "LAST_NO": "",
      "REPAIR_PROCESS": this.processMasterForm.value.RepairProcess ? 1 : 0,
      "FINAL_PROCESS": this.processMasterForm.value.FinalProcess ? 1 : 0,
      "GAIN_ACCODE": "",
      "TRAY_WT": 0,
      "SETTING_PROCESS": this.processMasterForm.value.Setting ? 1 : 0,
      "POINTS": 0,
      "LOCK_WEIGHT": this.processMasterForm.value.LockWeight ? 1 : 0,
      "AUTOTRANSFER": 0,
      "MASTER_WEIGHT": 0,
      "MERGE_BLOCK": 0,
      "LAB_PROCESS": this.processMasterForm.value.LabProcess ? 1 : 0,
      "WAX_PROCESS": this.processMasterForm.value.WaxProcess ? 1 : 0,
      "STD_LOSS_QTY": 0,
      "POSITION": 0,
      "RECOV_MIN": 0,
      "RECOV_ACCODE": "",
      "RECOV_STOCK_CODE": "",
      "RECOV_VAR1": 0,
      "RECOV_VAR2": 0,
      "DEDUCT_PURE_WT": this.processMasterForm.value.DeductPureWeight ? 1 : 0,
      "APPR_PROCESS": "",
      "APPR_CODE": this.processMasterForm.value.approvalCode || "",
      "ALLOW_GAIN": true,
      "STD_GAIN": 0,
      "MIN_GAIN": 0,
      "MAX_GAIN": 0,
      "ALLOW_LOSS": true,
      "STD_LOSS": 0,
      "MIN_LOSS": 0,
      "MAX_LOSS": 0,
      "LOSS_ON_GROSS": true,
      "JOB_NUMBER": "",
      "LABCHRG_PERHOUR": 0,
      "APPLY_SETTING": this.processMasterForm.value.ApplySetting || true,
      "TIMEON_PROCESS": this.processMasterForm.value.TimeCalculateonProcess || true,
      "STONE_INCLUDED":  this.processMasterForm.value.StoneIncluded || true,
      "RECOVERY_PROCESS": this.processMasterForm.value.RecoveryProcess  || true,
      "ALLOW_METAL": this.processMasterForm.value.Metal || true,
      "ALLOW_STONE": this.processMasterForm.value.Stone || true ,
      "ALLOW_CONSUMABLE": this.processMasterForm.value.Consumable || true,
      "APPROVAL_REQUIRED": this.processMasterForm.value.ApprovalRequired || true,
      "NON_QUANTITY": this.processMasterForm.value.NonQuantity  || true,
      "DF_REFINERY": this.processMasterForm.value.RefineryAutoProcess || true,
      "AUTO_LOSS": this.processMasterForm.value.ApplyAutoLossToRefinery || true,
      "ISACCUPDT": true,
      "TREE_NO": this.processMasterForm.value.HaveTreeNo || true,
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
                this.processMasterForm.reset()
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
  /**USE: delete worker master from row */
  deleteProcessMaster() {
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
        let API = 'ProcessMasterDj/DeleteProcessMasterDJ/' + this.content.PROCESS_CODE
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
                    this.processMasterForm.reset()
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
                    this.processMasterForm.reset()
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
