import { Pipe, PipeTransform } from '@angular/core'
import { WEEKDAY } from './storage.service'

@Pipe({
  name: 'weekday'
})
export class WeekdayPipe implements PipeTransform {

  transform (value: WEEKDAY): string {
    switch (value) {
      case 'MON':
        return '月'
      case 'TUE':
        return '火'
      case 'WED':
        return '水'
      case 'THU':
        return '木'
      case 'FRI':
        return '金'
      case 'SAT':
        return '土'
      case 'SUN':
        return '日'
    }
    return ''
  }

}
