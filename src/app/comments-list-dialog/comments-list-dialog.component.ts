import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'comments-list-dialog',
    templateUrl: './comments-list-dialog.component.html',
    styleUrls: ['./comments-list-dialog.component.scss']
})
export class CommentListDialogComponent {

    comment: string = '';
    commentControl = new FormControl(null, {});


    constructor(
        public dialogRef: MatDialogRef<CommentListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data && data.comment) {
            this.comment = data.comment;
        }
    }

    onCancel(): void {
        this.dialogRef.close(null);
    }

    onSave(): void {
        this.dialogRef.close(this.comment);
    }
}
