import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-microsoft-excel-modification',
  templateUrl: './microsoft-excel-modification.component.html',
  styleUrls: ['./microsoft-excel-modification.component.scss']
})
export class MicrosoftExcelModificationComponent {
  fileUrl: SafeResourceUrl = '';
  title = 'xls-angular-poc';
  data: string[][] = [];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {

    // const url = "https://probeplus-my.sharepoint.com/:x:/g/personal/rihaz_probeplus_in/EVEcVnamvf5EnyMCbQxd3i8BbuJCyOk-SS3qgzLBrqqaKw?e=Ft7PyB&action=embedview&wdAllowInteractivity=True&wdDownloadButton=True";
    const url = "https://file-examples.com/wp-content/storage/2017/02/file_example_XLS_10.xls";

    //  "https://probeplus-my.sharepoint.com/personal/ishika_probeplus_in/_layouts/15/Doc.aspx?sourcedoc={94feb567-09c1-4bec-8e35-5adf6e90502e}&action=embedview&wdAllowInteractivity=False&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"

    const microsoftUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${url}`

    // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(microsoftUrl);
  }

  handleFileUpload(event: any) {
    const fileURL = URL.createObjectURL(event.target.files[0])
    console.log(fileURL);
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    console.log(this.fileUrl);

  }

  handleUrl(event: any) {
    const extendedLink = "&action=embedview&wdAllowInteractivity=True&wdDownloadButton=True"
    console.log(event.target.value);
    const inputValue = event.target.value;
    if (inputValue) {
      const url = inputValue.split('&')[0] + extendedLink;
      console.log(url);
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  onSave(event: any) {
    console.log(event);
  }

}
