import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-labour-charge-master',
  templateUrl: './labour-charge-master.component.html',
  styleUrls: ['./labour-charge-master.component.scss']
})
export class LabourChargeMasterComponent implements OnInit {
  @Input() content!: any;
  viewMode: boolean = false;
  buttonField: boolean = true;
  forDesignOnlyTrue: boolean = true;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branch = localStorage.getItem('userbranch');
  private subscriptions: Subscription[] = [];
  stockcodeDisable: boolean = false;
  brandDisable: boolean = false;
  // methodList: any[] = [];
  // labourTypeList: any[] = [];
  // DialabourTypeList: any[] = [];
  // unitList: any[] = [];
  currencyList: any[] = [];
  // settingTypeList: any[] = [];
  divisionMS: any = 'ID';
  salesRate: any;
  salesRatePercentage: any;
  salesRateMetal: any;
  salesRatePercentageMetal: any;
  editMode: boolean = false;
  grossWt: boolean = false;
  codeEnableMetal: boolean = true;
  codeEnableDiamond: boolean = true;


  displayDiaCostRate: any;
  displayDiaSellingRate: any;
  displayDiaCtWtFrom: any;
  displayDiaCtWtTo: any;
  displayMetalCostRate: any;
  displayMetalSellingRate: any;
  displayMetalWtFrom: any;
  displayMetalWtTo: any;
  viewDisable: boolean = false;
  viewDisable1: boolean = false;
  inputDisable: boolean = false;

  viewselling: boolean = false;
  viewsellingrate: boolean = false;

  viewsellingrateMetal: boolean = false;
  viewsellingMetal: boolean = false;

  viewModeSetting :boolean = false;
  ViewModemethod :boolean = false;
  codeEnable1: boolean = true;
  codeEnable2: boolean = true;

  diamondlabourMasterForm: FormGroup = this.formBuilder.group({
    mid: [],
    divisions: ['', [Validators.required]],
    labour_code: ['', [Validators.required]],
    labour_description: ['', [Validators.required]],
    shape: ['', [Validators.required]],
    process: ['', [Validators.required]],
    size_from: ['', [Validators.required]],
    labour_ac: ['', [Validators.required]],
    size_to: ['', [Validators.required]],
    cost_rate: [0, [Validators.required]],
    sieve: ['', [Validators.required]],
    selling_rate: [''],
    sieve_desc: [''],
    selling: [''],
    ctWtFrom: [''],
    ctWtTo: [''],
    settingType: [''],
    labourType: ['', [Validators.required]],
    unitList: [''],
    method: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    accessories: [''],


  });


  metallabourMasterForm: FormGroup = this.formBuilder.group({
    mid: [],
    metalDivision: ['', [Validators.required]],
    stock_code: [''],
    metallabour_code: ['', [Validators.required]],
    metallabour_description: ['', [Validators.required]],
    metallabourType: ['', [Validators.required]],
    metalcurrency: ['', [Validators.required]],
    karat: ['', [Validators.required]],
    labourAc: ['', [Validators.required]],
    color: [''],
    metalcost_rate: ['', [Validators.required]],
    typecode: [''],
    metalselling_rate: [''],
    category: ['', [Validators.required]],
    metalSelling: [''],
    subCategory: [''],
    wastage: ['', [Validators.required]],
    brand: [''],
    metalunitList: ['', [Validators.required]],
    purity: [''],
    wtFrom: [''],
    wtTo: [''],
    onGrossWt: [false, [Validators.required]],
    forDesignOnly: [false, [Validators.required]],
  }); 


  @ViewChild('codeInput1') codeInput1!: ElementRef;
  @ViewChild('codeInput2') codeInput2!: ElementRef;
  ngAfterViewInit() {
    // Focus on the first input
    if (this.codeInput1) {
      this.codeInput1.nativeElement.focus();
    }
    setTimeout(() => {
      if (this.codeInput2) {
        this.codeInput2.nativeElement.focus();
      }
    }, 2000); // Adjust the delay as needed
  }


  ngOnInit(): void {
    this.setInitialValues();
    this.grossWt = true;
    this.codeEnable1 = true;
    this.inputDisable = true;

  //  this.renderer.selectRootElement('#code')?.focus();

    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.viewDisable = true;
      this.setFormValues();
     // this.setInitialValues();
    }
    else (this.content.FLAG == 'EDIT')
    {
      this.codeEnableDiamond = false;
      this.codeEnableMetal = false;
      this.editMode = true;
      this.setFormValues();
    // this.setInitialValues();
    }
    this.metallabourMasterForm.controls['stock_code'].enable();
    this.metallabourMasterForm.controls['color'].enable();
    this.metallabourMasterForm.controls['metallabourType'].enable();

    this.getcurrencyOptions()

  }


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  // salesChangesDia(data: any) {
  //   console.log(data);

  //   if (data == 'selling') {
  //     this.viewsellingrate = true;
  //     this.viewselling = false;
  //     this.diamondlabourMasterForm.controls.selling_rate.setValue('');
  //   } else if (data == 'selling_rate') {
  //     this.viewselling = true;
  //     this.viewsellingrate = false;
  //     this.diamondlabourMasterForm.controls.selling.setValue('');
  //   } else {
  //     this.viewselling = false;
  //     this.viewsellingrate = false;
  //   }

  // }


  // salesChangesMetal(data: any) {
  //   console.log(data);
  //   if (data == 'metalSelling') {
  //     this.viewsellingrateMetal = true;
  //     this.viewsellingMetal = false;
  //     this.metallabourMasterForm.controls.metalselling_rate.setValue('');
  //   } else if (data == 'metalselling_rate') {
  //     this.viewsellingMetal = true;
  //     this.viewsellingrateMetal = false;
  //     this.metallabourMasterForm.controls.metalSelling.setValue('');
  //   } else {
  //     this.viewsellingMetal = false;
  //     this.viewsellingrateMetal = false;
  //   }

  // }

  checkCode(): boolean {
    if (this.metallabourMasterForm.value.metallabour_code == '') {
      this.commonService.toastErrorByMsgId('Please Enter the Code')
      return true
    }
    return false
  }

  checkCodeDia(): boolean {
    if (this.diamondlabourMasterForm.value.labour_code == '') {
      this.commonService.toastErrorByMsgId('Please Enter the Code')
      return true
    }
    return false
  }

  codeEnabledMetal(){
    if (this.metallabourMasterForm.value.metallabour_code == '') {
      this.codeEnableMetal = true;
    }
    else {
      this.codeEnableMetal = false;
    }
  }

  codeEnabledDiamond(){
    if (this.diamondlabourMasterForm.value.labour_code == '') {
      this.codeEnableDiamond = true;
    }
    else {
      this.codeEnableDiamond = false;
    }
  }


  diaDivisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "division='S'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  metalDivisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "division= 'm'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 33,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  sizeFromCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  sizeToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  labouracCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Labour A/C',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: " CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'BRAND MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Type',
    SEARCH_VALUE: '',
    WHERECONDITION: `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };



  
  DialabourTypeList = [
    {
      name: 'SETTING',
      value: 'SETTING'
    },
    {
      name: 'HANDLING',
      value: 'HANDLING'
    },
    {
      name: 'CERTIFICATE',
      value: 'CERTIFICATE'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },
  ];

  settingTypeList = [
    {
      name: 'GEN',
      value: 'GEN'
    },
    {
      name: 'PRESSURE',
      value: 'PRESSURE'
    },
  ];

  labourTypeList = [
    {
      name: 'MAKING',
      value: 'MAKING'
    },
    {
      name: 'POLISH',
      value: 'POLISH'
    },
    {
      name: 'FINISHING',
      value: 'FINISHING'
    },
    {
      name: 'CASTING',
      value: 'CASTING'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },
    {
      name: 'RHODIUM',
      value: 'RHODIUM'
    },
    {
      name: 'STAMPING',
      value: 'STAMPING'
    },
    {
      name: 'WASTAGE',
      value: 'WASTAGE'
    },
  ];
  unitList = [
    {
      name: 'Lumpsum ',
      value: 'Lumpsum '
    },
    {
      name: 'PCS',
      value: 'PCS'
    },
    {
      name: 'Grams',
      value: 'Grams'
    },
    {
      name: 'Carat',
      value: 'Carat'
    },
    {
      name: 'Hours',
      value: 'Hours'
    }
  ];

  methodList = [
    {
      name: 'Hand Setting ',
      value: 'Hand Setting '
    },
    {
      name: 'Wax Setting',
      value: 'Wax Setting'
    },
    {
      name: 'Other Setting',
      value: 'Other Setting'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },

  ];

  onlabourtypeChange(){
    console.log(' Hi' +this.settingTypeList);
    this.diamondlabourMasterForm.get('labourType')?.valueChanges.subscribe((selectedLabourType) => {
      const settingTypeControl = this.diamondlabourMasterForm.get('settingType');
      const methodControl = this.diamondlabourMasterForm.get('method');
      if (selectedLabourType === 'SETTING') {
        this.viewModeSetting = false;
        this.ViewModemethod = false;
       
        // settingTypeControl;
        // methodControl?.enable();
      } else {
        // settingTypeControl?.disable();
        // methodControl?.disable();
        this.viewModeSetting = true;
        this.ViewModemethod = true;
        this.diamondlabourMasterForm.controls.settingType.setValue('');
        this.diamondlabourMasterForm.controls.method.setValue('');
      }
      console.log(this.settingTypeList);
    });
  }

  setFormValues() {
    if (!this.content) return
    this.diamondlabourMasterForm.controls.mid.setValue(this.content.MID);
    this.diamondlabourMasterForm.controls.labour_code.setValue(this.content.CODE);
    this.diamondlabourMasterForm.controls.labour_description.setValue(this.content.DESCRIPTION);
    this.diamondlabourMasterForm.controls.labourType.setValue(this.content.LABTYPE);
    this.diamondlabourMasterForm.controls.method.setValue(this.content.METHOD);
    this.diamondlabourMasterForm.controls.divisions.setValue(this.content.DIVISION);
    this.diamondlabourMasterForm.controls.shape.setValue(this.content.SHAPE);
    this.diamondlabourMasterForm.controls.size_from.setValue(this.content.SIZE_FROM);
    this.diamondlabourMasterForm.controls.size_to.setValue(this.content.SIZE_TO);
    this.diamondlabourMasterForm.controls.currency.setValue(this.content.CURRENCYCODE);
    this.diamondlabourMasterForm.controls.sieve.setValue(this.content.SIEVE);
    this.diamondlabourMasterForm.controls.process.setValue(this.content.PROCESS_TYPE);
    this.diamondlabourMasterForm.controls.sieve_desc.setValue(this.content.SIEVEFROM_DESC);

    this.diamondlabourMasterForm.controls.ctWtFrom.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARATWT_FROM));

    this.diamondlabourMasterForm.controls.ctWtTo.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARATWT_TO));

    this.diamondlabourMasterForm.controls.selling_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.SELLING_RATE));

    this.diamondlabourMasterForm.controls.selling.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.SELLING_PER));

    this.diamondlabourMasterForm.controls.cost_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.COST_RATE));



    this.metallabourMasterForm.controls.metallabour_code.setValue(this.content.CODE);
    this.metallabourMasterForm.controls.metallabour_description.setValue(this.content.DESCRIPTION);
    this.metallabourMasterForm.controls.metalDivision.setValue(this.content.DIVISION_CODE);
    this.metallabourMasterForm.controls.metalcurrency.setValue(this.content.CURRENCY_CODE);
    this.metallabourMasterForm.controls.wastage.setValue(this.content.WASTAGE_PER);
    this.metallabourMasterForm.controls.category.setValue(this.content.CATEGORY_CODE);
    this.metallabourMasterForm.controls.subCategory.setValue(this.content.SUB_CATEGORY_CODE);
    this.metallabourMasterForm.controls.brand.setValue(this.content.BRAND_CODE);
    this.metallabourMasterForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.metallabourMasterForm.controls.stock_code.setValue(this.content.STOCK_CODE);
    this.metallabourMasterForm.controls.purity.setValue(this.content.PURITY);
    this.metallabourMasterForm.controls.color.setValue(this.content.COLOR);
    this.metallabourMasterForm.controls.forDesignOnly.setValue(this.content.FOR_DESIGN);
    this.metallabourMasterForm.controls.onGrossWt.setValue(this.content.ON_GROSSWT);
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.content.LAST_COST_RATE);
    this.metallabourMasterForm.controls.typecode.setValue(this.content.TYPE_CODE);

    this.metallabourMasterForm.controls.purity.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.PURITY));

    this.metallabourMasterForm.controls.metalselling_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.LAST_SELLING_RATE));

    this.metallabourMasterForm.controls.metalcost_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.LAST_COST_RATE));

    this.metallabourMasterForm.controls.metalselling.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.METALSTONE));

  }

  private setInitialValues() {
    console.log(this.commonService.amtFormat)
    // this.metallabourMasterForm.controls.wtFromdeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    // this.metallabourMasterForm.controls.wtToDeci.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.wtFrom.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.metallabourMasterForm.controls.wtTo.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.metallabourMasterForm.controls.metalselling_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalSelling.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.metalcost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.metallabourMasterForm.controls.wastage.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))

    
    this.diamondlabourMasterForm.controls.cost_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.diamondlabourMasterForm.controls.selling_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.diamondlabourMasterForm.controls.selling.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.diamondlabourMasterForm.controls.ctWtFrom.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.diamondlabourMasterForm.controls.ctWtTo.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  }
  
  divisionCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.divisions.setValue(e.DIVISION_CODE);
  }


  categorySelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.category.setValue(e.CODE);
  }

  subcategorySelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.subCategory.setValue(e.CODE);
  }

  brandSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.brand.setValue(e.CODE);
  }

  typeCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.typecode.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    if (this.checkCode()) return
    this.metallabourMasterForm.controls.color.setValue(data.CODE)
  }

  metaldivisionCodeSelected(e: any) {
    this.metallabourMasterForm.controls.stock_code.setValue('');
    if (this.checkCode()) return

    console.log(e);
    this.metallabourMasterForm.controls.metalDivision.setValue(e.DIVISION_CODE);
    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
  }

  labouracSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.labour_ac.setValue(e.ACCODE);
  }

  labourAcSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.labourAc.setValue(e.ACCODE);
  }

  sieveSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.sieve.setValue(e.CODE);
    this.diamondlabourMasterForm.controls.sieve_desc.setValue(e.DESCRIPTION);

  }

  stockCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.stock_code.setValue(e.STOCK_CODE);
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${this.metallabourMasterForm.value.metalDivision}' and SUBCODE = '0'`;
  }

  currencyCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.currency.setValue(e.CURRENCY_CODE);

  }

  metalcurrencyCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.metalcurrency.setValue(e.CURRENCY_CODE);


  }

  karatCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.metallabourMasterForm.controls.karat.setValue(e.KARAT_CODE);
    this.metallabourMasterForm.controls.purity.setValue(e.STD_PURITY);
  }

  shapeCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.shape.setValue(e.CODE);
  }

  processCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.process.setValue(e.Process_Code);
  }

  sizeToCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.size_to.setValue(e.CODE);
  }

  sizeFromCodeSelected(e: any) {
    if (this.checkCodeDia()) return
    console.log(e);
    this.diamondlabourMasterForm.controls.size_from.setValue(e.CODE);
  }


  // USE: get select options Process TypeMaster
  private getcurrencyOptions(): void {
    let API = '/BranchCurrencyMaster/GetBranchCurrencyMasterDetail/' + this.branch;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.currencyList = result.response;
      }
    });
    this.subscriptions.push(Sub)
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {

    if (this.diamondlabourMasterForm.invalid && this.metallabourMasterForm.invalid ) {
      this.toastr.error('select all required fields')
      return
    }

    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatelabourChargeMaster()
      return
    }

    if(this.diamondlabourMasterForm.value.wtFrom > this.diamondlabourMasterForm.value.wtTo)
      {
        this.toastr.error('Weight From should be lesser than Weight To')
      }

      if(this.metallabourMasterForm.value.ctWtFrom > this.metallabourMasterForm.value.ctWtTo)
        {
          this.toastr.error('Weight From should be lesser than Weight To')
        }

        if(this.metallabourMasterForm.value.size_from > this.metallabourMasterForm.value.size_to)
          {
            this.toastr.error('Weight From should be lesser than Weight To')
          return;
          }



    // if (this.diamondlabourMasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    // if (this.metallabourMasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'LabourChargeMasterDj/InsertLabourChargeMaster'
    let postData =
    {
      "MID": 0,
      "SRNO": 0,
      "CODE": this.diamondlabourMasterForm.value.labour_code,
      "DESCRIPTION": this.diamondlabourMasterForm.value.labour_description || "",
      "LABTYPE": this.diamondlabourMasterForm.value.labourType || "",
      "METHOD": this.diamondlabourMasterForm.value.method || "",
      "DIVISION": this.diamondlabourMasterForm.value.divisions,
      "SHAPE": this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM": this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO": this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE": this.diamondlabourMasterForm.value.currency || "",
      "UNITCODE": this.diamondlabourMasterForm.value.unitList || "",
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate,
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate || 0,
      "LAST_COST_RATE": this.metallabourMasterForm.value.metalcost_rate || 0,
      "LAST_SELLING_RATE":  0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE": "",
      "DIVISION_CODE": this.metallabourMasterForm.value.metalDivision,
      "CURRENCY_CODE": this.metallabourMasterForm.value.currency || "",
      "SELLING_PER": this.diamondlabourMasterForm.value.selling || 0,
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom || 0,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo || 0,
      "SIEVE": this.diamondlabourMasterForm.value.sieve,
      "WASTAGE_PER": this.commonService.emptyToZero(this.metallabourMasterForm.value.wastage),
      "WASTAGE_AMT": 0,
      "TYPE_CODE": this.metallabourMasterForm.value.typecode || "",
      "CATEGORY_CODE": this.metallabourMasterForm.value.category,
      "SUB_CATEGORY_CODE": this.metallabourMasterForm.value.subCategory,
      "BRAND_CODE": this.metallabourMasterForm.value.brand,
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process || "",
      "KARAT_CODE": this.metallabourMasterForm.value.karat,
      "METALSTONE": this.metallabourMasterForm.value.metalselling_rate || "1",
      "STOCK_CODE": this.metallabourMasterForm.value.stock_code,
      "PURITY": this.metallabourMasterForm.value.purity,
      "COLOR": this.metallabourMasterForm.value.color,
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly || false,
      "SIEVEFROM_DESC": this.diamondlabourMasterForm.value.sieve_desc,
      "ON_GROSSWT": this.metallabourMasterForm.value.onGrossWt || false,
    }
    console.log(this.metallabourMasterForm.value)
    console.log(postData)
    console.log('start')

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe((result: any) => {
      console.log('Server Response:', result);
      if (result.response) {
        if (result.status == "Success") {
          Swal.fire({
            title: result?.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.diamondlabourMasterForm.reset()
              this.metallabourMasterForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      } else {
        this.toastr.error('Not saved')
      }
    }
      , err => alert('save ' + err)
    )
    this.subscriptions.push(Sub)
  }

  updatelabourChargeMaster() {
    let API = 'LabourChargeMasterDj/UpdateLabourChargeMaster/' + this.diamondlabourMasterForm.value.mid;
    let postData =
    {
      "MID": 0,
      "SRNO": 0,
      "CODE": this.diamondlabourMasterForm.value.labour_code,
      "DESCRIPTION": this.diamondlabourMasterForm.value.labour_description || "",
      "LABTYPE": this.diamondlabourMasterForm.value.labourType || "",
      "METHOD": this.diamondlabourMasterForm.value.method || "",
      "DIVISION": this.diamondlabourMasterForm.value.divisions,
      "SHAPE": this.diamondlabourMasterForm.value.shape,
      "SIZE_FROM": this.diamondlabourMasterForm.value.size_from,
      "SIZE_TO": this.diamondlabourMasterForm.value.size_to,
      "CURRENCYCODE": this.diamondlabourMasterForm.value.currency || "",
      "UNITCODE": this.diamondlabourMasterForm.value.unitList || "",
      "COST_RATE": this.diamondlabourMasterForm.value.cost_rate,
      "SELLING_RATE": this.diamondlabourMasterForm.value.selling_rate || 0,
      "LAST_COST_RATE": this.metallabourMasterForm.value.metalcost_rate || 0,
      "LAST_SELLING_RATE": this.metallabourMasterForm.value.metalselling_rate || 0,
      "LAST_UPDATE": "2023-09-12T11:17:56.924Z",
      "CRACCODE": "",
      "DIVISION_CODE": this.metallabourMasterForm.value.metalDivision,
      "CURRENCY_CODE": this.metallabourMasterForm.value.currency || "",
      "SELLING_PER": this.diamondlabourMasterForm.value.selling || 0,
      "ACCESSORIES": 0,
      "CARATWT_FROM": this.diamondlabourMasterForm.value.ctWtFrom || 0,
      "CARATWT_TO": this.diamondlabourMasterForm.value.ctWtTo || 0,
      "SIEVE": this.diamondlabourMasterForm.value.sieve,
      "WASTAGE_PER": this.metallabourMasterForm.value.wastage,
      "WASTAGE_AMT": 0,
      "TYPE_CODE": this.metallabourMasterForm.value.typecode || "",
      "CATEGORY_CODE": this.metallabourMasterForm.value.category,
      "SUB_CATEGORY_CODE": this.metallabourMasterForm.value.subCategory,
      "BRAND_CODE": this.metallabourMasterForm.value.brand,
      "PROCESS_TYPE": this.diamondlabourMasterForm.value.process || "",
      "KARAT_CODE": this.metallabourMasterForm.value.karat,
      "METALSTONE": this.metallabourMasterForm.value.metalselling || 0,
      "STOCK_CODE": this.metallabourMasterForm.value.stock_code,
      "PURITY": this.metallabourMasterForm.value.purity,
      "COLOR": this.metallabourMasterForm.value.color,
      "FOR_DESIGN": this.metallabourMasterForm.value.forDesignOnly || false,
      "SIEVEFROM_DESC": this.diamondlabourMasterForm.value.sieve_desc,
      "ON_GROSSWT": this.metallabourMasterForm.value.onGrossWt || false,
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
                this.diamondlabourMasterForm.reset()
                this.metallabourMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert('update ' + err))
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (this.content && this.content.FLAG == 'VIEW') return
    // if (!this.content.WORKER_CODE) {
    //   Swal.fire({
    //     title: '',
    //     text: 'Please Select data to delete!',
    //     icon: 'error',
    //     confirmButtonColor: '#336699',
    //     confirmButtonText: 'Ok'
    //   }).then((result: any) => {
    //     if (result.value) {
    //     }
    //   });
    //   return
    // }
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
        let API = 'LabourChargeMasterDj/DeleteLabourChargeMaster/' + this.content.CODE;
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
                    this.diamondlabourMasterForm.reset()
                    this.metallabourMasterForm.reset()
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
                    this.diamondlabourMasterForm.reset()
                    this.metallabourMasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert('delete ' + err))
        this.subscriptions.push(Sub)
      }
    });
  }

  onforDesignOnlyChange(event: any) {
    console.log(event);
    if (event.checked === true) {
      this.stockcodeDisable = true;
      this.viewDisable1 = true;
      this.metallabourMasterForm.controls['stock_code'].disable();
      this.metallabourMasterForm.controls['stock_code'].setValue('');
      this.metallabourMasterForm.controls['karat'].disable();
      this.metallabourMasterForm.controls['karat'].setValue('');
      this.metallabourMasterForm.controls['color'].disable();
      this.metallabourMasterForm.controls['color'].setValue('');
      this.metallabourMasterForm.controls['metallabourType'].disable();
      this.metallabourMasterForm.controls['metallabourType'].setValue('');
      this.metallabourMasterForm.controls['metalunitList'].disable();
      this.metallabourMasterForm.controls['metalunitList'].setValue('');
      this.metallabourMasterForm.controls['typecode'].disable();
      this.metallabourMasterForm.controls['typecode'].setValue('');
      this.metallabourMasterForm.controls['category'].disable();
      this.metallabourMasterForm.controls['category'].setValue('');
      this.metallabourMasterForm.controls['subCategory'].disable();
      this.metallabourMasterForm.controls['subCategory'].setValue('');
    }
    else {
      this.stockcodeDisable = false;
      this.viewDisable1 = false;
      this.metallabourMasterForm.controls['stock_code'].enable();
      this.metallabourMasterForm.controls['color'].enable();
      this.metallabourMasterForm.controls['metallabourType'].enable();
      this.metallabourMasterForm.controls['metalunitList'].enable();
      this.metallabourMasterForm.controls['typecode'].enable();
      this.metallabourMasterForm.controls['karat'].enable();
      this.metallabourMasterForm.controls['subCategory'].enable();
      this.metallabourMasterForm.controls['category'].enable();

    }
  }

  onforongrossOnlyChange(event: any) {

    if (event.checked === true) {
      this.brandDisable = true;
      this.metallabourMasterForm.controls['brand'].disable();
      this.metallabourMasterForm.controls['brand'].setValue('');
    }
    else
    {
      this.brandDisable = false;
      this.metallabourMasterForm.controls['brand'].enable();
    }
  }

  DiaCostRatekeyupvalue(e: any) {
    console.log(e);
    this.displayDiaCostRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  DiaSellingRatekeyupvalue(e: any) {
    console.log(e)
    this.displayDiaSellingRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  DiaCtWtFromkeyupvalue(e: any) {
    console.log(e);
    this.displayDiaCtWtFrom = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // DiaCtWtTokeyupvalue(e: any) {
  //   console.log(e);
  //   this.displayDiaCtWtTo = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }

  MetalCostRatekeyupvalue(e: any) {
    console.log(e);
    this.displayMetalCostRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  MetalSellingRatekeyupvalue(e: any) {
    console.log(e);
    this.displayMetalSellingRate = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  MetalWtFromkeyupvalue(e: any) {
    console.log(e);
    this.displayMetalWtFrom = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  MetalWtTokeyupvalue(e: any) {
    console.log(e);
    this.displayMetalWtTo = e.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  
  // onweightto(event: any, data: String) {
  //   let wtf = this.metallabourMasterForm.value.wtFrom;
  //   let wtt = this.metallabourMasterForm.value.wtTo;
  //   if (data != 'wtFrom') {
  //     if (wtf > wtt) {
  //       Swal.fire({
  //         title: event.message || 'Weight From should be lesser than Weight To',
  //         text: '',
  //         icon: 'error',
  //         confirmButtonColor: '#336699',
  //         confirmButtonText: 'Ok'
  //       })
  //       this.metallabourMasterForm.controls.wtTo.setValue('');
  //     }
    
  //   }
  // }

  onweightto(event: any, data: string) {
    // Retrieve the values of Wt From and Wt To from the form
    const wtf: number = parseFloat(this.metallabourMasterForm.value.wtFrom);
    const wtt: number = parseFloat(this.metallabourMasterForm.value.wtTo);
  
    // Check if the data parameter is not 'wtfrom'
    if (data !== 'wtfrom') {
      // Check if Wt From is greater than Wt To
      if (wtf > wtt) {
        // Display an error message
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        });
  
        // Clear the value of Wt To input field
        this.metallabourMasterForm.controls.wtTo.setValue('');
      }
    }
  }
  

  //  onCtweighttto(event: any, data: String) {
  //   let Ctwtf = this.diamondlabourMasterForm.value.ctWtFrom;
  //   let Ctwtt = this.diamondlabourMasterForm.value.ctWtTo;
  //   if (data != 'Ctwtfrom') {
  //     if (Ctwtf > Ctwtt) {
  //       Swal.fire({
  //         title: event.message || 'Weight From should be lesser than Weight To',
  //         text: '',
  //         icon: 'error',
  //         confirmButtonColor: '#336699',
  //         confirmButtonText: 'Ok'
  //       })
  //       this.diamondlabourMasterForm.controls.ctWtTo.setValue('');
  //     }
  //   }


  // }

  onCtweighttto(event: any, data: string) {
    // Retrieve the values of Ct Wt From and Ct Wt To from the form
    const Ctwtf: number = parseFloat(this.diamondlabourMasterForm.value.ctWtFrom);
    const Ctwtt: number = parseFloat(this.diamondlabourMasterForm.value.ctWtTo);
  
    // Check if the data parameter is not 'Ctwtfrom'
    if (data !== 'Ctwtfrom') {
      // Check if Ct Wt From is greater than Ct Wt To
      if (Ctwtf > Ctwtt) {
        // Display an error message
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        });
  
        // Clear the value of Ct Wt To input field
        this.diamondlabourMasterForm.controls.ctWtTo.setValue('');
      }
    }
  }
  

  onSizeto(event: any, data: string) {

    // Retrieve the values of Ct Wt From and Ct Wt To from the form
    const Szwtf: number = parseFloat(this.diamondlabourMasterForm.value.size_from);
    const Szwtt: number = parseFloat(this.diamondlabourMasterForm.value.size_to);

    console.log(Szwtf);
    console.log(Szwtt);

  
    // Check if the data parameter is not 'Ctwtfrom'
    if (data !== 'sizefrom') {
      // Check if Ct Wt From is greater than Ct Wt To
      if (Szwtf > Szwtt) {
        // Display an error message
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        });
  
        // Clear the value of Ct Wt To input field
        this.diamondlabourMasterForm.controls.size_to.setValue('');
      }
    }
  }
  

  unitSelected() {
    console.log(' Hi' + this.unitList);
    this.metallabourMasterForm.get('metalunitList')?.valueChanges.subscribe((selectedLabourType) => {
      const settingTypeControl = this.metallabourMasterForm.get('metalunitList');
      const methodControl = this.metallabourMasterForm.get('onGrossWt');
      if (selectedLabourType === 'Grams') {
        this.grossWt = false;

      } else {
        this.grossWt = true;
        this.metallabourMasterForm.controls.onGrossWt.setValue(false);
      }
      console.log(this.unitList);
    });
  }

  WtcodeEnabled() {
    if (this.metallabourMasterForm.value.wtFrom == '') {
      this.codeEnable1 = true;
    }
    else {
      this.codeEnable1 = false;
    }
  }

  CtWtcodeEnabled() {
    if (this.diamondlabourMasterForm.value.ctWtFrom == '') {
      this.codeEnable2 = true;
    }
    else {
      this.codeEnable2 = false;
    }

  }

  salesChange(data: any) {
    console.log(data);

    if (data == 'metalSelling') {
      this.viewsellingrateMetal = true;
      this.viewsellingMetal = false;
      this.metallabourMasterForm.controls.metalselling_rate.setValue('');
    } else if (data == 'metalselling_rate') {
      this.viewsellingMetal = true;
      this.viewsellingrateMetal = false;
      this.metallabourMasterForm.controls.metalSelling.setValue('');
    } else {
      this.viewsellingMetal = false;
      this.viewsellingrateMetal = false;
    }

  }

  salesChangesDia(data: any) {
    console.log(data);

    if (data == 'selling') {
      this.viewsellingrate = true;
      this.viewselling = false;
      this.diamondlabourMasterForm.controls.selling_rate.setValue('');
    } else if (data == 'selling_rate') {
      this.viewselling = true;
      this.viewsellingrate = false;
      this.diamondlabourMasterForm.controls.selling.setValue('');
    } else {
      this.viewselling = false;
      this.viewsellingrate = false;
    }
    
  }


  // onCtweighttto(event: any) {
  //   if (this.diamondlabourMasterForm.value.ctWtFrom < this.diamondlabourMasterForm.value.ctWtTo) {
  //     Swal.fire({
  //       title: event.message || 'Ct Weight From should be lesser than Weight To',
  //       text: '',
  //       icon: 'error',
  //       confirmButtonColor: '#336699',
  //       confirmButtonText: 'Ok'
  //     })
  //   }
  // }


}
