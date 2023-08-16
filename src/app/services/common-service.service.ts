import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  /** common variables and functions used in all components */
  branchCode: any = localStorage.getItem('userbranch');
  menuTitle: any;
  menuName: any;
  queryParamAPI: any;
  
  /**Apex chart chart settings */
  myChart(ctx: any, arg1: string, labels: string[], cfg: { type: string; data: { datasets: { data: { Sales: number; Taarget: number; PreviousYear: number; }; }[]; }; }, colors: string[], arg5: string): any {
    throw new Error('Method not implemented.');
  }

  constructor(
    private route: ActivatedRoute,
  ) {
  }
  //use: to get menu ModuleName from queryParams
  getModuleName() {
    this.route.queryParams.subscribe((data: any) => {
      this.menuName = data.subMenuName;
    });
    return this.menuName
  }
  //use: to get menu title from queryParams
  getTitleName() {
    this.route.queryParams.subscribe((data: any) => {
      this.menuTitle = data.modulename;
    });
    return this.menuTitle
  }
  getqueryParamAPI() {
    let queryParamAPI
    this.route.queryParams.subscribe((data: any) => {
      queryParamAPI = data.ctrl;
    });
    return queryParamAPI
  }

  /**USE: to get create dynamic colors */
  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  /**Apex chart chart settings */
  drawChart(divClass: any, graphType: any, labels: any, values: any, colors: any, labelTips: any) {
    let options = { indexAxis: 'y', responsive: true, legend: {}, scales: {}, plugins: {} };
    options.legend = {
      align: "start",
      position: "bottom",
    }
    if (graphType == 'pie') {
      labelTips = '';
    } else {
      options.plugins = {
        legend: {
          display: true,
          position: 'bottom',
        }
      }
      options.scales = {
        y: {
          beginAtZero: true
        }
      }

      // colors = colors[0]
    }

    const myChart = new Chart(divClass, {
      type: graphType,
      data: {
        labels: labels,
        datasets: [{
          label: labelTips,
          data: values,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: options
    });

    return myChart;
  }
  /**Apex chart settings to create chart */
  createChart(divClass: any, graphType: any, labels: any, values: any, colors: any, labelTips: any) {
    let options = { indexAxis: 'y', responsive: true, legend: {}, scales: {}, plugins: {} };
    options.legend = {
      align: "start",
      position: "bottom",
    }
    if (graphType == 'pie') {
      labelTips = '';
    } else {
      options.plugins = {
        legend: {
          display: true,
          position: 'bottom',
        }
      }
      options.scales = {
        y: {
          beginAtZero: true
        }
      }

      // colors = colors[0]
    }

    const myChart = new Chart(divClass, {
      type: graphType,
      data: {
        labels: labels,
        datasets: [{
          label: labelTips,
          data: values,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: options
    });

    return myChart;
  }

  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }
  /**purpose: format date */
  formatDate(date: any) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }
  /**purpose: date in order format dd-mm-yy */
  formatDDMMYY(date: any) {
    let day = date.getDate();
    let month = (date.getMonth() > 9 ? date.getMonth() : date.getMonth()) + 1;
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  /**purpose: date in order format dd-mm-yy */
  formatMMDDYY(date: any) {
    let day = date.getDate();
    let month = (date.getMonth() > 9 ? date.getMonth() : date.getMonth()) + 1;
    let year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
  /**purpose: Get a date time as a string, using the ISO standard*/
  formatDateTime(date: any) {
    return date.toISOString()
  }

  /**purpose: to format number with M,K values(eg: 1k,2M) */
  numberFormatter(value: any) {
    if (value >= 1000000) {
      // Convert to millions
      const millions = value / 1000000;
      const decimalPlaces = 2
      const multiplier = Math.pow(10, decimalPlaces);
      const roundedValue = Math.floor(millions * multiplier) / multiplier;
      return roundedValue.toFixed(decimalPlaces) + "M";
    } else if (value >= 1000) {
      // Convert to thousands
      const thousands = value / 1000;
      const decimalPlaces = 1
      const multiplier = Math.pow(10, decimalPlaces);
      const roundedValue = Math.floor(thousands * multiplier) / multiplier;
      return roundedValue.toFixed(decimalPlaces) + "K";
    }
    return value.toString();
  }

  /**purpose: to find average of array */
  avgOfArray(arr: any) {
    const average = arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
    return average
  }

  /**purpose: to find sum of array */
  sumArray(array: any) {
    let sum = 0;
    array.forEach((item: any) => {
      sum += item;
    });
    return Math.trunc(sum);
  }
  /**purpose: to find grossmargin percentage
   * in: GM and Revenue arrays
   * out: gm % value
   */
  getGMPercentage(grossMarginArray: any, revArray: any) {
    let data: any = this.sumArray(grossMarginArray) / this.sumArray(revArray) * 100
    data = Math.trunc(data)
    return data
  }
  /**purpose: calculation of COGS */
  getCOGSvalue(grossMarginArray: any, revArray: any) {
    let data: any = this.sumArray(revArray) - this.sumArray(grossMarginArray)
    data = Math.trunc(data)
    return data
  }
  /**purpose: calculation of COGS */
  getAvgSellPrice(revArray: any, QtySoldArray: any) {
    let data: any = this.sumArray(revArray) / this.sumArray(QtySoldArray)
    data = Math.trunc(data)
    return data
  }
  /** 
   * purpose: export array of data to excelsheet 
   * in: data=[{key:value}]
   * out: excelsheet
  */
  exportExcel(data: any, excelName: string) {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
      Sheets: {
        testingSheet: ws,
      },
      SheetNames: ["testingSheet"],
    };
    const excelbuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blobData = new Blob([excelbuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(blobData, excelName);
  }

  model: any = {}
  getTooltipDescription() {
    this.model.revenue = 'Revenue refers to the total amount of money that a company or organization earns from its business activities, such as selling goods or services, over a specific period of time.'
    this.model.grossMargin = "Gross margin is a financial metric that represents the difference between a company's net sales revenue and the cost of goods sold (COGS)"
    this.model.grossMarginPerc = "It is calculated by subtracting the COGS from the total revenue and then dividing the result by the total revenue. The resulting percentage is the gross margin percentage."
    this.model.stockValue = "Stock value in inventory refers to the total monetary value of the goods or products held in a company's inventory at a particular point in time. It represents the cost of the inventory that a company has on hand, including raw materials, work-in-progress items, and finished goods."
    this.model.AverageSellingPrice = "Average Selling Price (ASP) refers to the average price at which a company sells its products or services to customers. It is calculated by dividing the total revenue generated by the total number of units sold during a specific period."
    this.model.stor = `Stock Turnover Ratio, also known as inventory turnover ratio, is a financial metric used to measure the number of times a company sells and replaces its inventory over a specific period. It is calculated by dividing the cost of goods sold (COGS) by the average value of inventory during the period.
    The formula for the Stock Turnover Ratio is:
    Stock Turnover Ratio = Cost of Goods Sold / Average Inventory`
    this.model.salesUnit = 'Represent a unit of measure for the items being sold'
    this.model.numberOfCustomers = 'Total Number of customers received across locations'
    this.model.ON_HAND_INVENTORY_AMOUNT = 'Total value of goods or products that a business currently has in its possession and available for sale or use.'
    this.model.ON_HAND_INVENTORY_QUANTITY = 'Total quantity and value of goods that a business currently has in stock and available for sale'
    this.model.QUANTITY_SOLD = 'Total number of units or items of a product that have been sold by a business during a specific period of time.'
    this.model.COGS = 'COGS stands for "Cost of Goods Sold" and is an accounting term that refers to the direct costs associated with producing or purchasing the products that a business sells. '
    this.model.PY = 'Previous year'
    this.model.CY = 'Current Year'
    this.model.PY_TARGET = 'Previous Year Target'
    this.model.CY_TARGET = 'Current Year Target'
    this.model.INC_DEC = 'Change'
    this.model.INC_DEC_PERC = '% of Change'
    this.model.TOTAL_INVOICE = 'Total amount that a customer is charged for a product or service'
    this.model.SELL_THROUGH_RATE = 'Sell-through rate (STR) is a retail metric that measures the percentage of inventory that is sold during a specific period of time. It is a measure of how efficiently a store is selling its products and is calculated by dividing the total number of products sold by the initial inventory quantity.'
    this.model.REVENUE_PER_CUSTOMER = 'Revenue per Customer'
    this.model.SALES_QSOLD = 'Quantity sold refers to the total number of units or items of a product that have been sold by a business during a specific period of time. It is a measure of the sales volume and represents the amount of product that has been purchased by customers.'
    return this.model
  }
}
