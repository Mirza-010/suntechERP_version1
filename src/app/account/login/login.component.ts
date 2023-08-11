import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/core/services/language.service';

import { LAYOUT_MODE } from '../../layouts/layouts.model';
import { EventService } from 'src/app/core/services/event.service';

// import { CommonfuncService } from 'src/app/services/commonfunc.service';
// import { SuntechapiService } from '../../services/suntechapi.service';
// import { SharedService } from '../../services/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  public snackBarRef: any;
  public all_branch: any;
  public all_year: any;
  public user_name: any;
  public validateState = 0;
  public dataForm: FormGroup;

  options: string[] = [''];
  filteredOptions: Observable<string[]> | undefined;

  options_year: string[] = [''];
  filteredOptions_year: Observable<string[]> | undefined;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    public dataService: SuntechAPIService
  ) {
    let isLayoutRTL = false;
    this.changeRtlLayout(isLayoutRTL);
    let map = new Map();
    this.dataForm = new FormGroup({
      branch: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
    });
    this.getCompanyParameter()
  }
  /**use: to get company parameters before login, from API */
  getCompanyParameter() {
    let API = 'CompanyParameters'
    this.dataService.getDynamicAPI(API).subscribe((response: any) => {
      if (response.status == 'Success') {
        let data = response.response
        localStorage.setItem('COMPANY_PARAMETERS', JSON.stringify(data))
      } else {
        alert('Company parameters not Available')
      }
    }, error => {
      console.log(error, 'Server error');
    })
  }

  changeRtlLayout(flag: any) {
    // if (flag) {
    //   document.querySelector('body').classList.add('gradient-rtl');
    // } else {
    //   document.querySelector('body').classList.remove('gradient-rtl');
    // }
  }

  ngOnInit() {

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filteryear(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options_year.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  /**use: to check username */
  checkUserName(event: any) {
    console.log(event.target.value);
    event.target.value = event.target.value.toString().toUpperCase();
    this.user_name = event.target.value;
    if (this.user_name != '') {
      this.snackBarRef = this.snackBar.open('Validating Username ...');
      let API = 'UserDetailNetMaster/' + this.user_name
      this.dataService.getDynamicAPI(API).subscribe((resp: any) => {
        console.log(resp);
        if (resp.status == 'Success') {
          localStorage.setItem('userRole', resp['response']['GROUP_NAME']);
          localStorage.setItem('userLang', resp['response']['USER_LANGUAGE']);
          this.validateState = 1;
        }
        this.snackBar.dismiss();
      });
    }
  }
  // use: to check username and password from API
  checkUserNamePassword(event: any) {
    console.log(event.target.value);
    let password = event.target.value;
    if (this.validateState == 1) {
      if (password != '') {
        this.snackBarRef = this.snackBar.open(
          'Validating Username & Password ...'
        );
        /* ****** vb ****** */
        let API = 'ValidatePassword?strusername=' + this.user_name + '&strPassword=' + password
        this.dataService.getDynamicAPI(API)
          .subscribe((resp: any) => {
            console.log(resp);
            if (resp.status == 'Success') {
              let API2 = 'UseBranchNetMaster/' + this.user_name + ''
              this.dataService.getDynamicAPI(API2)
                .subscribe((resp) => {
                  this.all_branch = resp.response;
                  console.log('branch', this.all_branch);
                  var data = this.all_branch.map((item: any) => item.BRANCH_CODE);

                  this.options = data;
                  this.filteredOptions =
                    this.dataForm.controls.branch.valueChanges.pipe(
                      startWith(''),
                      map((value) => this._filter(value))
                    );
                });
              this.validateState = 2;
              this.snackBar.dismiss();
            } else {
              this.snackBar.open(
                'Invalid User Credentials! Check Username & Password.',
                '',
                {
                  duration: 3000,
                }
              );
              this.filteredOptions = undefined;
            }
            this.snackBar.dismiss();
          });
      }
    } else {
      this.snackBar.open('Enter Valid UserName', '', {
        duration: 2000,
      });
    }
  }
  /**USE: branch change function to call financial year API */
  changeBranch(e: any) {
    e.target.value = e.target.value.toString().toUpperCase();
    this.dataForm.controls.branch.setValue(e.target.value);
    let selectedBranch = this.dataForm.value.branch;
    if (selectedBranch != '') {
      let API = `FinancialYear?branchcode=${selectedBranch}&strusername=${this.user_name}`
      this.dataService.getDynamicAPI(API)
        .subscribe((resp) => {
          this.all_year = resp.response;
          this.options_year = this.all_year.map((item: any) => item.fyearcode);

          this.filteredOptions_year =
            this.dataForm.controls.year.valueChanges.pipe(
              startWith(''),
              map((value) => this._filteryear(value))
            );
        });
    }
  }
  /**USE: sign in with API branchmaster */
  signin() {
    let branch = this.dataForm.value.branch;
    let year = this.dataForm.value.year;
    localStorage.setItem('username', 'user');
    localStorage.setItem('currentUser', JSON.stringify(this.user_name));

    if (branch != '' && this.validateState == 2 && year != '') {
      let API = 'BranchMaster/' + branch
      this.dataService.getDynamicAPI(API).subscribe((resp: any) => {
        if (resp.status == 'Success') {
          // if (resp.status == 'Success') {
          this.validateState = 3;
          localStorage.setItem('branchdetails', JSON.stringify(resp.response));
          // this.comFunc.allbranchMaster = resp.response;
          localStorage.setItem('username', this.user_name);
          localStorage.setItem('userbranch', branch);
          localStorage.setItem('year', year);
          this.getBranchCurrencyMaster();
          // this.router.navigate(['/']);
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        }
        this.snackBar.dismiss();
      });
    } else {
      this.snackBar.open('Invalid Credentials', '', {
        duration: 2000,
      });
    }
  }

  getBranchCurrencyMaster() {
    //alert("test");
    let branch = localStorage.getItem('userbranch')
    let API = `BranchCurrencyMaster/GetBranchCurrencyMasterDetail/${branch}`
    this.dataService.getDynamicAPI(API)
      .subscribe((data: any) => {
        // this.comFunc.allBranchCurrency = data.response;
        console.log('===============curr=====================');
        console.log(data);
        console.log('====================================');
        // this.comFunc.allBranchCurrency = data.response;
      });
  }


}