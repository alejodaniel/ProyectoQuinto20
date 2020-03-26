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
    const result = value.length - 2;
    let diaMes;
    this.anio = value.toString().substr(result, 2);
    diaMes = value.toString().substr(0, result);

    this.fecha = this.dia + '/' + this.mes + '/' + this.anio;

    return this.fecha;
  }

}
