import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-sales-voucher-redeem',
  templateUrl: './sales-voucher-redeem.component.html',
  styleUrls: ['./sales-voucher-redeem.component.scss']
})
export class SalesVoucherRedeemComponent implements OnInit {

  karatmasterFrom!: FormGroup;
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  currentDate = new Date();
  columnhead:any[] = ['Voucher','VOUCHER AMOUNT'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }


  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
