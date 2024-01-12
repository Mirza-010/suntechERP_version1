import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterGridComponent } from 'src/app/shared/common/master-grid/master-grid.component';

import { DiamondSalesorderComponent } from './diamond-salesorder/diamond-salesorder.component';
import { DiamondQuotationComponent } from './diamond-quotation/diamond-quotation.component';
import { MetalIssueComponent } from './metal-issue/metal-issue.component';
import { WaxProcessComponent } from './wax-process/wax-process.component';
import { StoneIssueComponent } from './stone-issue/stone-issue.component';
import { CADProcessingComponent } from './cad-processing/cad-processing.component';
import { MetalReturnComponent } from './metal-return/metal-return.component';
import { StoneReturnComponent } from './stone-return/stone-return.component';
import { WaxProcessReturnComponent } from './wax-process-return/wax-process-return.component';
import { JobCreationComponent } from './job-creation/job-creation.component';
import { CastingTreeUpComponent } from './casting-tree-up/casting-tree-up.component';
import { MeltingIssueComponent } from './melting-issue/melting-issue.component';
import { ProcessTransferComponent } from './process-transfer/process-transfer.component';
import { JobClosingComponent } from './job-closing/job-closing.component';
import { JewelleryAltrationComponent } from './jewellery-altration/jewellery-altration.component';
import { MeltingProcessComponent } from './melting-process/melting-process.component';
import { ProductionMfgComponent } from './production-mfg/production-mfg.component';

import { JewelleryDismantlingComponent } from './jewellery-dismantling/jewellery-dismantling.component';
import { QuotationProcessComponent } from './quotation-process/quotation-process.component';
import { TreeDownComponent } from './tree-down/tree-down.component';
import { MouldMakingComponent } from './mould-making/mould-making.component';
import { LossRecoveryComponent } from './loss-recovery/loss-recovery.component';
import { DiamondJobBoqIssueComponent } from './diamond-job-boq-issue/diamond-job-boq-issue.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  //variables
  menuTitle: any;
  componentName: any;
  PERMISSIONS: any;
  componentSelected: any;
  private componentDbList: any = {}

  constructor(
    private CommonService: CommonServiceService,
    private modalService: NgbModal,
    // private ChangeDetector: ChangeDetectorRef,
  ) {
    this.menuTitle = this.CommonService.getModuleName()
    this.componentName = this.CommonService.getFormComponentName()
  }

  ngOnInit(): void {
  }

  viewRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'VIEW'
    this.openModalView(str)
  }
  editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = 'EDIT'
    this.openModalView(str)
  }
  //  open forms in modal
  openModalView(data?: any) {
    this.componentDbList = {
      'DiamondSalesorderComponent': DiamondSalesorderComponent,
      'DiamondQuotationComponent': DiamondQuotationComponent,
      'MeltingProcessComponent': MeltingProcessComponent,
      'MetalIssueComponent': MetalIssueComponent,
      'WaxProcessComponent': WaxProcessComponent,
      'StoneIssueComponent': StoneIssueComponent,
      'CADProcessingComponent': CADProcessingComponent,
      'MetalReturnComponent': MetalReturnComponent,
      'StoneReturnComponent': StoneReturnComponent,
      'WaxProcessReturnComponent': WaxProcessReturnComponent,
      'JobCreationComponent': JobCreationComponent,
      'CastingTreeUpComponent': CastingTreeUpComponent,
      'MeltingIssueComponent': MeltingIssueComponent,
      'JewelleryAltrationComponent': JewelleryAltrationComponent,
      'JewelleryDismantlingComponent': JewelleryDismantlingComponent,
      'ProcessTransferComponent': ProcessTransferComponent,
      'JobClosingComponent': JobClosingComponent,
      'ProductionMfgComponent': ProductionMfgComponent,
      'QuotationProcessComponent': QuotationProcessComponent,
      'TreeDownComponent': TreeDownComponent,
      'MouldMakingComponent': MouldMakingComponent,
      'LossRecoveryComponent': LossRecoveryComponent,
      'DiamondJobBoqIssueComponent':DiamondJobBoqIssueComponent,
  
      // Add components and update in operationals > menu updation grid form component name
    }
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName]
    } else {
      this.CommonService.showSnackBarMsg('Module Not Created')
    }

    const modalRef: NgbModalRef = this.modalService.open(this.componentSelected, {
      size: 'xl',
      backdrop: 'static',//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((result) => {
      if (result === 'reloadMainGrid') {
        let details = { 
          HEADER_TABLE: this.CommonService.getqueryParamTable(),
          MENU_CAPTION_ENG: this.CommonService.getModuleName()
        }
        this.getMasterGridData(details)
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
    modalRef.componentInstance.content = data || {};
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      if(data.MENU_CAPTION_ENG){
        this.menuTitle = data.MENU_CAPTION_ENG;
      }else{
        this.menuTitle = this.CommonService.getModuleName()
      }
      if(data.ANG_WEB_FORM_NAME){
        this.componentName = data.ANG_WEB_FORM_NAME;
      }else{
        this.componentName = this.CommonService.getFormComponentName()
      }
      this.PERMISSIONS = data.PERMISSION;
    }
    this.masterGridComponent?.getMasterGridData(data)
  }

}
