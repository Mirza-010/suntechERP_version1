import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';


@Component({
  selector: 'app-sales-order-amendment',
  templateUrl: './sales-order-amendment.component.html',
  styleUrls: ['./sales-order-amendment.component.scss']
})
export class SalesOrderAmendmentComponent implements OnInit {
  gridData: any[] = [];
  @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;
  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any; 
  tableData: any[] = [];  
  columnheadItemDetail:any[] = [''];
  columnheadItemDetails:any[] = [''];
 
  divisionMS: any = 'ID';
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    ) {
      this.dataGrid = {} as DxDataGridComponent;

     }


  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
  }

  saleorderamendmentForm: FormGroup = this.formBuilder.group({
    entered_by: [""],
    
  });

  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Entered By Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  enteredCodeSelected(e: any) {
    console.log(e);
    this.saleorderamendmentForm.controls.entered_by.setValue(e.UsersName);
    
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


}
