import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.sass']
})
export class DownloadDialogComponent {
  constructor (
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}
}
