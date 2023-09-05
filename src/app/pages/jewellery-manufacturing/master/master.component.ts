import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { JobcardComponent } from './jobcard/jobcard.component';
import { WorkerMasterComponent } from './worker-master/worker-master.component';
import { ActivatedRoute } from '@angular/router';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { ProcessMasterComponent } from './process-master/process-master.component';
import { SequenceMasterComponent } from './sequence-master/sequence-master.component';
import { StonePricingMasterComponent } from './stone-pricing-master/stone-pricing-master.component';
import { LabourChargeMasterComponent } from './labour-charge-master/labour-charge-master.component';
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterComponent implements OnInit {
  //variables
  menuTitle: any
  PERMISSIONS: any
  tableName: any
  apiCtrl: any
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  //subscription variable
  subscriptions$!: Subscription;
  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private ChangeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.viewRowDetails = this.viewRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
  }

  ngOnInit(): void {
    /**USE: to get table data from API */
    this.getMasterGridData()
    // this.openModalView()
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
  //  open Jobcard in modal
  openModalView(data?:any) {
    let contents;
    if(this.menuTitle == 'Job Card'){
      contents = JobcardComponent
    }else if(this.menuTitle == 'Worker Master'){
      contents = WorkerMasterComponent
    }else if(this.menuTitle == 'Department Master'){
      contents = DepartmentMasterComponent
    }else if(this.menuTitle == 'Process Master'){
      contents = ProcessMasterComponent
    }else if(this.menuTitle == 'Sequance Master'){
      contents = SequenceMasterComponent
    }else if(this.menuTitle == 'Stone Pricing Master'){
      contents = StonePricingMasterComponent
    }else if(this.menuTitle == 'Labour Charge Master'){
      contents = LabourChargeMasterComponent
    }
    const modalRef: NgbModalRef = this.modalService.open(contents, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;
  }


  //PAGINATION
  totalItems: number = 1000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      if (this.orderedItems.length > 10) {
        this.orderedItems.splice(this.orderedItems.length - this.pageSize, this.pageSize);
      }
    }
  }
  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex = this.pageIndex + 1;
      this.getMasterGridData();
    }
  }

 
  /**USE: to get table data from API */
  getMasterGridData(data?:any) {
    if(data){
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.tableName = data.HEADER_TABLE;
      this.PERMISSIONS = data.PERMISSION;
    }else{
      this.menuTitle = this.CommonService.getModuleName()
      this.tableName = this.CommonService.getqueryParamTable()
    }
    if (this.orderedItems.length == 0) {
      this.snackBar.open('loading...');
    }
    if(this.tableName =='WORKER_MASTER'){
      this.orderedItemsHead = [
        { 
          dataField: "WORKER_CODE",
          caption:"WORKER_CODE",
          alignment:"left"
        },
        { 
          dataField: "DESCRIPTION",
          caption:"DESCRIPTION",
          alignment:"left"
        },
    ]
    }
    this.apiCtrl = 'TransctionMainGrid'
    let params = {
      "PAGENO": this.pageIndex || 1,
      "RECORDS": this.pageSize || 10,
      "TABLE_NAME": this.tableName,
      "CUSTOM_PARAM": {
        "FILTER": {
          "YEARMONTH": localStorage.getItem('YEAR') || '',
          "BRANCHCODE": 'MOE',
          "VOCTYPE": "PCR"
        },
        "TRANSACTION": {
          "VOCTYPE": "PCR",
        }
      }
    }
    this.subscriptions$ = this.dataService.postDynamicAPI(this.apiCtrl, params)
    .subscribe((resp: any) => {
      this.snackBar.dismiss();
      if (resp.dynamicData) {
        // resp.dynamicData[0].map((s: any, i: any) => s.id = i + 1);
        resp.dynamicData[0].forEach((item: any, i: any) => {
          item.Id = i + 1;
        });
        if (this.orderedItems.length > 0) {
          this.orderedItems = [...this.orderedItems, ...resp.dynamicData[0]];
        } else {
          this.orderedItems = resp.dynamicData[0];
          this.nextPage()
        }
        // this.orderedItemsHead = Object.keys(this.orderedItems[0]);
        // this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
        //change detector code
        this.ChangeDetector.detectChanges()
      } else {
        alert('No Response Found')
      }
    }, err => {
      alert(err)
    });
  }
  //pagination change
  handlePageIndexChanged(event: any) {
    this.pageIndex = event.pageIndex;
    // Load data for the new page using the updated pageIndex
    // Update this.dataSource with the new data
  }
  //unsubscriptions of streams
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }

  // const endTime = performance.now();
  // const duration = endTime - startTime;
  // Log the duration or perform other actions
  // console.log(`API request took ${duration} milliseconds`);
  // console.log(`API request took ${duration / 1000} seconds`);
}
