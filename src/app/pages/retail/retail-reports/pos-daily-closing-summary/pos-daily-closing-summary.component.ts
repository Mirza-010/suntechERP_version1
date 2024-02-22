import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { PosSalesmanDetailsComponent } from './pos-salesman-details/pos-salesman-details.component';
import { PosDailyClosingBranchComponent } from './pos-daily-closing-branch/pos-daily-closing-branch.component';
@Component({
  selector: 'app-pos-daily-closing-summary',
  templateUrl: './pos-daily-closing-summary.component.html',
  styleUrls: ['./pos-daily-closing-summary.component.scss']
})

export class PosDailyClosingSummaryComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  tableData: any[] = [];
  columnhead:any[] = ['No.Inv','Amt.Rcvd','Gold','Dia & Other'];
  columnheadTransaction:any[] = ['Voucher','No.Inv','Amount'];
  columnheadMetal:any[] = ['Division','Type','Pcs','Gms','Pure Wt','St.Qty','St.Amt','Mkg.Rate','Mkg.Value','Metal Value','Total Amount'];
  columnheadDiamond:any[] = ['Division','Type','Pcs','Weight',' Amount'];
  columnheadReceipt:any[] = ['Rcvd.In',' Amount'];
  columnheadScrap:any[] = ['Item Code','Gross Wt',' Amount'];
  columnheadSales:any[] = ['Salesman','#Docs','Tot Amount','Gold','Dia & Others','Mkg.Value'];
  columnheadSalesManDetails:any[] = ['Sales Man','#Dos',]
 
  divisionMS: any = 'ID';
  metalOptions = [
    { value: 'TYPE', label: 'TYPE' },
    { value: 'KARAT', label: 'KARAT' },
    { value: 'BRAND', label: 'BRAND' },
    { value: 'COUNTRY', label: 'COUNTRY' },
    { value: 'STOCK CODE', label: 'STOCK CODE' },
    { value: 'CATEGORY', label: 'CATEGORY' },
    { value: 'COST CODE', label: 'COST CODE' },
    { value: 'TYPE', label: 'TYPE' },
    { value: 'KARAT', label: 'KARAT' },
    { value: 'BRAND', label: 'BRAND' },
    { value: 'COUNTRY', label: 'COUNTRY' },
    { value: 'STOCK CODE', label: 'STOCK CODE' },
    { value: 'CATEGORY', label: 'CATEGORY' },
    { value: 'COST CODE', label: 'COST CODE' },
  ];

  transactionOptions = [
    { value: 'Sales', label: 'Sales' },
    { value: 'Sales Returns', label: 'Sales Returns' },
    { value: 'Net Sales', label: 'Net Sales' },
  ]

  posDailyClosingSummaryForm: FormGroup = this.formBuilder.group({
    transactionType:[''],
    metalType:[''],
    diamondType:[''],
    fromDate:[new Date()],
    toDate:[new Date()],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('mymodal') public mymodal!: NgbModal;

  open(modalname?: any) {
      
      const modalRef: NgbModalRef = this.modalService.open(PosDailyClosingBranchComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'modal-full-width'
      });
  
      modalRef.result.then((result) => {
       
      }, (reason) => {
       
      });
    }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  openaddstonereturndetails() {
    const modalRef: NgbModalRef = this.modalService.open(PosSalesmanDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }


}
