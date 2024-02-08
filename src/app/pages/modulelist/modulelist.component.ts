import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IndexedApiService } from 'src/app/services/indexed-api.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-modulelist',
  templateUrl: './modulelist.component.html',
  styleUrls: ['./modulelist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulelistComponent implements OnInit {
  //variables
  menuList: any[] = [];
  isLoading: boolean = false;

  subscriptions$!: Subscription;
  constructor(
    private dataService: SuntechAPIService,
    public indexedApiService: IndexedApiService,
    public inDb: IndexedDbService,
    private ChangeDetector: ChangeDetectorRef
  ) {
    this.getModuleList()
  }

  ngOnInit(): void {
    this.setVoctypeMaster()
  }
  setVoctypeMaster(){
    let branch = localStorage.getItem('userbranch')
    this.inDb.getAllData('VocTypeMaster').subscribe((data) => {
      if (data.length == 0 || data.length == 1) {
        this.indexedApiService.getVocTypeMaster(branch);
      }
    });
  }
  /**USE: get module list from API */
  getModuleList() {
    this.isLoading = true;
    let API = 'SuntechProdModuleMaster/GetProductModuleList'
    this.subscriptions$ = this.dataService.getDynamicAPI(API).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status == 'Success') {
        this.menuList = response.response;
        this.menuList.push({
          MID: 15,
          MODULE_NAME: 'Addons',
          imageUrl: '../../assets/images/lp-icons/add ons.png',
          imageUrl_2: '../../assets/images/lp-icons/x31_7.png'
        });

        this.menuList.sort((a, b) => {
          const nameA = a.MODULE_NAME;
          const nameB = b.MODULE_NAME;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        // let imageUrl = {
        //   1: '../../assets/images/lp-icons/11.png',
        //   4: '../../assets/images/lp-icons/12.png',
        //   5: '../../assets/images/lp-icons/6.png',
        //   6: '../../assets/images/lp-icons/7.png',
        //   7: '../../assets/images/lp-icons/11.png',
        //   8: '../../assets/images/lp-icons/11.png',
        //   9: '../../assets/images/lp-icons/8.png',
        //   10: '../../assets/images/lp-icons/4.png'
        // }
        this.menuList.forEach(data => {
          if (data.MODULE_NAME == 'Boiling') {
            data.imageUrl = '../../assets/images/lp-icons/boiling.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Page_1.png'
          } else if (data.MID == 14) {
            data.imageUrl = '../../assets/images/lp-icons/bullion.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Ingot (1).png'
          } else if (data.MID == 10) {
            data.imageUrl = '../../assets/images/lp-icons/catalogue.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Group_1.png'
          } else if (data.MID == 13) {
            data.imageUrl = '../../assets/images/lp-icons/fixed assets.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Group (1).png'
          } else if (data.MID == 5) {
            data.imageUrl = '../../assets/images/lp-icons/Vector.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Group (2).png'
          } else if (data.MID == 6) {
            data.imageUrl = '../../assets/images/lp-icons/Group.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Group (3).png'
          } else if (data.MID == 9) {
            data.imageUrl = '../../assets/images/lp-icons/Vector_1.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Vec_1.png'
          } else if (data.MID == 8) {
            data.imageUrl = '../../assets/images/lp-icons/Page-1.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Page-1 (1).png'
          } else if (data.MID == 11) {
            data.imageUrl = '../../assets/images/lp-icons/Repairing.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Repairing_1.png'
          } else if (data.MID == 4) {
            data.imageUrl = '../../assets/images/lp-icons/Vector_2.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Vector (1).png'
          } else if (data.MID == 1) {
            data.imageUrl = '../../assets/images/lp-icons/Layer_x0020_1.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Layer_x0020_1 (1).png'
          } else if (data.MODULE_NAME == 'Wholesale') {
            data.imageUrl = '../../assets/images/lp-icons/Layer_x0020_1.png'
            data.imageUrl_2 = '../../assets/images/lp-icons/Layer_x0020_1 (1).png'
          }

        });
        localStorage.setItem('MENU_LIST', JSON.stringify(this.menuList));
        this.ChangeDetector.detectChanges()
      } else {
        this.menuList = [];
      }
    }, err => {
      this.isLoading = false;
      alert(err)
    })
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe()
  }
}
