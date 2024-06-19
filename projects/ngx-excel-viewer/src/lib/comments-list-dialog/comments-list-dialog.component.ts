import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'comments-list-dialog',
    templateUrl: './comments-list-dialog.component.html',
    styleUrls: ['./comments-list-dialog.component.scss']
})
export class CommentListDialogComponent implements OnInit {

    allComments;
    commentControl = new FormControl(null, {});


    constructor(
        public dialogRef: MatDialogRef<CommentListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data && data.comments) {
            this.allComments = data.comments[data.sheet];
        }
    }

    ngOnInit() {
        // console.log(this.allComments);
    }

    sendBackComment(commentData: any) {
        this.dialogRef.close(commentData);
    }

    formatDate(date: Date) {
        const months = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];

        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        return `${month} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
    }
}
