import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-price-setting',
  templateUrl: './customer-price-setting.component.html',
  styleUrls: ['./customer-price-setting.component.scss']
})
export class CustomerPriceSettingComponent implements OnInit {

  divisionMS: any = 'ID';
  columnheader:any[] = ['SrNo','Group 1','Group 2', 'Group 3','Group 4','Group 5','Group 6','Apply On U','Mkg On %','Std Mkg','Mkg Rate','Mkg Rate','Variance'];
  columnheaderweightRange:any[] = ['SrNo','Division','Apply on Unit', 'From Weight','To Weight','Making Rate']
  columnheaderTransaction : any[] = ['SrNo','Karat','Std Purity','Sales Purity','Purchase Purity']
   constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
