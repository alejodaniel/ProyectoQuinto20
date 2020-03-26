import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fechaPipe'
})
export class FechaPipePipe implements PipeTransform {
  dia: any;
  mes: any;
  anio: any;
  fecha: any;

  transform(value: any): any {
    if (value.length == 4) {
      this.dia = value.toString().substr(0, 1);
      this.mes = value.toString().substr(1, 1);
      this.anio = value.toString().substr(2, 2);
      this.fecha = this.dia + '/' + this.mes + '/' + this.anio;

      return this.fecha;
    }
    const result = value.length - 2;
    let diaMes;
    this.anio = value.toString().substr(result, 2);
    diaMes = value.toString().substr(0, result);
    if (diaMes.length > 3) {
      this.dia = value.toString().substr(0, 2);
      this.mes = value.toString().substr(2, 2);
    } else {
      diaMes = diaMes + '0';
      this.mes = diaMes.toString().substr(2, 2);
      if (parseInt(this.mes) > 10) {
        this.mes = diaMes.toString().substr(2, 1);
        this.dia = diaMes.toString().substr(0, 2);
      }
    }

    this.fecha = this.dia + '/' + this.mes + '/' + this.anio;

    return this.fecha;
  }

}
