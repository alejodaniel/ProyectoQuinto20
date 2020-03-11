import {Component} from '@angular/core';
import * as Papa from 'papaparse';
import {User} from '../app/Models/User'

let obj: AppComponent;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Bienvenidos';
  dataList: any[];
  data: any[];
  user: User;
  users: any = [];
  arr: any = [];
  nombre: string;
  fecha1: string;
  fecha2: string;
  hora: string;
  timbradas: any = 0;

  ngOnInit() {
    obj = this;
  }

  quitar(data) {
    if (data > 0) {
      if (this.users[data - 1].Nombre == this.users[data].Nombre && this.users[data - 1].Fecha == this.users[data].Fecha) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  contTimbradas(data,i) {
    if (this.users[i].Hora1 != undefined) {
      this.users[i].timbradas +=1;
    }
    if (this.users[i].Hora2 != undefined) {
      this.users[i].timbradas +=1;
    }
    if (this.users[i].Hora3 != undefined) {
      this.users[i].timbradas +=1;
    }
    if (this.users[i].Hora4 != undefined) {
      this.users[i].timbradas +=1;
    }
    return true;
  }

  onChange(files: File[]) {

    if (files[0]) {
      console.log(files[0]);
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {
          this.dataList = result.data;
          this.dataList.sort(function (o1, o2) {
            if (o1.Nombre > o2.Nombre && o1.Fecha == o2.Fecha) {
              return 1;
            }
            if (o1.Nombre < o2.Nombre && o1.Fecha == o2.Fecha) {
              return -1;
            }
            return 0;
          });

          for (let i = 0; i < this.dataList.length; i++) {
            let objeto: any = {};
            if (this.dataList[i + 1] != undefined && this.dataList[i] != undefined) {
              if (this.dataList[i].Nombre == this.dataList[i + 1].Nombre) {
                objeto.Nombre = this.dataList[i].Nombre;
                objeto.Fecha = this.dataList[i].Fecha;
                objeto.Departamento = this.dataList[i].Departamento;
                objeto.Hora1 = this.dataList[i].Hora;
                objeto.Hora2 = this.dataList[i + 1].Hora;
                objeto.timbradas = 0;
                if (this.dataList[i + 2].Nombre != undefined && this.dataList[i].Nombre != undefined) {
                  if (this.dataList[i].Nombre == this.dataList[i + 2].Nombre) {
                    objeto.Hora3 = this.dataList[i + 2].Hora;

                  }
                }
                if (this.dataList[i + 3].Nombre != undefined && this.dataList[i].Nombre != undefined) {
                  if (this.dataList[i].Nombre == this.dataList[i + 3].Nombre) {
                    objeto.Hora4 = this.dataList[i + 3].Hora;
                  }
                }
                this.users.push(objeto);
              }
            }
          }

        }

      });
    }
  }
}
