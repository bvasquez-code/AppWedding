import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) { }

  public readExcelFileFromAssets(): Observable<any[]> {
    const url = 'assets/data/BD_INVITADOS.xlsx';
    return new Observable(observer => {
      this.http.get(url, { responseType: 'arraybuffer' }).subscribe(data => {
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        observer.next(jsonData);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }
}
