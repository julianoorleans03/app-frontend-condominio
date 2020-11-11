import { Injectable } from "@angular/core";
import { Options } from "select2";
import * as moment from "moment";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import Swal, { SweetAlertResult } from "sweetalert2";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";

declare const jQuery: any;

@Injectable({
  providedIn: "root",
})
export class UtilService {
  MENSAGEM_FILTROS_ADICIONAIS_REMOVIDOS: string  = "Não existe filtro adicionais para serem removidos!";
  FOMARTO_DATA_HORA: string = "DD/MM/YYYY HH:mm:ss";
  LOCALE_COMPONENTE_DATA: string = "pt-br";

  REGEX_EMAIL: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  FORMATO_CURRENCY_MASK: any = {
    prefix: "",
    thousands: ".",
    decimal: ",",
  };

  constructor(
    private router: Router,
    private toastrService: ToastrService,
  ) {}

  mostrarMensagemSucesso(
    mensagem: string = "Registro Salvo com Sucesso!"
  ): void {
    this.toastrService.success(mensagem, "Sucesso!");
  }

  mostrarMensagemAlerta(mensagem: string): void {
    this.toastrService.warning(mensagem, "Atenção!");
  }

  mostrarMensagemErro(mensagem: string): void {
    this.toastrService.error(mensagem, "Oops...");
  }

  retornaMensagemPadrao(
    mensagem: string = "Nenhum registro encontrado!"
  ): string {
    return mensagem;
  }

  pegaItensPorPagina(): number {
    return window.innerWidth >= 1024 &&
      window.innerWidth <= 1366 &&
      window.innerHeight > 600 &&
      window.innerHeight <= 800
      ? 6
      : 10;
  }

  retornaFiltros(queryParams: any): string {
    if (!queryParams) return "";

    const parametros = Object.keys(queryParams).filter((key) => {
      return queryParams[key];
    });

    return parametros.length > 0
      ? `/search?${jQuery.param(this.removeAtributosVazio(queryParams))}`
      : "";
  }

  removeAtributosVazio(queryParams: any): any {
    const removeAtributoVazio = (obj) => {
      Object.keys(obj).forEach((key) => {
        (obj[key] == null || obj[key] == undefined || obj[key] == "") &&
          delete obj[key];
      });
    };

    removeAtributoVazio(queryParams);

    return queryParams;
  }

  retornaDescricaoEnum(
    tipoEnum: string,
    valor: string,
    enums: Array<any>
  ): string {
    const retornaDescricao = (valor: string, enums: Array<any>) => {
      const resultado = enums.filter((valorEnum) => {
        return valorEnum.id == valor;
      });

      return resultado && resultado[0]
        ? resultado[0].nome
        : "Opção Indisponivel";
    };

    const tiposEnum = {
      site: () => {
        return retornaDescricao(valor, enums);
      },
      estoque: () => {
        return retornaDescricao(valor, enums);
      },
      situacao: () => {
        return retornaDescricao(valor, enums);
      },
      status: () => {
        return retornaDescricao(valor, enums);
      },
    };

    const response = tiposEnum[tipoEnum];

    return response ? response() : "";
  }

  transformaObjetoEmArray(obj: any): Array<any> {
    return Object.keys(obj).map((key) => ({
      id: key,
      nome: obj[key],
    }));
  }

  retornaDataFormatada(data: any): string {
    if (data && data.singleDate) {
      const dataLocal = `${data.singleDate.date.year}/${data.singleDate.date.month}/${data.singleDate.date.day}`;
      return moment(dataLocal).utcOffset(0).format("DD/MM/YYYY");
    }
  }

  retornaDataHoraAtual(data?: any): string {
    data = data ? moment(data) : moment();

    return data.format(this.FOMARTO_DATA_HORA);
  }

  retornaDataPorRegex(data: any) {
    return data.match(/\b(\d+\/\d+\/\d+)\b/g);
  }

  retornaDataPicketNativo(data: any) {
    return new Date(this.retornaDataPorRegex(data)).toISOString().split('T')[0];
  }


  retornaOpcoesSelect2(mutiplos: boolean): Options {
    return {
      multiple: mutiplos,
      theme: "bootstrap4",
      closeOnSelect: true,
      language: "pt-BR",
    };
  }

  validarEmail(email: string): boolean {
    return this.REGEX_EMAIL.test(email);
  }

  irParaHome(): void {
    this.router.navigate(["/"]);
  }

  retornaFiltrosColuna(filtrosColuna: Array<any>): string {
    let search;

    const retornaFiltros = () => {
      let filtroColuna = "";
      filtrosColuna
        .filter((filtro) => {
          return !filtro.geral;
        })
        .forEach((filtro) => {
          filtroColuna += search[filtro.acao](filtro);
        });
      return filtroColuna.replace(/,$/, "");
    };

    search = {
      contem: (filtro) => {
        if (this.isANumber(filtro.valor) && filtro.tipoColuna != "String") {
          return `${filtro.coluna}=${filtro.valor},`;
        } else if (filtro.tipoColuna == "Date") {
          return `${filtro.coluna}:${this.retornaDataFormatada(filtro.valor)},`;
        } else {
          return `${filtro.coluna}:${filtro.valor},`;
        }
      },
      igual: (filtro) => {
        if (filtro.tipoColuna == "Date") {
          return `${filtro.coluna}=${this.retornaDataFormatada(filtro.valor)},`;
        } else {
          return `${filtro.coluna}=${filtro.valor},`;
        }
      },
      maior: (filtro) => {
        if (filtro.tipoColuna == "Date") {
          return `${filtro.coluna}>${this.retornaDataFormatada(filtro.valor)},`;
        } else {
          return `${filtro.coluna}>${filtro.valor},`;
        }
      },
      diferente: (filtro) => {
        if (filtro.tipoColuna == "Date") {
          return `${filtro.coluna}:notin[${this.retornaDataFormatada(
            filtro.valor
          )}],`;
        } else {
          return `${filtro.coluna}:notin[${filtro.valor}],`;
        }
      },
      intervalo: (filtro) => {
        if (this.isANumber(filtro.intervaloInicial)) {
          return `${filtro.coluna}>${filtro.intervaloInicial},${filtro.coluna}<${filtro.intervaloFinal},`;
        } else if (filtro.tipoColuna == "Date") {
          return `${filtro.coluna}:${this.retornaDataFormatada(
            filtro.intervaloInicial
          )}-${this.retornaDataFormatada(filtro.intervaloFinal)},`;
        }
      },
      booleano: (filtro) => {
        return filtro.valor == "SIM"
          ? `${filtro.coluna}=true,`
          : filtro.valor == "NAO"
          ? `${filtro.coluna}=false,`
          : "";
      },
    };

    return retornaFiltros();
  }

  notIsANumber(descricaoPesquisa: string): boolean {
    return /\D/.test(descricaoPesquisa);
  }

  isANumber(descricaoPesquisa: string): boolean {
    return !/\D/.test(descricaoPesquisa);
  }

  isBlank(texto: string): boolean {
    return !texto || /^\s*$/.test(texto);
  }

  limparSelect2(id: string): void {
    jQuery(`#${id}`).val(null).trigger("change");
  }

  resetarFormulario(formulario: any) {
    Object.keys(formulario.form.controls).forEach((key) => {
      formulario.form.get(key).reset();
    });
  }

  mostrarOpcaoExcluir(): Promise<SweetAlertResult> {
    return Swal.fire({
      title: `Você deseja realmente excluir?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
      focusCancel: true,
    });
  }

  mostrarOpcaoOf(texto: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: `${texto}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
      focusCancel: true,
    });
  }

  mostrarMensagemFormularioInvalido(): void {
    this.mostrarMensagemAlerta(
      "Por favor, preencha todos os campos obrigatórios."
    );
    
    setTimeout(() => {
      jQuery(".is-invalid").filter(":input:first").focus();
    });
  }

  setarFocoNoCampoComId(id: string): void {
    jQuery(id).focus();
  }
  
  podeLimparTela(id: number): boolean {
    if (id) {
      this.mostrarMensagemAlerta(
        "É possivel limpar somente registros não salvos!"
      );
      return false;
    }

    return true;
  }

  retornaTenant(): string {
    const usuarioTenant = `${location.host.split(".")[0]}`;
    return usuarioTenant.indexOf("localhost") > -1 ? "default" : usuarioTenant;
  }

  retornaAmbiente(): string {
    return environment.production ? "prod" : "dev";
  }
}
