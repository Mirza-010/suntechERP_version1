import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';
import { MetalBranchTransferOutRepairDetailComponent } from './metal-branch-transfer-out-repair-detail/metal-branch-transfer-out-repair-detail.component';



@Component({
  selector: 'app-metal-branch-transfer-out-repair',
  templateUrl: './metal-branch-transfer-out-repair.component.html',
  styleUrls: ['./metal-branch-transfer-out-repair.component.scss']
})
export class MetalBranchTransferOutRepairComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2:any[] = ['Repair Narration']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled:boolean=true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean= true;
  viewMode: boolean = false;
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  formattedTime: any;
  maxTime: any;
  standTime: any;
  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
  
  
  }
  metalBranchTransferOutRepairForm: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocNo:[''],
    vocDate:[''],
    enteredBy:[''],
    itemCurrency:[''],
    itemCurrencyAmount:[''],
    branchCurrency:[''],
    branchCurrencyDes:[''],
    metalRate:[''],
    metalRate2:[''],
    fixed:[''],
    branchto:[''],
    branchtoDes:[''],
    locationTo:[''],
    returnLocation:[''],
    shipsTo:[''],
    shipToDes:[''],
    deliveryDate:[''],
    creditDays:[''],
    creditDate:[''],
    Driver1:['']
  })


  
  
  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 

  adddata() {

   
}


adddatas() {
 
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}

  formSubmit() {
    
  }

  updateMeltingType() {
  
  }
 

  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

}
