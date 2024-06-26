import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CommentDialogComponent } from './dialog/comment-dialog.component';
import { CommentListDialogComponent } from './comments-list-dialog/comments-list-dialog.component';

interface Comment {
  author: string;
  comment: string | null,
  id: string,
  xPosition: number,
  yPosition: number,
  date: Date;
  cell: string,
}


@Component({
  selector: 'ngx-excel-viewer',
  templateUrl: 'ngx-excel-viewer.component.html',
  styleUrls: ['ngx-excel-viewer.component.scss']
})
export class NgxExcelViewerComponent implements OnInit, OnChanges {
  @Input() id: string = "";
  @Input() data: any;
  @Input() sheetNames: string[] = [];
  @Input() editable: boolean = false;
  @Input() events: BehaviorSubject<any> | null = null;
  @Input() saveDataOutput: "complete" | "edited-only" = "complete";

  @Input() comments: { [key: string]: Comment[] } = {};

  @Output() onDataSave = new EventEmitter<any>();
  @Output() onScrollEnd = new EventEmitter<any>();
  public currentSheetName = "";
  public maxOfColumns = 0;
  public selectedCellIndices: [number, number] = [-1, -1];
  public isEditingTheSelectedCell = false;
  public headers: string[] = [];
  public sheetData: any[] = [];
  public isSheetDataChanged = false;
  private backupSheetData: any[] = [];
  public modifiedRows: number[] = [];
  private renderedPages = 1;
  private lastScrollTop = 0;
  public loading = false;


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.comments);
    if (this.data != null) {
      this.currentSheetName = this.sheetNames[0];
      if (this.data[this.currentSheetName]) {
        this.run();
      }
    }
    if (this.events != null) {
      this.events.subscribe(event => {
        if (event.id == this.id) {
          if (event.type == "comments") this.openCommentsDialog();
          if (event.type == "cancel") {
            this.sheetData = JSON.parse(JSON.stringify(this.backupSheetData));
            this.isSheetDataChanged = false;
            this.modifiedRows = [];
          } else if (event.type == "save") {
            this.isSheetDataChanged = true;
            if (this.saveDataOutput == "complete") {
              this.onDataSave.emit({
                id: this.id, sheet: this.currentSheetName, comments: this.comments, data: this.sheetData.map((row: any) => {
                  let temp: string[] = [];
                  row.map((element: { value: string }) => {
                    if (element) temp.push(element.value)
                  });
                  return temp;
                  // row['value']
                })
              });
              return;
            }
            let payload: any = {};
            for (let rowIndex of this.modifiedRows) {
              payload[`${rowIndex + 1}`] = this.sheetData[rowIndex].map((row: any) => row['value']);
            }
            this.onDataSave.emit({ id: this.id, sheet: this.currentSheetName, data: payload });
          } else if (event.type == "saved") {
            for (let rowIndex of this.modifiedRows) {
              this.data[rowIndex] = this.sheetData[rowIndex].map((row: any) => row['value']);
              this.backupSheetData[rowIndex] = this.sheetData[rowIndex];
            }
          } else if (event.type == "new_data") {
            this.run();
          }
        }
      })
    }
  }

  run() {
    // this.comments = {};
    this.loading = true;
    setTimeout(() => {
      this.calculateMaxColumns();
      this.generateHeaders();
      this.generateSheetData();
      setTimeout(() => {
        this.loading = false;
      }, 100)
    }, 100);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].previousValue != changes['data'].currentValue) {
      this.run();
    }
  }

  calculateMaxColumns() {
    this.maxOfColumns = 0;
    if (this.data[this.currentSheetName]) {
      for (let row of this.data[this.currentSheetName]) {
        if (row.length > this.maxOfColumns) {
          this.maxOfColumns = row.length;
        }
      }
    }
  }

  generateHeaders() {
    let headers: string[] = [];
    for (let i = 0; i < this.maxOfColumns; i++) {
      let header = "";
      let num = i;
      while (num >= 0) {
        let remainder = num % 26;
        header = String.fromCharCode(65 + remainder) + header;
        num = Math.floor(num / 26) - 1;
      }
      headers.push(header);
    }
    this.headers = headers;
  }

  generateSheetData() {
    if (this.data[this.currentSheetName]) {
      this.sheetData = JSON.parse(JSON.stringify(this.data[this.currentSheetName].map((row: any) => row.map((r: any) => ({ "value": r })))));
      this.backupSheetData = JSON.parse(JSON.stringify(this.sheetData));
    } else {
      this.sheetData = [];
      this.backupSheetData = [];
    }
  }

  setSelectedSheetName(sheet: string) {
    // if (this.isSheetDataChanged) {
    //   alert("Save sheet before switching");
    //   return;
    // }
    this.currentSheetName = sheet;
    this.run();
  }

  selectCell(i: number, j: number) {
    if ((this.selectedCellIndices[0] == i && this.selectedCellIndices[1] == j) || (i > this.sheetData.length - 1 || j > this.maxOfColumns - 1)) {
      (document.querySelector(`#input-${this.selectedCellIndices[0]}-${this.selectedCellIndices[1]}`) as any)?.focus()
      return;
    }
    i = i >= 0 ? i : 0;
    j = j >= 0 ? j : 0;
    this.selectedCellIndices = [i, j];
    (document.querySelector(`#input-${i}-${j}`) as any).focus()
  }

  onDataChanges(event: any, i: number, j: number) {
    if (!this.editable) return;
    if (this.backupSheetData[i][j]["value"] != event.target.innerText) {
      this.sheetData[i][j]["value"] = event.target.innerText;
      if (!this.modifiedRows.includes(i)) {
        this.modifiedRows.push(i);
      }
      if (!this.isSheetDataChanged) {
        this.isSheetDataChanged = true;
      }
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: any) {
    if (event.which == 13) {
      event.preventDefault();
    }
  }

  onScroll(event: any) {
    if (event.target.scrollTop > this.lastScrollTop) {
      if ((event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight) {
        this.onScrollEnd.emit({ id: this.id, pageNo: this.renderedPages++, sheet: this.currentSheetName });
      }
    }
    this.lastScrollTop = event.target.scrollTop;
  }


  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    if (event.key?.includes("Arrow")) {
      const key = event.key;
      let i = this.selectedCellIndices[0];
      let j = this.selectedCellIndices[1];
      event.target.blur();
      if (key == "ArrowUp") {
        i--;
      } else if (key == "ArrowDown") {
        i++;
      } else if (key == "ArrowLeft") {
        if (window.getSelection()?.anchorOffset == 0) j--;
      } else if (key == "ArrowRight") {
        if ((window.getSelection()?.anchorOffset ?? 0) >= event.target.innerText.length) j++;
      }
      this.selectCell(i, j);
    }
  }

  onDoubleClick(event: any, y: number, x: number) {

    // let userComment = prompt('Type here');
    // if (userComment)
    //   this.comments.push({ comment: userComment, id: "AAA", xPosition: x, yPosition: y })
    // // this.run();

    if (this.editable) return;

    let commetedCell;

    if (this.comments[this.currentSheetName])
      commetedCell = this.comments[this.currentSheetName].find(userComment => userComment.yPosition === y && userComment.xPosition === x);

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '500px',
      data: { comment: commetedCell?.comment }
    });

    dialogRef.afterClosed().subscribe(comment => {
      if (comment) {
        const cellAddress = this.getColumnLetter(x) + (y + 1); // Convert to 1-based index for row

        if (!this.comments[this.currentSheetName]) this.comments[this.currentSheetName] = [];
        this.comments[this.currentSheetName].push(
          {
            author: "Shemilkumar",
            comment: comment,
            id: "AAA",
            xPosition: x,
            yPosition: y,
            date: new Date(),
            cell: cellAddress
          }
        )
      }
    });
  }


  isCommentedCell(i: number, j: number) {
    if (!this.comments[this.currentSheetName]) return false;
    const commetedCell = this.comments[this.currentSheetName].find(userComment => userComment.yPosition === i && userComment.xPosition === j);
    if (commetedCell) return true;
    return false;
  }


  showComment(i: number, j: number): string {
    if (!this.comments[this.currentSheetName]) return '';
    const commetedCell = this.comments[this.currentSheetName].find(userComment => userComment.yPosition === i && userComment.xPosition === j);
    if (commetedCell && commetedCell.comment) {
      return commetedCell.comment;
    }

    return ''
  }

  openCommentsDialog() {
    this.selectedCellIndices = [-1, -1];
    const dialogRef = this.dialog.open(CommentListDialogComponent, {
      width: '550px',
      maxHeight: '75vh',
      data: { comments: this.comments, sheet: this.currentSheetName }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.selectedCellIndices = [response.yPosition, response.xPosition];
        this.selectCell(response.yPosition, response.xPosition)
      }
    })
  }

  getColumnLetter(colIndex: number) {
    let letter = '';
    let tempIndex = colIndex;
    while (tempIndex >= 0) {
      letter = String.fromCharCode((tempIndex % 26) + 65) + letter;
      tempIndex = Math.floor(tempIndex / 26) - 1;
    }
    return letter;
  };
}
