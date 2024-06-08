import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {

  title = 'excel-viewer';
  data: any = {};
  isFetched = false;
  stopFetching = false;
  eventEmitter = new BehaviorSubject<any>({});
  isEditing = false;
  sheetNames: string[] = ['Invoice Info'];
  constructor(public httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getData();
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
    this.eventEmitter.next({ id: "Source", type: "save" });
    this.isEditing = false;
  }

  handleCancel() {
    this.eventEmitter.next({ id: "Source", type: "cancel" });
    this.isEditing = false;
  }

  onSave(event: any) {
    console.log(event);
  }

}
