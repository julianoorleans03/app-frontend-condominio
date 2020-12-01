import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from "@angular/core";
import { AuthService } from "src/app/service/auth.service";
import { UtilService } from "src/app/service/util.service";
import { environment } from 'src/environments/environment';

declare const jQuery: any;

@Directive({
  selector: "[appSelect2Usuario]",
})
export class Select2UsuarioDirective {
  @Input() ngModel;
  @Output() ngModelChange = new EventEmitter();

  constructor(
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    jQuery(this.el.nativeElement)
      .select2({
        theme: "bootstrap4",
        language: "pt-BR",
        placeholder: "",
        allowClear: true,
        ajax: {
          headers: {
            "x-access-token": `${this.authService.recuperarToken()}`,
            "Content-Type": "application/json",
          },
          delay: 500,
          url: `${environment.api}/usuario`,
          dataType: "json",
          processResults: (data) => {
            const resultado = new Array();

            data.forEach((dados) => {
              resultado.push({
                id: dados._id,
                text: dados.nome,
              });
            });

            return {
              results: resultado,
            };
          },
          cache: true,
        },
      })
      .on("select2:select", (e) => {
        const novo = {
          id: e.params.data.id,
          nome: e.params.data.text,
        };

        this.ngModel = novo;
        this.ngModelChange.emit(novo);
      })
      .on("select2:unselect", (e) => {
        jQuery(this.el.nativeElement).val(null).trigger("change");

        this.ngModel = null;
        this.ngModelChange.emit(null);
      });

    if (this.ngModel && this.ngModel.id) {
      const newOption = new Option(
        this.ngModel.nome,
        this.ngModel.id,
        true,
        true
      );

      jQuery(this.el.nativeElement).append(newOption).trigger("change");
    }
  }

  @HostListener("change") ngOnChanges() {
    if (this.ngModel && this.ngModel.id && this.ngModel.nome) {
      const newOption = new Option(
        this.ngModel.nome,
        this.ngModel.id,
        true,
        true
      );

      jQuery(this.el.nativeElement).append(newOption).trigger("change");
    }
  }
}
