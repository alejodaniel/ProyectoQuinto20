import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'uniqueName'
})
export class UniqueNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    const años = [];
    for (let i = 0; i < value.length; i++) {
      años.push(value[i].Nombre);
    }
    const distintos = [...new Set(años)];
    return distintos;
  }

}
