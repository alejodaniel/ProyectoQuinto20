import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../environments/environment';

@Pipe({
    name: 'image'
})
export class ImagePipe implements PipeTransform {
    url = environment.url;

    transform(img: string, userId: string): string {
        return this.url + 'user/imagen/' + userId + '/' + img;
    }

}
