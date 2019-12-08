import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {HomeComponent} from './home/home.component';
import {ModalComponent} from './modal/modal.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PdfViewerModule,
    MatDialogModule, MatIconModule,
    RouterModule.forChild( [
      {path: '', component: HomeComponent}
    ])
  ],
  declarations: [
    HomeComponent,
    ModalComponent
  ],
  entryComponents: [ModalComponent]
})
export class PagesModule { }
