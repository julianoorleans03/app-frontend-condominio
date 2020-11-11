import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() { }

  getNomeObjetoOS(): string {
    return JSON.parse(localStorage.getItem("nomeObjetoOS"));
  }

  setNomeObjetoOS(nomeObjetoOS: string) {
    localStorage.setItem("nomeObjetoOS", JSON.stringify(nomeObjetoOS));
  }

  getToken(): string {
    return JSON.parse(
      localStorage.getItem(
        "token"
      )
    );
  }

  setToken(token: string) {
    localStorage.setItem(
      "token",
      JSON.stringify(token)
    );
  }

  getCamposOpcionais(): Array<any> {
    return JSON.parse(localStorage.getItem("camposOpcionais"));
  }

  setCamposOpcionais(camposOpcionais: Array<any>) {
    localStorage.setItem("camposOpcionais", JSON.stringify(camposOpcionais));
  }

  getParam(): any {
    return JSON.parse(localStorage.getItem("param"));
  }

  setParam(param: any) {
    localStorage.setItem("param", JSON.stringify(param));
  }

  getParamPaginacao(): any {
    return JSON.parse(localStorage.getItem("paramPaginacao"));
  }

  setParamPaginacao(paramPaginacao: any) {
    localStorage.setItem("paramPaginacao", JSON.stringify(paramPaginacao));
  }

  getParamOrdenacao(): any {
    return JSON.parse(localStorage.getItem("paramOrdenacao"));
  }

  setParamOrdenacao(paramOrdenacao: any) {
    localStorage.setItem("paramOrdenacao", JSON.stringify(paramOrdenacao));
  }

  removeItemParam(): void {
    localStorage.removeItem("param");
  }

  removeItemParamPaginacao(): void {
    localStorage.removeItem("paramPaginacao");
  }

  clearAll(): void {
    localStorage.clear();
  }
}
