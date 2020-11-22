import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from '../model/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class UsuarioService {
  constructor(public http: HttpClient) {
  }

  buscarPorId(id: string): Promise<Usuario> {
    return this.http
      .get<Usuario>(`${environment.api}/usuario/${id}`)
      .toPromise();
  }

  salvar(usuario: any): Observable<any> {
    if (usuario._id) {
      return this.http.put<any>(
        `${environment.api}/usuario/${usuario._id}`,
        usuario
      );
    } else {
      return this.http.post<any>(`${environment.api}/auth/novo-usuario`, usuario);
    }
  }

  buscar(): Promise<Array<Usuario>> {
    return this.http
      .get<Array<Usuario>>(`${environment.api}/usuario/`)
      .toPromise();
  }

  ativar(item: any): Observable<any> {
    return this.http.put<any>(
      `${environment.api}/usuario/ativar/${item._id}`,
      {ativo: true}
    );
  }
}
