import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  PDFSource,
  PDFDocumentProxy,
  PDFProgressData,
} from 'pdfjs-dist';
import {ModalComponent} from '../modal/modal.component';
import {MatDialog} from '@angular/material/dialog';
import {PdfHttpService} from '../pdf-http.service';

enum ActionType {
  insert = 'insert',
  select = 'select',
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  progressData: PDFProgressData;
  isLoaded = false;

  pdfSrc: string | PDFSource | ArrayBuffer = '/assets/valid-pdf.pdf';
  pdf: any;
  allPageInFile = [];
  private changeHistory = [];

  switchActionType = ActionType;
  selectedActionType: ActionType = ActionType.select;
  showPage = 1;
  showAllPage = true;

  @ViewChild('selectFile', {static: false}) selectFile: ElementRef;

  constructor(
    public dialog: MatDialog,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private pdfService: PdfHttpService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.allPageInFile.map((e) => {
      e.source.canvas.removeEventListener('mouseenter');
    });
  }

  /**
   * Pdf loading progress callback
   */
  public onProgress(progressData: PDFProgressData) {
    this.progressData = progressData;

    this.isLoaded = progressData.loaded >= progressData.total;
  }
  public getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Get pdf information after it's loaded
   */
  public afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
  }

  /**
   * After every page
   */
  public pageRendered(e: any) {
    this.allPageInFile.push(e);

    e.source.div.addEventListener('click', (event) => {
      switch (this.selectedActionType) {
        case ActionType.insert:
          if ( event.path[0].tagName !== 'SPAN') { this.onOpenInput(event); }
          break;
        case ActionType.select:
          this.selectText(event);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Render PDF preview on selecting file
   */
  public onFileSelected() {
    if (typeof (FileReader) !== undefined) {

      this.allPageInFile = [];

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer(this.selectFile.nativeElement.files[0]);
    }
  }

  //////////////////////////////////////////////////////////////////

  /**
   * Save edit PDF
   */
  public onGeneratePDFImage() {

    const pages: NodeListOf<HTMLElement> = document.querySelectorAll('.page');

    const pdf = new jsPDF('p', 'pt', 'a4');

    for (let i = 0; i < pages.length; i++) {
      this.onProgress({loaded: i, total: pages.length});

      html2canvas(pages[i]).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 0, 0, 0, (canvas.width - 53), canvas.height);

        if (i < (pages.length - 1)) {
          pdf.addPage();
        }
      });
    }

    setTimeout(() => {
      this.onProgress({loaded: pages.length, total: pages.length});

      pdf.save('GeneratePDFImage.pdf');
    }, 1000);
  }
  public onGeneratePDFText() {
    const pages: NodeListOf<HTMLElement> = document.querySelectorAll('.page');

    const pdf = new jsPDF('p', 'pt', 'a4');

    // go through each page
    for (let i = 0; i < pages.length; i++) {
      this.onProgress({loaded: i, total: pages.length});

      html2canvas(pages[i]).then( (canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 9, 0, 0, (canvas.width), canvas.height);

        // from each page we collect all the text in the "span"
        const span = pages[i].querySelectorAll('span');
        for (let element = 0; element < span.length; element++) {

          // const fontSize: number =  Number( span[element].style.fontSize.substring(0, span[element].style.fontSize.length - 2) );
          const left: number = Number( span[element].style.left.substring(0, span[element].style.left.length - 2) );
          const top: number = Number( span[element].style.top.substring(0, span[element].style.top.length - 2) );

          // pdf.setFont(span[element].style.fontFamily);
          // pdf.setFontSize(fontSize - 4);
          pdf.setFontStyle( span[element].style.cssText);
          pdf.text( left, top, span[element].textContent);
        }

        if (i < (pages.length - 1)) {
          pdf.addPage();
        }
      });
    }

    setTimeout(() => {
      this.onProgress({loaded: pages.length, total: pages.length});

      pdf.save('GeneratePDFText.pdf');
    }, 4000);

  }
  public onSendHTML() {
    const pages: string = '/assets/valid-html.html';
    this.pdfService.sent({html: pages})
      .subscribe( (res) => console.log('res :', res) );
  }

  /**
   * Add Comment to PDF
   */
  private onOpenInput(event: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {text: ''},
      autoFocus: true,
      position: {
        left: (event.clientX - 7) + 'px',
        top: (event.clientY - 15) + 'px'
      }
    });

    dialogRef.afterClosed().subscribe((result: { text: string }) => {
      if (result !== undefined) {
        this.addComment(event, result.text);
      }
    });
  }
  private addComment(event: any, text: string) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const div = document.createElement('span');
    div.setAttribute(
      'style',
      `
        position: absolute;
        left: ${x}px;
        top: ${y - 10}px;
        text-align: left;
        font-size: 14px;
        transform-origin: 0 0;
        white-space: pre;
        cursor: not-allowed;
      `);
    div.innerHTML = text;

    this.changeHistory.push(div);
    event.path[1].append(div);
  }

  private removeOneChange() {
    const lastChange = this.changeHistory.pop();

    console.log(lastChange);
    console.log(this.changeHistory);
    if ( lastChange !== void(0) ) {
      if (lastChange.tagName === 'Q') {
        lastChange.parentNode.innerHTML = lastChange.offsetParent.innerText;
        console.log(lastChange);
      } else {
        lastChange.parentNode.removeChild(lastChange);
      }
    }
  }

  private selectAction(action: ActionType) {
    this.selectedActionType = action;
    const pages: NodeListOf<HTMLElement> = document.querySelectorAll('.page');

    let typeCursorValid = null;
    let typeCursorInvalid = null;

    switch (this.selectedActionType) {
        case ActionType.insert:
          typeCursorValid = 'pointer';
          typeCursorInvalid = 'not-allowed';
          break;
        case ActionType.select:
          typeCursorValid = 'default';
          typeCursorInvalid = 'text';
          break;
    }

    for ( let i = 0; i < pages.length; i++) {
      pages[i].style.cursor = typeCursorValid;
      const spans = pages[i].querySelectorAll('span');

      for ( let element = 0; element < spans.length; element++) {
        spans[element].style.cursor = typeCursorInvalid;
      }
    }

  }

  /**
   * todo: доделать выделение нескольки строк
   */
  private selectText(eventClick) {
    console.log(eventClick.path);

    let allSelectedTxt: any = window.getSelection || null;

    if (allSelectedTxt) {
      const selection = window.getSelection();
      // @ts-ignore
      const allPdfPages: NodeListOf<HTMLElement>[] = document.querySelectorAll('.page');

      let pageActive = null;
      for (let i = 0; i <= eventClick.path.length; i++) {
        allPdfPages.forEach((page, index, array) => {
          if (eventClick.path[i] === page) { pageActive = page; }
        });
      }

      if (selection.type === 'Range') {
        // https://habr.com/ru/post/55922/
        // console.log('selection', selection);
        // console.log('anchorNode start : ', selection.anchorNode);
        // console.log('anchorOffset start move : ', selection.anchorOffset);
        // console.log('focusNode end: ', selection.focusNode);
        // console.log('focusOffset move end: ', selection.focusOffset);

        const allSpanPage = pageActive.querySelectorAll('span');

        const selectedString = [];
        let isOpen = false;
        allSpanPage.forEach( (element, index, arr) => {
          if (element === selection.anchorNode.parentElement) {
            isOpen = true;
          }

          if (isOpen) {
            selectedString.push(element);
            if (element === selection.focusNode.parentElement) {
              isOpen = false;
            }
          }
        });

        allSelectedTxt = selection.toString();

        const rng = document.createRange();
        const colorText = document.createElement('q');
        colorText.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';

        selectedString.forEach( (span, index, array) => {
          if (span === selection.anchorNode.parentElement) {
            rng.setStart( selection.anchorNode,  selection.anchorOffset);
          } else {
            // console.log(span);
          }
          // todo: else
          if (span === selection.focusNode.parentElement) {
            rng.setEnd( selection.focusNode, selection.focusOffset);

            this.changeHistory.push(colorText);
            rng.surroundContents( colorText );
          }

/*
          switch (span) {
            case selection.anchorNode.parentElement :
              rng.setStart( selection.anchorNode,  selection.anchorOffset);
              break;
            case selection.focusNode.parentElement :
              rng.setEnd( selection.focusNode, selection.focusOffset);
              this.changeHistory.push( colorText );
              rng.surroundContents( colorText );
              break;
            default:
              // rng.setStart( selection.anchorNode,  selection.anchorOffset);
              // rng.setEnd( selection.anchorNode, selection.anchorNode.textContent.length);
              //
              // // rng.setStart( span,  0);
              // // rng.setEnd( span, span.textContent.length);

              console.log(span);
              break;
          }
*/
        });

      } else {
        console.log('simple press');
      }
    } else {
      console.log('IE');
    }

  }

}
