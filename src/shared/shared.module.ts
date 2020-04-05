import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketChartComponent } from './market-chart/market-chart.component';
import { WeekdayPipe } from './weekday.pipe'

@NgModule({
  declarations: [MarketChartComponent, WeekdayPipe],
  exports: [ MarketChartComponent, WeekdayPipe ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
