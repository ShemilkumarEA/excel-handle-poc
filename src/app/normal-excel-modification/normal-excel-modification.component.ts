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
  sheetNames: string[] = ['Invoice Info'];

  constructor(public httpClient: HttpClient) { }

  ngOnInit(): void {
    // this.getData();
  }

  getData(): void {
    this.httpClient.get('https://random-data-api.com/api/appliance/random_appliance?size=10')
      .subscribe((res: any) => {
        let temp: any[] = [];
        let sheets: string[] = [];
        temp.push(Object.keys(res[0]));
        for (let r of res) {
          temp.push(Object.values(r));
          if (!sheets.includes(r['brand'])) {
            sheets.push(r['brand'])
          }
        }
        this.data['Invoice Info'] = temp;
        // this.sheetNames = sheets;
        console.log(this.data);

        this.isFetched = true;
      })
  }

  onSave(event: any) {
    console.log(event);
    this.data['Invoice Info'] = event.data;
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Get the first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Convert the sheet to JSON
      const data = <any[][]>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.data = [];
      this.data['Invoice Info'] = data;
      this.isFetched = true;
      this.excelLoaded = true

    };
    reader.readAsBinaryString(target.files[0]);
  }

  onScroll(event: any): void {
    if (this.stopFetching) return;
    this.httpClient.get('https://random-data-api.com/api/appliance/random_appliance?size=10')
      .subscribe((res: any) => {
        let temp = this.data['Invoice Info'];
        for (let r of res) {
          temp.push(Object.values(r));
        }
        this.data['Invoice Info'] = temp;
        this.eventEmitter.next({ id: "Source", type: "new_data" });
        this.stopFetching = true;
      })
  }

  handleSave() {
    this.eventEmitter.next({ id: 'Source', type: 'save' });
    this.isEditing = false;
  }

  handleCancel() {
    this.eventEmitter.next({ id: 'Source', type: 'cancel' });
    this.isEditing = false;
  }

  handleDownload() {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data['Invoice Info']);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice Info');
    XLSX.writeFile(wb, 'Invoice_Info.xlsx');
  }

}
