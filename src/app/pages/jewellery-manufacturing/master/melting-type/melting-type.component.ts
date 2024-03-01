import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-melting-type',
  templateUrl: './melting-type.component.html',
  styleUrls: ['./melting-type.component.scss']
})
export class MeltingTypeComponent implements OnInit {
  @Input() content!: any;

  tableData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];
  metal: any;
  description: any;
  code: any;
  alloy: any;
  slNo = 0;
  selectedIndexes: any = [];
  viewMode: boolean = false;
  viewModeField: boolean = true;
  SearchDisable: boolean = false;
  editCode: boolean = false;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.viewModeField = true;
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.editCode = true;
      this.setFormValues();
    } else if (this.content.FLAG == 'EDIT') {
      this.editCode = true;
      this.viewMode = false;
      this.setFormValues();
    }
  }

  onSelectionChanged(event: any) {
    // const values = event.selectedRowKeys;
    // console.log(values);
    // let indexes: Number[] = [];
    // this.tableData.reduce((acc, value, index) => {
    //   if (values.includes(parseFloat(value.SRNO))) {
    //     acc.push(index);
    //     console.log(acc);

    //   }
    //   return acc;
    // }, indexes);
    // this.selectedIndexes = indexes;
    // console.log(this.selectedIndexes);
    const values: number[] = event.selectedRowKeys;
    const indexes: number[] = [];

    values.forEach((selectedValue: number) => {
      const index = this.tableData.findIndex(item => parseFloat(item.SRNO) === selectedValue);

      // Check if the value is not already in the selectedIndexes array
      if (index !== -1 && !this.selectedIndexes.includes(index)) {
        indexes.push(index);
      }
    });

    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType();
      return;
    }

    if (this.meltingTypeForm.value.code != '' && this.meltingTypeForm.value.description != '' && this.meltingTypeForm.value.color != '' && this.tableData.length > 0) {
      let API = 'MeltingType/InsertMeltingType';
      let postData = {
        "MID": 0,
        "MELTYPE_CODE": this.meltingTypeForm.value.code,
        "MELTYPE_DESCRIPTION": this.meltingTypeForm.value.description,
        "KARAT_CODE": this.meltingTypeForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6, this.meltingTypeForm.value.purity),
        "METAL_PER": this.meltingTypeForm.value.metal,
        "ALLOY_PER": parseFloat(this.meltingTypeForm.value.alloy),
        "CREATED_BY": this.userName,
        "COLOR": this.meltingTypeForm.value.color,
        "STOCK_CODE": this.meltingTypeForm.value.stockCode,
        "MELTING_TYPE_DETAIL": this.tableData,
      };

      let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
        (result) => {
          if (result.response) {
            if (result.status == 'Success') {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok',
              }).then((result: any) => {
                if (result.value) {
                  this.meltingTypeForm.reset();
                  this.tableData = [];
                  this.close('reloadMainGrid');
                }
              });
            }
          } else {
            this.toastr.error('Not saved');
          }
        },
        (err) => alert(err)
      );
      this.subscriptions.push(Sub);
    } else {
      this.toastr.error('Fill All Mandatory Field and provide table data');
    }
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    // Trim the input to 3 letters
    const limitedValue = inputValue.slice(0, 3);

    // Update the input value
    (event.target as HTMLInputElement).value = limitedValue;
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  resetAllocation() { }

  columnheads: any[] = ['Sr', 'Division', 'Default Alloy', 'Description', 'Alloy %'];


  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR SET'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorDataSelected(data: any) {
    this.meltingTypeForm.controls.color.setValue(data.CODE)
  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  KaratCodeSelected(e: any) {
    console.log(e);
    this.meltingTypeForm.controls.karat.setValue(e['Karat Code']);
    this.meltingTypeForm.controls.purity.setValue(e.STD_PURITY);

    //  // Calculate Metal and Alloy percentages
    //  const purity = parseFloat(e.STD_PURITY);
    //  const metalPercentage = purity * 100;
    //  const alloyPercentage = 100 - metalPercentage;

    //  // Set the calculated values in the form controls
    //  this.meltingTypeForm.controls.metal.setValue(metalPercentage);
    //  this.meltingTypeForm.controls.alloy.setValue(alloyPercentage);

    // Calculate Metal and Alloy percentages
    const purity = parseFloat(e.STD_PURITY.toFixed(3));
    const metalPercentage = (purity * 100).toFixed(3);
    const alloyPercentage = (100 - parseFloat(metalPercentage)).toFixed(3);

    // Set the calculated values in the form controls
    this.meltingTypeForm.controls.metal.setValue(parseFloat(metalPercentage));
    this.meltingTypeForm.controls.alloy.setValue(parseFloat(alloyPercentage));


  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  StockCodeSelected(e: any) {
    console.log(e);
    this.meltingTypeForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.meltingTypeForm.controls.stockCodeDes.setValue(e.DESCRIPTION);
    this.meltingTypeForm.controls.divCode.setValue(e.DIVISION_CODE);
  }

  meltingTypeForm: FormGroup = this.formBuilder.group({
    mid: [],
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    metal: [''],
    color: ['', [Validators.required]],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes: [''],
    divCode: [''],

  });

  // addTableData() {
  //   if (
  //     this.meltingTypeForm.value.code !== "" &&
  //     this.meltingTypeForm.value.description !== "" &&
  //     this.meltingTypeForm.value.alloy !== "" &&
  //     this.meltingTypeForm.value.color !== ""
  //   )

  //   {



  //     if {
  //       const length = this.tableData.length;
  //       this.slNo = length + 1;

  //       const data = {
  //         UNIQUEID: 0,
  //         SRNO: this.slNo,
  //         MELTYPE_CODE: 'Y',
  //         MELTYPE_DESCRIPTION: "",
  //         KARAT_CODE: this.meltingTypeForm.value.karat,
  //         PURITY: this.commonService.transformDecimalVB(
  //           6,
  //           this.meltingTypeForm.value.purity
  //         ),
  //         DIVISION_CODE: this.meltingTypeForm.value.divCode,
  //         DEF_ALLOY_STOCK: "",
  //         DEF_ALLOY_DESCRIPTION: "",
  //         ALLOY_PER: "",
  //       };

  //       this.tableData.push(data);
  //       console.log(data);
  //     } else {
  //       this.toastr.error('DEF_ALLOY_STOCK already exists. Cannot add duplicate entry.');
  //     }
  //   } else {
  //     this.toastr.error('Please fill all mandatory fields');
  //   }
  // }


  addTableData() {



    if (this.meltingTypeForm.value.code != "" && this.meltingTypeForm.value.description != "" && this.meltingTypeForm.value.alloy != "" && this.meltingTypeForm.value.color != "") {
      let length = this.tableData.length;
      this.slNo = length + 1;
      let data = {
        "UNIQUEID": 0,
        "SRNO": this.slNo,
        "MELTYPE_CODE": 'Y' || "",
        "MELTYPE_DESCRIPTION": "",
        "KARAT_CODE": this.meltingTypeForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6, this.meltingTypeForm.value.purity),
        "DIVISION_CODE": this.meltingTypeForm.value.divCode,
        "DEF_ALLOY_STOCK": "",
        "DEF_ALLOY_DESCRIPTION": "",
        "ALLOY_PER": 100 || "",
      };
      this.tableData.push(data);
      console.log(data);
    }
    else {
      this.toastr.error('Please Fill all Mandatory Fields')
    }
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);

    let API = 'MeltingType/GetMeltingTypeWithMID/' + this.content.MID;

    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        console.log(result);

        let data = result.response;

        this.meltingTypeForm.controls.mid.setValue(data.MID);
        this.meltingTypeForm.controls.code.setValue(data.MELTYPE_CODE);
        this.meltingTypeForm.controls.description.setValue(data.MELTYPE_DESCRIPTION);
        this.meltingTypeForm.controls.karat.setValue(data.KARAT_CODE);
        this.meltingTypeForm.controls.purity.setValue(data.PURITY);
        this.meltingTypeForm.controls.metal.setValue(data.METAL_PER);
        this.meltingTypeForm.controls.alloy.setValue(data.ALLOY_PER);
        this.meltingTypeForm.controls.color.setValue(data.COLOR);
        this.meltingTypeForm.controls.stockCode.setValue(data.STOCK_CODE);
        this.tableData = data.MELTING_TYPE_DETAIL;
      })

  }
  updateMeltingType() {
    let API = 'MeltingType/UpdateMeltingType/' + this.meltingTypeForm.value.code;
    let postData =
    {
      "MID": this.content.MID,
      "MELTYPE_CODE": this.meltingTypeForm.value.code,
      "MELTYPE_DESCRIPTION": this.meltingTypeForm.value.description,
      "KARAT_CODE": this.meltingTypeForm.value.karat,
      "PURITY": this.commonService.transformDecimalVB(6, this.meltingTypeForm.value.purity),
      "METAL_PER": this.meltingTypeForm.value.metal,
      "ALLOY_PER": parseFloat(this.meltingTypeForm.value.alloy),
      "CREATED_BY": this.userName,
      "COLOR": this.meltingTypeForm.value.color,
      "STOCK_CODE": this.meltingTypeForm.value.stockCode,
      "MELTING_TYPE_DETAIL": this.tableData,
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.meltingTypeForm.reset();
                this.tableData = [];
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.meltingTypeForm.value.code) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'MeltingType/DeleteMeltingType/' + this.meltingTypeForm.value.code;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.meltingTypeForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.meltingTypeForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }


  deleteTableData() {
    console.log(this.commonService.transformDecimalVB(6, this.meltingTypeForm.value.purity));
    //  this.tableData.push(data);
    console.log(this.selectedIndexes);
    if (this.selectedIndexes.length > 0) {
      this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }

  }

  defaultAlloy: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 41,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Default Alloy Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "item = 'y' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  defaultAlloySelected(data: any, value: any, controlName: string) {
    let stockData = [];
    stockData = this.tableData.filter((item: any) => item.DEF_ALLOY_STOCK == data.STOCK_CODE)
    if (stockData.length > 0) {
      this.toastr.error('Same Alloy code cannot be added.')
    }
    else {
      console.log(value);
      console.log(data);
      this.tableData[value.data.SRNO - 1].DEF_ALLOY_STOCK = data.STOCK_CODE;
      this.tableData[value.data.SRNO - 1].MELTYPE_DESCRIPTION = data.STOCK_DESCRIPTION;
    }
  }

  division(data: any, value: any) {

    this.tableData[value.data.SRNO - 1].MELTYPE_CODE = data.target.value;
  }

  alloyPer(data: any, value: any) {

    this.tableData[value.data.SRNO - 1].ALLOY_PER = data.target.value;
  }



}
