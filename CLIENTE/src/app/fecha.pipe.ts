import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string, format: string) {
    console.log(value)
    console.log(format)
    let date = new Date(parseInt(value.substr(6)));
    console.log(date)
    return this.datePipe.transform(date, format);
  }
}
