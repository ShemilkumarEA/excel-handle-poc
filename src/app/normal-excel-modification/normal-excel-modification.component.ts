import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-normal-excel-modification',
  templateUrl: './normal-excel-modification.component.html',
  styleUrls: ['./normal-excel-modification.component.scss']
})
export class NormalExcelModificationComponent {
  title = 'xls-angular-poc';
  data: any = {};
  isFetched = false;
  stopFetching = false;
  eventEmitter = new BehaviorSubject<any>({});
  isEditing = false;
  excelLoaded: boolean = false;
  sheetNames: string[] = [];
  comments: any;

  constructor(public httpClient: HttpClient) { }

  ngOnInit(): void {
    // this.getData();
  }

  // getData(): void {
  //   this.httpClient.get('https://random-data-api.com/api/appliance/random_appliance?size=10')
  //     .subscribe((res: any) => {
  //       let temp: any[] = [];
  //       let sheets: string[] = [];
  //       temp.push(Object.keys(res[0]));
  //       for (let r of res) {
  //         temp.push(Object.values(r));
  //         if (!sheets.includes(r['brand'])) {
  //           sheets.push(r['brand'])
  //         }
  //       }
  //       this.data['Sheet_1'] = temp;
  //       // this.sheetNames = sheets;
  //       console.log(this.data);

  //       this.isFetched = true;
  //     })
  // }

  onSave(event: any) {
    console.log(event);
    this.data[event.sheet] = event.data;
    this.comments = event.comments;
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Get the first sheet
      this.data = [];

      if (wb.SheetNames.length > 0) {

        wb.SheetNames.forEach(sheetName => {
          const wsname: string = sheetName;
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          const data = <any[][]>XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.data[sheetName] = data;
          this.sheetNames.push(sheetName);
        });

        console.log(this.data);
        this.isFetched = true;
        this.excelLoaded = true
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  extractComments(wb: XLSX.WorkBook): any {
    const allData = wb.Sheets[wb.SheetNames[0]];
    const comments: any = {};

    for (const [key, value] of Object.entries(allData)) {
      // console.log(key, value);
      if (value['c']) {
        console.log(key, value['c'][0].t);
      }
    }

    // for (let key in allData) {
    //   if (allData.hasOwnProperty(key)) {
    //     // console.log(key, allData[key]);
    //     if (allData[key].hasOwnProperty('c')) {
    //       console.log(key, allData[key].c[0].t);
    //     }
    //   }
    // }

    // wb.SheetNames.forEach(sheetName => {
    //   const ws = wb.Sheets[sheetName];
    //   comments[sheetName] = {};
    //   if (ws && ws['!comments']) {
    //     ws['!comments'].forEach((comment: any) => {
    //       const cellAddress = comment.ref;
    //       if (!comments[sheetName][cellAddress]) {
    //         comments[sheetName][cellAddress] = [];
    //       }
    //       comments[sheetName][cellAddress].push(comment.t);
    //     });
    //   }
    // });
    return comments;
  }

  // onScroll(event: any): void {
  //   if (this.stopFetching) return;
  //   this.httpClient.get('https://random-data-api.com/api/appliance/random_appliance?size=10')
  //     .subscribe((res: any) => {
  //       let temp = this.data['Sheet_1'];
  //       for (let r of res) {
  //         temp.push(Object.values(r));
  //       }
  //       this.data['Sheet_1'] = temp;
  //       this.eventEmitter.next({ id: "Source", type: "new_data" });
  //       this.stopFetching = true;
  //     })
  // }

  handleSave() {
    this.eventEmitter.next({ id: 'Source', type: 'save' });
    this.isEditing = false;
  }

  handleCancel() {
    // this.eventEmitter.next({ id: 'Source', type: 'cancel' });
    this.isEditing = false;
  }

  handleDownload() {

    if (!this.data) return;

    this.eventEmitter.next({ id: 'Source', type: 'save' });
    const sheetNames = Object.keys(this.data);

    let wb: XLSX.WorkBook = XLSX.utils.book_new();

    sheetNames.forEach(((sheetName: any) => {

      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data[sheetName]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      if (ws) {

        for (let comment of this.comments[sheetName]) {
          const cellAddress = this.getColumnLetter(comment.xPosition) + (comment.yPosition + 1); // Convert to 1-based index for row

          if (!ws[cellAddress]) ws[cellAddress] = {}; // Create cell if it does not exist
          if (!ws[cellAddress].c) ws[cellAddress].c = []; // Initialize comments array if it does not exist

          ws[cellAddress].c.push({ a: "Shemil", t: comment.comment });
        }
      }
    }));

    XLSX.writeFile(wb, 'example.xlsx');
  }

  onDownload(event: any) { }

  getColumnLetter(colIndex: number) {
    let letter = '';
    let tempIndex = colIndex;
    while (tempIndex >= 0) {
      letter = String.fromCharCode((tempIndex % 26) + 65) + letter;
      tempIndex = Math.floor(tempIndex / 26) - 1;
    }
    return letter;
  };


  handleUploadFile() { }
}
