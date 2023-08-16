import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenubarComponent implements OnInit {
  @Input() menuTitle = '';
  @Output() subMenuChange = new EventEmitter<void>()

  subMenuName: any;
  subMenuList: any;
  branchCode: any;
  username: any = localStorage.getItem('username');
  menuList: any;
  uniqueColsub: any;
  subscriptions$!: Subscription;

  constructor(
    public dataService: SuntechAPIService,
    public CommonService: CommonServiceService,
    private router: Router,
  ) {
    let item: any = localStorage.getItem('MENU_LIST')
    this.menuList = JSON.parse(item)
  }

  ngOnInit(): void {
    this.branchCode = this.CommonService.branchCode
    this.subMenuName = this.CommonService.getModuleName()
    this.menuTitle = this.CommonService.getTitleName()
    this.getSubmenuList(this.menuTitle);
  }
  /**USE: To get submenus of Transaction,Master,Reports from API */
  groupedMenuData: { label: string; submenus: any[] }[] = [];
  getSubmenuList(title: any) {
    let API = `WebMenuModuleWise/${title}/${this.username}/${this.branchCode}`
    this.subscriptions$ = this.dataService.getDynamicAPI(API).subscribe((response: any) => {
      if (response.status == 'Success') {
        let menuData = response.response
        console.log(menuData);
        
        const groupedData: { [key: string]: any[] } = {};

        for (const item of menuData) {
          if (!groupedData[item.MENU_SUB_MODULE]) {
            groupedData[item.MENU_SUB_MODULE] = [];
          }

          groupedData[item.MENU_SUB_MODULE].push(item);
        }

        this.groupedMenuData = Object.keys(groupedData).map((label:any, index:any) => ({
          label,
          label_no: index,
          submenus: groupedData[label]
        })).sort((a:any, b:any) => {
          const nameA = a.label;
          const nameB = b.label;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        console.log(this.groupedMenuData);
        
      }
    })
  }

  pageRoutes(path: any, obj: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: obj
    };
    this.router.navigate([path], navigationExtras);
    this.subMenuChange.emit();
  }

  ngOnDestroy():void{
    this.subscriptions$.unsubscribe()
  }

}
