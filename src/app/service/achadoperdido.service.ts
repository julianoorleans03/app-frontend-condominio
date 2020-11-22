import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UtilService } from '../service/util.service';
import { Achadoperdido } from '../model/achadoperdido.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class AchadoperdidoService {
  constructor(public http: HttpClient, public utilService: UtilService) {
  }

  buscar(): Promise<Array<Achadoperdido>> {
    return this.http
      .get<Array<Achadoperdido>>(`${environment.api}/achadoperdido/`)
      .toPromise();
  }

  entregar(item: any): Observable<any> {
    return this.http.put<any>(
      `${environment.api}/achadoperdido/entregar/${item._id}`,
      {usuarioRetirada: item._id}
    );
  }

  salvar(item: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/achadoperdido`, item);
  }

  mostrarMensagemSucesso(): void {
    this.utilService.mostrarMensagemSucesso("Item Salvo com Sucesso.");
  }
}
