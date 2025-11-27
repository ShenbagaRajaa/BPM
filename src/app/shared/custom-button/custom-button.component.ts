import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface CustomCellRendererParams extends ICellRendererParams {
  buttonClicked: (rowData: any) => void;
  showButton: boolean;
}

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css',
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  @Output() buttonClick = new EventEmitter<any>();

  @Input() disabled: boolean = false;
  visible: boolean = true;
  params!: CustomCellRendererParams;

  gridComponent: any;

  onButtonClickHandler!: (rowData: any) => void;
  // Initialization method for the cell renderer, called by ag-Grid
  agInit(params: CustomCellRendererParams): void {
    this.params = params;
    this.disabled = this.params.data?.isDisabled;
    if (
      this.params.showButton !== null &&
      this.params.showButton !== undefined
    ) {
      this.visible = this.params.showButton;
    } else this.visible = true;
  }
  // Refresh method required by ag-Grid for custom renderers (not used in this case)
  refresh(): boolean {
    return true;
  }
  // Method to handle button click event
  buttonClicked(): void {
    this.params.buttonClicked(this.params.data);
  }
}
