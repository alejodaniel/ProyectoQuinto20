import {Component} from '@angular/core';
import * as Papa from 'papaparse';
import {User} from '../app/Models/User';
import {ImagenesService} from './services/imagenes.service';
import {Archivo} from './Models/Archivo';
import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';


let obj: AppComponent;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  name = 'Sistema Biometrico';
  dataList: any[];
  activeSelect: any = false;
  data: any[];
  fechaAcomodada: any;
  user: any = {};
  archivo: Archivo = new Archivo();
  users: any = [];
  archivoSelected = 'selecione';
  newArray: any = [];
  array: any = [];
  ids: any = [];
  dbFiles: any = [];
  file = null;
  timbradas: any = 0;
  uploadFile: Array<File>;

  constructor(private imagenesService: ImagenesService) {
  }

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

  contTimbradas(data, i) {
    this.file = null;
    if (this.users[i].Hora1 != undefined) {
      this.users[i].timbradas += 1;
    }
    if (this.users[i].Hora2 != undefined) {
      this.users[i].timbradas += 1;
    }
    if (this.users[i].Hora3 != undefined) {
      this.users[i].timbradas += 1;
    }
    if (this.users[i].Hora4 != undefined) {
      this.users[i].timbradas += 1;
    }
    return true;
  }

  contHorasTrabajadas(data, i) {

    if (this.users[i].Hora1 != undefined && this.users[i].Hora2 != undefined && this.users[i].Hora3 != undefined && this.users[i].Hora4 != undefined) {
      this.users[i].HoraTrabajada = (this.users[i].Hora2 - this.users[i].Hora1) + (this.users[i].Hora4 - this.users[i].Hora3);
    }
    if (this.users[i].Hora1 != undefined && this.users[i].Hora2 != undefined && this.users[i].Hora3 == undefined && this.users[i].Hora4 == undefined) {
      this.users[i].HoraTrabajada = (this.users[i].Hora2 - this.users[i].Hora1);
    }
    if (this.users[i].HoraTrabajada != 0) {

      let valor1;
      let valor2;
      let valor3;
      let valor4;
      if (this.users[i].HoraTrabajada.toString().length == 3) {
        valor1 = this.users[i].HoraTrabajada.toString().substr(0, 1);
        valor2 = this.users[i].HoraTrabajada.toString().substr(1, 1);
        valor3 = this.users[i].HoraTrabajada.toString().substr(2, 1);
        // tslint:disable-next-line:radix
        if (valor2 > 5) {
          // tslint:disable-next-line:radix
          valor2 = parseInt(valor2) - 4;
          const total = valor1 + valor2.toString() + valor3;
          this.users[i].HoraTrabajada = total;
        }

      } else {
        valor1 = this.users[i].HoraTrabajada.toString().substr(0, 1);
        valor2 = this.users[i].HoraTrabajada.toString().substr(1, 1);
        valor3 = this.users[i].HoraTrabajada.toString().substr(2, 1);
        valor4 = this.users[i].HoraTrabajada.toString().substr(3, 1);
        if (valor3 > 5) {
          // tslint:disable-next-line:radix
          valor3 = parseInt(valor3) - 4;
          const total = valor1 + valor2 + valor3 + valor4;
          this.users[i].HoraTrabajada = total;
        }
      }
    }
    return true;
  }

  onChange(files: File[]) {
    this.users = [];
    this.file = files;
    this.archivo.nombre = this.file[0].name;

    if (files[0]) {
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
                this.fechaAcomodada = new DatePipe(objeto.Fecha);
                this.fechaAcomodada = objeto.Fecha;
                console.log(this.fechaAcomodada);
                objeto.Departamento = this.dataList[i].Departamento;
                objeto.Hora1 = this.dataList[i].Hora;
                objeto.Hora2 = this.dataList[i + 1].Hora;
                objeto.timbradas = 0;
                objeto.HoraTrabajada = 0;
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

  guardarDatos(file) {
    this.uploadFile = file;
    let formData = new FormData();
    for (let i = 0; i < this.uploadFile.length; i++) {
      formData.append('uploads[]', this.uploadFile[i], this.uploadFile[i].name);
    }
    this.imagenesService.guardarArchivo(formData).subscribe(r => {
      console.log(r);
    });
  }


  getArchivoById(id) {
    this.imagenesService.getOneArchivo(id).subscribe(r => {
      this.limpiarDatos(r['datos']['usuarios']);
    });
  }

  guardarArchivoPersonas(data?) {
    if (data.length == this.array.length) {
      this.archivo.usuarios = data;
      this.imagenesService.guardarArchivoUsuarios(this.archivo).subscribe(res => {
        localStorage.setItem('idArchivo', res['datos']['_id']);
        this.getArchivoById(res['datos']['_id']);
      });
    }
  }

  obtenerArchivoExistente() {
    this.activeSelect = true;
    this.imagenesService.getArchivoUsuarios().subscribe(r => {
      this.dbFiles = r['datos'];
    });
  }

  loadData(id) {
    this.imagenesService.getOneArchivo(id).subscribe(r => {
      this.limpiarDatos(r['datos']['usuarios']);
    });
  }


  limpiarDatos(array) {
    this.users = array.sort(function (o1, o2) {
      if (o1.Nombre > o2.Nombre && o1.Fecha == o2.Fecha) {
        return 1;
      }
      if (o1.Nombre < o2.Nombre && o1.Fecha == o2.Fecha) {
        return -1;
      }
      return 0;
    });
    this.file = null;
  }

  crearUsuario() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].timbradas != 0 || this.users[i].HoraTrabajada != 0) {
        this.array.push(this.users[i]);
        this.imagenesService.createUser(this.users[i]).subscribe(res => {
          this.newArray.push(res);
          this.ids.push(res['_id']);
          this.guardarArchivoPersonas(this.ids);
        });
      }
    }
    this.limpiarDatos(this.newArray);
  }

  actualizar() {
    this.imagenesService.actualizarPersona(this.user).subscribe(res => {

    });

  }

}
