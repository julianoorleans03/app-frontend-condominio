import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Salao } from '../model/salao.model';

@Injectable({
  providedIn: "root"
})
export class SalaoService {
  constructor(public http: HttpClient) {
  }

  buscar(): Promise<Array<Salao>> {
    return this.http
      .get<Array<Salao>>(`${environment.api}/salao/`)
      .toPromise();
  }

}
