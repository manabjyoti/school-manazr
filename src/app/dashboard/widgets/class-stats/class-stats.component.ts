import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { ClassService } from 'src/app/services/class.service';
import { ApiResponse } from 'src/app/models/models';

@Component({
  selector: 'app-class-stats',
  templateUrl: './class-stats.component.html',
  styleUrls: ['./class-stats.component.scss']
})
export class ClassStatsComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
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
    { data: [], label: 'Student Count' }
  ];

  constructor(private classService: ClassService) { }

  ngOnInit() {
    this.classService.listClass().subscribe(
      (res: ApiResponse) => {
        if (res.data){
          res.data.map((v, i) => {
            this.barChartLabels.push(v.Name);
            const studentCount = v.Students ? v.Students.split(',').length : 0;
            this.barChartData[0].data.push(studentCount);
          });
        }
      }
    );
  }

  // events
  // public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //   console.log(event, active);
  // }

}
