import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { showSnackBar } from '../../core/store/snackbar-state/snackbar.action';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NgIf, MatIconModule],
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent {
  @Input() label: string = 'Upload a file (text or image)';
  @Input() accept: string = '.txt,.png,.jpeg,.jpg';
  @Input() maxSize: number = 5; // in MB
  @Input() uploadedFileName: string = '';
  @Output() fileSelected = new EventEmitter<File | null>();
  @Output() isAttachmentRemoved = new EventEmitter<boolean>();

  uploadedFile: File | null = null;


  constructor(private store: Store) {}

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const maxSizeBytes = this.maxSize * 1024 * 1024;

      const allowedExtensions = this.accept
        .split(',')
        .map((ext) => ext.trim().replace('.', '').toLowerCase());


      const fileExtension = file.name.split('.').pop()?.toLowerCase();


      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.store.dispatch(showSnackBar({message :
          `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`, status: 'error'}
        ));
        this.clearFile();
        return;
      }

      if (file.size > maxSizeBytes) {
        this.store.dispatch(showSnackBar({message :
          `File size exceeds ${this.maxSize} MB.`, status: 'error'}
        ));
        this.clearFile();
        return;
      }

      this.uploadedFile = file;
      this.uploadedFileName = file.name;
      this.fileSelected.emit(this.uploadedFile);
    }
  }

  clearFile() {
    this.uploadedFile = null;
    this.uploadedFileName = '';
    this.isAttachmentRemoved.emit(true);
    this.fileSelected.emit(null);
  }
}
