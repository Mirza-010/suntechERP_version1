import { Component, Input, OnInit } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ProductionEntryDetailsComponent } from "./production-entry-details/production-entry-details.component";

@Component({
  selector: "app-production-mfg",
  templateUrl: "./production-mfg.component.html",
  styleUrls: ["./production-mfg.component.scss"],
})
export class ProductionMfgComponent implements OnInit {
  columnhead: any[] = [
    "No",
    "Job#",
    "Sub Job",
    "Design",
    "Pcs",
    "Metal",
    "Stone",
    "Gross Wt",
    "St Pcs",
    "Process",
  ];
  columnheads: any[] = [""];
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem("username");
  branchCode?: String;
  yearMonth?: String;

  private subscriptions: Subscription[] = [];

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openproductionentrydetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      ProductionEntryDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
  }

  productionFrom: FormGroup = this.formBuilder.group({
    voctype: [""],
    vocdate: [""],
    vocno: [""],
    enteredby: [""], // No
    currency: [""],
    currencyrate: [""],
    basecurrency: [""],
    basecurrencyrate: [""],
    time: [""],
    metalrate: [""],
    metalratetype: [""],
    branchto: [""], // No
    narration: [""],
  });

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.productionFrom.controls.startdate.setValue(new Date(date));
    }
  }

  removedata() {
    this.tableData.pop();
  }
  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.productionFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "JobProductionMaster/InsertJobProductionMaster";
    let postData = {
      "MID": 0,
      "VOCTYPE": this.productionFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.productionFrom.value.vocno,
      "VOCDATE": this.productionFrom.value.vocno,
      "YEARMONTH":  this.yearMonth,
      "DOCTIME": "2023-10-17T12:41:20.126Z",
      "CURRENCY_CODE": this.productionFrom.value.currency,
      "CURRENCY_RATE": this.productionFrom.value.currencyrate,
      "METAL_RATE_TYPE": this.productionFrom.value.metalratetype,
      "METAL_RATE": this.productionFrom.value.metalrate,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN":  this.productionFrom.value.enteredby,
      "REMARKS": this.productionFrom.value.narration,
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "STONE_INCLUDE": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": this.productionFrom.value.basecurrency,
      "BASE_CONV_RATE": this.productionFrom.value.basecurrencyrate,
      "PRINT_COUNT": 0,
      "INTER_BRANCH": this.productionFrom.value.branchto,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-17T12:41:20.126Z",
      "JOB_PRODUCTION_SUB_DJ": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DT_VOCNO": 0,
          "DT_VOCTYPE": "string",
          "DT_VOCDATE": "2023-10-17T12:41:20.126Z",
          "DT_BRANCH_CODE": "string",
          "DT_NAVSEQNO": "string",
          "DT_YEARMONTH": "string",
          "JOB_NUMBER": "string",
          "JOB_DATE": "2023-10-17T12:41:20.126Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": "string",
          "UNQ_DESIGN_ID": "string",
          "DESIGN_CODE": "string",
          "PART_CODE": "string",
          "DIVCODE": "string",
          "PREFIX": "string",
          "STOCK_CODE": "string",
          "STOCK_DESCRIPTION": "string",
          "SET_REF": "string",
          "KARAT_CODE": "string",
          "MULTI_STOCK_CODE": true,
          "JOB_PCS": 0,
          "GROSS_WT": 0,
          "METAL_PCS": 0,
          "METAL_WT": 0,
          "STONE_PCS": 0,
          "STONE_WT": 0,
          "LOSS_WT": 0,
          "NET_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "string",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": 0,
          "METAL_GRM_RATELC": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTLC": 0,
          "MAKING_RATEFC": 0,
          "MAKING_RATELC": 0,
          "MAKING_AMOUNTFC": 0,
          "MAKING_AMOUNTLC": 0,
          "STONE_RATEFC": 0,
          "STONE_RATELC": 0,
          "STONE_AMOUNTFC": 0,
          "STONE_AMOUNTLC": 0,
          "LAB_AMOUNTFC": 0,
          "LAB_AMOUNTLC": 0,
          "RATEFC": 0,
          "RATELC": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "PROCESS_CODE": "string",
          "PROCESS_NAME": "string",
          "WORKER_CODE": "string",
          "WORKER_NAME": "string",
          "IN_DATE": "2023-10-17T12:41:20.126Z",
          "OUT_DATE": "2023-10-17T12:41:20.126Z",
          "TIME_TAKEN_HRS": 0,
          "COST_CODE": "string",
          "WIP_ACCODE": "string",
          "STK_ACCODE": "string",
          "SOH_ACCODE": "string",
          "PROD_PROC": "string",
          "METAL_DIVISION": "string",
          "PRICE1PER": "string",
          "PRICE2PER": "string",
          "PRICE3PER": "string",
          "PRICE4PER": "string",
          "PRICE5PER": "string",
          "LOCTYPE_CODE": "string",
          "WASTAGE_WT": 0,
          "WASTAGE_AMTFC": 0,
          "WASTAGE_AMTLC": 0,
          "PICTURE_NAME": "string",
          "SELLINGRATE": 0,
          "LAB_ACCODE": "string",
          "CUSTOMER_CODE": "string",
          "OUTSIDEJOB": true,
          "METAL_LABAMTFC": 0,
          "METAL_LABAMTLC": 0,
          "METAL_LABACCODE": "string",
          "SUPPLIER_REF": "string",
          "TAGLINES": "string",
          "SETTING_CHRG": 0,
          "POLISH_CHRG": 0,
          "RHODIUM_CHRG": 0,
          "LABOUR_CHRG": 0,
          "MISC_CHRG": 0,
          "SETTING_ACCODE": "string",
          "POLISH_ACCODE": "string",
          "RHODIUM_ACCODE": "string",
          "LABOUR_ACCODE": "string",
          "MISC_ACCODE": "string",
          "WAST_ACCODE": "string",
          "REPAIRJOB": 0,
          "PRICE1FC": 0,
          "PRICE2FC": 0,
          "PRICE3FC": 0,
          "PRICE4FC": 0,
          "PRICE5FC": 0,
          "BASE_CONV_RATE": 0,
          "FROM_STOCK_CODE": "string",
          "TO_STOCK_CODE": "string",
          "JOB_PURITY": 0,
          "LOSS_PUREWT": 0,
          "PUDIFF": 0,
          "STONEDIFF": 0,
          "CHARGABLEWT": 0,
          "BARNO": "string",
          "LOTNUMBER": "string",
          "TICKETNO": "string",
          "PROD_PER": 0,
          "PURITY_PER": 0,
          "DESIGN_TYPE": "string",
          "BASE_CURR_RATE": 0
        }
      ],
      "JOB_PRODUCTION_DETAIL_DJ": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "string",
          "VOCDATE": "2023-10-17T12:41:20.127Z",
          "BRANCH_CODE": "string",
          "JOB_NUMBER": "string",
          "JOB_DATE": "2023-10-17T12:41:20.127Z",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": "string",
          "UNQ_DESIGN_ID": "string",
          "DESIGN_CODE": "string",
          "DIVCODE": "string",
          "PREFIX": "string",
          "STOCK_CODE": "string",
          "STOCK_DESCRIPTION": "string",
          "SET_REF": "string",
          "KARAT_CODE": "string",
          "MULTI_STOCK_CODE": true,
          "JOB_PCS": 0,
          "GROSS_WT": 0,
          "METAL_PCS": 0,
          "METAL_WT": 0,
          "STONE_PCS": 0,
          "STONE_WT": 0,
          "LOSS_WT": 0,
          "NET_WT": 0,
          "PURITY": 0,
          "PURE_WT": 0,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "string",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": 0,
          "METAL_GRM_RATELC": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTLC": 0,
          "MAKING_RATEFC": 0,
          "MAKING_RATELC": 0,
          "MAKING_AMOUNTFC": 0,
          "MAKING_AMOUNTLC": 0,
          "STONE_RATEFC": 0,
          "STONE_RATELC": 0,
          "STONE_AMOUNTFC": 0,
          "STONE_AMOUNTLC": 0,
          "LAB_AMOUNTFC": 0,
          "LAB_AMOUNTLC": 0,
          "RATEFC": 0,
          "RATELC": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "PROCESS_CODE": "string",
          "PROCESS_NAME": "string",
          "WORKER_CODE": "string",
          "WORKER_NAME": "string",
          "IN_DATE": "2023-10-17T12:41:20.127Z",
          "OUT_DATE": "2023-10-17T12:41:20.127Z",
          "TIME_TAKEN_HRS": 0,
          "COST_CODE": "string",
          "WIP_ACCODE": "string",
          "STK_ACCODE": "string",
          "SOH_ACCODE": "string",
          "PROD_PROC": "string",
          "METAL_DIVISION": "string",
          "PRICE1PER": "string",
          "PRICE2PER": "string",
          "PRICE3PER": "string",
          "PRICE4PER": "string",
          "PRICE5PER": "string",
          "LOCTYPE_CODE": "string",
          "WASTAGE_WT": 0,
          "WASTAGE_AMTFC": 0,
          "WASTAGE_AMTLC": 0,
          "PICTURE_NAME": "string",
          "SELLINGRATE": 0,
          "CUSTOMER_CODE": "string",
          "OUTSIDEJOB": true,
          "LAB_ACCODE": "string",
          "METAL_LABAMTFC": 0,
          "METAL_LABAMTLC": 0,
          "METAL_LABACCODE": "string",
          "SUPPLIER_REF": "string",
          "TAGLINES": "string",
          "SETTING_CHRG": 0,
          "POLISH_CHRG": 0,
          "RHODIUM_CHRG": 0,
          "LABOUR_CHRG": 0,
          "MISC_CHRG": 0,
          "SETTING_ACCODE": "string",
          "POLISH_ACCODE": "string",
          "RHODIUM_ACCODE": "string",
          "LABOUR_ACCODE": "string",
          "MISC_ACCODE": "string",
          "WAST_ACCODE": "string",
          "REPAIRJOB": 0,
          "PRICE1FC": 0,
          "PRICE2FC": 0,
          "PRICE3FC": 0,
          "PRICE4FC": 0,
          "PRICE5FC": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "string",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "YEARMONTH": "string",
          "BASE_CONV_RATE": 0,
          "OTH_STONE_WT": 0,
          "OTH_STONE_AMT": 0,
          "HANDLING_ACCODE": "string",
          "FROM_STOCK_CODE": "string",
          "TO_STOCK_CODE": "string",
          "JOB_PURITY": 0,
          "LOSS_PUREWT": 0,
          "PUDIFF": 0,
          "STONEDIFF": 0,
          "CHARGABLEWT": 0,
          "BARNO": "string",
          "LOTNUMBER": "string",
          "TICKETNO": "string",
          "PROD_PER": 0,
          "PURITY_PER": 0,
          "DESIGN_TYPE": "string",
          "D_REMARKS": "string",
          "BARCODEDQTY": 0,
          "BARCODEDPCS": 0
        }
      ],
      "JOB_PRODUCTION_STNMTL_DJ": [
        {
          "VOCNO": 0,
          "VOCTYPE": "string",
          "VOCDATE": "2023-10-17T12:41:20.127Z",
          "JOB_NUMBER": "string",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": "string",
          "BRANCH_CODE": "string",
          "DESIGN_CODE": "string",
          "METALSTONE": "string",
          "DIVCODE": "string",
          "STOCK_CODE": "string",
          "STOCK_DESCRIPTION": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "SIZE": "string",
          "PCS": 0,
          "GROSS_WT": 0,
          "RATELC": 0,
          "RATEFC": 0,
          "AMOUNT": 0,
          "PROCESS_CODE": "string",
          "WORKER_CODE": "string",
          "UNQ_DESIGN_ID": "string",
          "REFMID": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "WASTAGE_QTY": 0,
          "WASTAGE_PER": 0,
          "WASTAGE_AMTFC": 0,
          "WASTAGE_AMTLC": 0,
          "CURRENCY_CODE": "string",
          "CURRENCY_RATE": 0,
          "YEARMONTH": "string",
          "LOSS_QTY": 0,
          "LABOUR_CODE": "string",
          "LAB_RATE": 0,
          "LAB_AMTLC": 0,
          "LAB_AMTFC": 0,
          "LAB_ACCODE": "string",
          "SELLINGRATE": 0,
          "SELLINGVALUE": 0,
          "CUSTOMER_CODE": "string",
          "PUREWT": 0,
          "PURITY": 0,
          "SQLID": "string",
          "SIEVE": "string",
          "SRNO": 0,
          "MAIN_STOCK_CODE": "string",
          "STONE_WT": 0,
          "NET_WT": 0,
          "CONSIGNMENT": 0,
          "LOCTYPE_CODE": "string",
          "HANDLING_CHARGEFC": 0,
          "HANDLING_CHARGELC": 0,
          "HANDLING_RATEFC": 0,
          "HANDLING_RATELC": 0,
          "PRICECODE": "string",
          "SUB_STOCK_CODE": "string",
          "SIEVE_SET": "string",
          "KARAT_CODE": "string",
          "PROCESS_TYPE": "string",
          "SOH_ACCODE": "string",
          "STK_ACCODE": "string",
          "OTHER_ATTR": "string",
          "PUREWTTEMP": 0
        }
      ],
      "JOB_PRODUCTION_LABCHRG_DJ": [
        {
          "REFMID": 0,
          "BRANCH_CODE": "string",
          "YEARMONTH": "string",
          "VOCTYPE": "string",
          "VOCNO": 0,
          "SRNO": 0,
          "JOB_NUMBER": "string",
          "STOCK_CODE": "string",
          "UNQ_JOB_ID": "string",
          "METALSTONE": "string",
          "DIVCODE": "string",
          "PCS": 0,
          "GROSS_WT": 0,
          "LABOUR_CODE": "string",
          "LAB_RATE": 0,
          "LAB_ACCODE": "string",
          "LAB_AMTFC": 0,
          "UNITCODE": "string",
          "DIVISION": "string",
          "WASTAGE_PER": 0,
          "WASTAGE_QTY": 0,
          "WASTAGE_AMT": 0,
          "WASTAGE_RATE": 0,
          "KARAT_CODE": "string"
        }
      ],
      "JOB_PRODUCTION_METALRATE_DJ": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "string",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "DIVISION_CODE": "string",
          "SYSTEM_DATE": "2023-10-17T12:41:20.127Z",
          "CURRENCY_CODE": "string",
          "CURRENCY_RATE": 0,
          "CONV_FACTOR": 0
        }
      ]
    }
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  setFormValues() {
    if (!this.content) return;
    console.log(this.content);

    this.productionFrom.controls.voctype.setValue(this.content.VOCTYPE);
    this.productionFrom.controls.vocno.setValue(this.content.VOCNO);
    this.productionFrom.controls.vocdate.setValue(this.content.VOCDATE);
    this.productionFrom.controls.currency.setValue(this.content.CURRENCY_CODE);
    this.productionFrom.controls.currencyrate.setValue(
      this.content.CURRENCY_RATE
    );
    this.productionFrom.controls.basecurrency.setValue(
      this.content.BASE_CURRENCY
    );
    this.productionFrom.controls.basecurrencyrate.setValue(
      this.content.BASE_CURR_RATE
    );
    this.productionFrom.controls.time.setValue(this.content.TIME_TAKEN_HRS);
    this.productionFrom.controls.metalrate.setValue(this.content.METAL_RATE);
    this.productionFrom.controls.metalratetype.setValue(
      this.content.METAL_RATE_TYPE
    );
    this.productionFrom.controls.narration.setValue(this.content.REMARKS);
  }

  update() {
    if (this.productionFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API =
      "JobProductionMaster/UpdateJobProductionMaster/" +
      this.productionFrom.value.branchCode +
      this.productionFrom.value.voctype +
      this.productionFrom.value.vocno +
      this.productionFrom.value.vocdate;
    let postData = {
      MID: 0,
      VOCTYPE: this.productionFrom.value.voctype || "",
      BRANCH_CODE: this.branchCode,
      VOCNO: this.productionFrom.value.vocno || "",
      VOCDATE: this.productionFrom.value.vocdate || "",
      YEARMONTH: "string",
      DOCTIME: "2023-10-13T06:02:53.879Z",
      CURRENCY_CODE: this.productionFrom.value.currency || "",
      CURRENCY_RATE: this.productionFrom.value.currencyrate || "",
      METAL_RATE_TYPE: this.productionFrom.value.metalratetype || "",
      METAL_RATE: this.productionFrom.value.metalrate || "",
      TOTAL_PCS: 0,
      TOTAL_GROSS_WT: 0,
      TOTAL_METAL_PCS: 0,
      TOTAL_METAL_WT: 0,
      TOTAL_METAL_AMTFC: 0,
      TOTAL_METAL_AMTLC: 0,
      TOTAL_STONE_PCS: 0,
      TOTAL_STONE_WT: 0,
      TOTAL_STONE_AMTFC: 0,
      TOTAL_STONE_AMTLC: 0,
      TOTAL_NET_WT: 0,
      TOTAL_LOSS_WT: 0,
      TOTAL_LABOUR_AMTFC: 0,
      TOTAL_LABOUR_AMTLC: 0,
      TOTAL_AMOUNTFC: 0,
      TOTAL_AMOUNTLC: 0,
      TOTAL_WASTAGE_AMTLC: 0,
      TOTAL_WASTAGE_AMTFC: 0,
      SMAN: "string",
      REMARKS: this.productionFrom.value.narration || "",
      NAVSEQNO: 0,
      FIX_UNFIX: true,
      STONE_INCLUDE: true,
      AUTOPOSTING: true,
      POSTDATE: "string",
      BASE_CURRENCY: this.productionFrom.value.basecurrency || "",
      BASE_CURR_RATE: this.productionFrom.value.basecurrencyrate || "",
      BASE_CONV_RATE: 0,
      PRINT_COUNT: 0,
      INTER_BRANCH: "string",
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      SYSTEM_DATE: "2023-10-13T06:02:53.879Z",
      UNIQUEID: 0,
      SRNO: 0,
      DT_VOCNO: 0,
      DT_VOCTYPE: "string",
      DT_VOCDATE: "2023-10-13T06:02:53.879Z",
      DT_BRANCH_CODE: "string",
      DT_NAVSEQNO: "string",
      DT_YEARMONTH: "string",
      JOB_NUMBER: "string",
      JOB_DATE: "2023-10-13T06:02:53.879Z",
      JOB_SO_NUMBER: 0,
      UNQ_JOB_ID: "string",
      JOB_DESCRIPTION: "string",
      UNQ_DESIGN_ID: "string",
      DESIGN_CODE: "string",
      PART_CODE: "string",
      DIVCODE: "string",
      PREFIX: "string",
      STOCK_CODE: "string",
      STOCK_DESCRIPTION: "string",
      SET_REF: "string",
      KARAT_CODE: "string",
      MULTI_STOCK_CODE: true,
      JOB_PCS: 0,
      GROSS_WT: 0,
      METAL_PCS: 0,
      METAL_WT: 0,
      STONE_PCS: 0,
      STONE_WT: 0,
      LOSS_WT: 0,
      NET_WT: 0,
      PURITY: 0,
      PURE_WT: 0,
      RATE_TYPE: "string",
      METAL_GRM_RATEFC: 0,
      METAL_GRM_RATELC: 0,
      METAL_AMOUNTFC: 0,
      METAL_AMOUNTLC: 0,
      MAKING_RATEFC: 0,
      MAKING_RATELC: 0,
      MAKING_AMOUNTFC: 0,
      MAKING_AMOUNTLC: 0,
      STONE_RATEFC: 0,
      STONE_RATELC: 0,
      STONE_AMOUNTFC: 0,
      STONE_AMOUNTLC: 0,
      LAB_AMOUNTFC: 0,
      LAB_AMOUNTLC: 0,
      RATEFC: 0,
      RATELC: 0,
      AMOUNTFC: 0,
      AMOUNTLC: 0,
      PROCESS_CODE: "string",
      PROCESS_NAME: "string",
      WORKER_CODE: "string",
      WORKER_NAME: "string",
      IN_DATE: "2023-10-13T06:02:53.879Z",
      OUT_DATE: "2023-10-13T06:02:53.879Z",
      TIME_TAKEN_HRS: this.productionFrom.value.time || "",
      COST_CODE: "string",
      WIP_ACCODE: "string",
      STK_ACCODE: "string",
      SOH_ACCODE: "string",
      PROD_PROC: "string",
      METAL_DIVISION: "string",
      PRICE1PER: "string",
      PRICE2PER: "string",
      PRICE3PER: "string",
      PRICE4PER: "string",
      PRICE5PER: "string",
      LOCTYPE_CODE: "string",
      WASTAGE_WT: 0,
      WASTAGE_AMTFC: 0,
      WASTAGE_AMTLC: 0,
      PICTURE_NAME: "string",
      SELLINGRATE: 0,
      LAB_ACCODE: "string",
      CUSTOMER_CODE: "string",
      OUTSIDEJOB: true,
      METAL_LABAMTFC: 0,
      METAL_LABAMTLC: 0,
      METAL_LABACCODE: "string",
      SUPPLIER_REF: "string",
      TAGLINES: "string",
      SETTING_CHRG: 0,
      POLISH_CHRG: 0,
      RHODIUM_CHRG: 0,
      LABOUR_CHRG: 0,
      MISC_CHRG: 0,
      SETTING_ACCODE: "string",
      POLISH_ACCODE: "string",
      RHODIUM_ACCODE: "string",
      LABOUR_ACCODE: "string",
      MISC_ACCODE: "string",
      WAST_ACCODE: "string",
      REPAIRJOB: 0,
      PRICE1FC: 0,
      PRICE2FC: 0,
      PRICE3FC: 0,
      PRICE4FC: 0,
      PRICE5FC: 0,
      FROM_STOCK_CODE: "string",
      TO_STOCK_CODE: "string",
      JOB_PURITY: 0,
      LOSS_PUREWT: 0,
      PUDIFF: 0,
      STONEDIFF: 0,
      CHARGABLEWT: 0,
      BARNO: "string",
      LOTNUMBER: "string",
      TICKETNO: "string",
      PROD_PER: 0,
      PURITY_PER: 0,
      DESIGN_TYPE: "string",
      OTH_STONE_WT: 0,
      OTH_STONE_AMT: 0,
      HANDLING_ACCODE: "string",
      D_REMARKS: "string",
      BARCODEDQTY: 0,
      BARCODEDPCS: 0,
      METALSTONE: "string",
      COLOR: "string",
      CLARITY: "string",
      SHAPE: "string",
      SIZE: "string",
      PCS: 0,
      AMOUNT: 0,
      REFMID: 0,
      WASTAGE_QTY: 0,
      WASTAGE_PER: 0,
      LOSS_QTY: 0,
      LABOUR_CODE: "string",
      LAB_RATE: 0,
      LAB_AMTLC: 0,
      LAB_AMTFC: 0,
      SELLINGVALUE: 0,
      PUREWT: 0,
      SQLID: "string",
      SIEVE: "string",
      MAIN_STOCK_CODE: "string",
      CONSIGNMENT: 0,
      HANDLING_CHARGEFC: 0,
      HANDLING_CHARGELC: 0,
      HANDLING_RATEFC: 0,
      HANDLING_RATELC: 0,
      PRICECODE: "string",
      SUB_STOCK_CODE: "string",
      SIEVE_SET: "string",
      PROCESS_TYPE: "string",
      OTHER_ATTR: "string",
      PUREWTTEMP: 0,
      UNITCODE: "string",
      DIVISION: "string",
      WASTAGE_AMT: 0,
      WASTAGE_RATE: 0,
      DIVISION_CODE: "string",
      CONV_FACTOR: 0,
      approvalDetails: this.tableData,
    };

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        let API =
          "JobProductionMaster/DeleteJobProductionMaster/" +
          this.productionFrom.value.branchCode +
          this.productionFrom.value.voctype +
          this.productionFrom.value.vocno +
          this.productionFrom.value.vocdate;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  Swal.fire({
                    title: result.message || "Success",
                    text: "",
                    icon: "success",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.productionFrom.reset();
                      this.tableData = [];
                      this.close("reloadMainGrid");
                    }
                  });
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.productionFrom.reset();
                      this.tableData = [];
                      this.close();
                    }
                  });
                }
              } else {
                this.toastr.error("Not deleted");
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
