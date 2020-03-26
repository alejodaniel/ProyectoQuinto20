import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'hora'
})
export class HoraPipe implements PipeTransform {

  horas: any;
  minutos: any;
  hora: any;

  transform(value: any): any {
    console.log(value);
    if (value !== undefined) {
      if (value.length > 3) {
        this.horas = value.toString().substr(0, 2);
        this.minutos = value.toString().substr(1, 2);
        this.hora = this.horas + ':' + this.minutos;
      } else {
        this.horas = value.toString().substr(0, 1);
        this.minutos = value.toString().substr(1, 2);
        this.hora = this.horas + ':' + this.minutos;
      }
      return this.hora;
    }
  }

}
