import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketChartComponent } from './market-chart/market-chart.component'

@NgModule({
  declarations: [MarketChartComponent],
  exports: [ MarketChartComponent ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
