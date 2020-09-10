import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { FeeService } from 'src/app/services/fee.service';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-fee-collection-stats',
  templateUrl: './fee-collection-stats.component.html',
  styleUrls: ['./fee-collection-stats.component.scss']
})
export class FeeCollectionStatsComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{
      ticks: {
        callback: (value, index, values) => {
            return '₹ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
    }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Fee Collected (INR)', backgroundColor: '#5585e8' }
  ];

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.feeService.getCollectionStats().subscribe(
      (res: ApiResponse) => {
        if (res.data){
          res.data.map((v, i) => {
            this.barChartLabels.push(v.Name);
            // const studentCount = v.Students ? v.Students.split(',').length : 0;
            this.barChartData[0].data.push(v.Collection);
          });
        }
      }
    );
  }

}
