import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class ForFilterPipe implements PipeTransform {

  transform(items: any[], field: string, value: any): any[] {
    if (!items) { return []; }
    if (value === undefined || value === '' || value.length === 0) { return items; }
    if (typeof value === 'number'){
      return items.filter(it => it[field] === value);
    }else{
      return items.filter(it => it[field].toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
  }

}

@Pipe({
  name: 'sort'
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}


