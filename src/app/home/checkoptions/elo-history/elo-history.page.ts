import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { EloService } from 'src/app/elo.service';
import { Chart } from 'chart.js';

declare var kendo, $;

@Component({
  selector: 'app-elo-history',
  templateUrl: './elo-history.page.html',
  styleUrls: ['./elo-history.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EloHistoryPage implements OnInit {
  @ViewChild('barChart',{static: false}) barChart;

  bars: any;
  colorArray: any;

  constructor(public eloService: EloService) { }
  

  ngOnInit() {
  
  }

  ionViewDidEnter() {
    // this.createELOChart('default');
    let el = $('#elo-history-view-wrapper');
    console.log(el.height());
    $('#barChart').height(el.height()+ "px");
    this.createBarChart();
  }

  createBarChart() {
    let eloHistory = this.eloService.getELOHistory();
    
    let labels = [];
    let elos = [];
    let dataElos = [];

    // for(const x of eloHistory)
    // {
    //   labels.unshift(x.dateObj);
    //   elos.unshift(x.elo);
    //   dataElos
    // }

    console.log(labels, elos);
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        // labels: labels,
        datasets: [{
          label: 'ELO',
          data: eloHistory,
          fill: false,
          backgroundColor: '#e0b500', // array should have same number of elements as number of dataset
          //borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            type: 'time',
            offset: true,
            time: {
                unit: 'day',
            }
          }]
        }
      }
    });
  }
  // createELOChart(which) {
  //   let eloHistory = this.eloService.getELOHistory();
  //   console.log("eloHistory", JSON.stringify(eloHistory));
  //   let gDataSource = new kendo.data.DataSource({data:eloHistory});
  //   gDataSource.read();
  //   console.log(gDataSource);
  //   console.log("gDataSource.data()",gDataSource.data());
  //   let lTitle = "?";
  //   let lFieldName = "";
  //   let lField = "gewicht";
  //   let lValueAxisFormat = "{0}";
  //   let lTooltipTemplate = "#= series.name #: #= kendo.toString(value, 'n1') #";
  //   let lSeriesColor = "#D8801F"; // blue: "#009FE2";
  //   let lCategoryAxisLabelSteps = 1;
  //   let displayedValues = gDataSource.total();

  //   let now = new Date().getTime();
  //   let backUntil = null;
    
  //   let dateDayDifference = (first, second) => {
  //       return Math.round((second-first)/(1000*60*60*24));
  //   };

  //   if (eloHistory.length > 2) {
  //     let firstDate = eloHistory[0].dateObj;
  //     let lastDate = eloHistory[eloHistory.length-1].dateObj;
  //     let days = dateDayDifference(firstDate, lastDate); // e.g. 365
  //     lCategoryAxisLabelSteps = Math.floor(days / 5);
  //     console.log('axislabel steps: '+lCategoryAxisLabelSteps+' (at '+days+' - '+firstDate+')');
  //   }
    
  //   if (which == 'default' || which === undefined) {
  //     lTitle = "ELO Historie";
  //     lField = "elo";
  //     lFieldName = "ELO";
  //     lValueAxisFormat = "{0}";
  //     lTooltipTemplate = "#= value # am #= kendo.toString(dataItem.dateObj,'dd.MM.yyyy') #";
  //   }

  //   let normalBMIRange = [600, 2600]; // boGetBMIRange('normal', gPerson);
    
  //   let chartAreaHeight = $('#elo-history-view-wrapper')[0].scrollHeight - 32;
  //   let chartConfig = {
  //      legend: {
  //        position: "bottom"
  //      },
  //      chartArea: {
  //        background: "",
  //        height: chartAreaHeight
  //      },
  //      seriesDefaults: {
  //        type: "line",
  //        style: "smooth"
  //      },
  //      dataSource: {data: gDataSource.data()},
  //      series: [{
  //           field: lField,
  //           name: lFieldName,
  //           color: lSeriesColor
  //           }],
  //      valueAxis: {
  //        labels: {
  //          format: lValueAxisFormat
  //        },
  //        line: {
  //          visible: false
  //        }
  //      },
  //      categoryAxis: {
  //        type: "date",
  //        field: "dateObj",
  //          majorGridLines: {
  //            visible: false
  //           },
  //        labels: {
  //        rotation: 270,
  //          step: lCategoryAxisLabelSteps,
  //          dateFormats: {
  //         days:'dd.MM.yyyy'
  //          }
  //        },
  //        baseUnitStep: 1,
  //        baseUnit: "days"
  //      },
  //      tooltip: {
  //        visible: true,
  //        format: "{0}%",
  //        template: lTooltipTemplate
  //      }
  //   };
    
  //   chartConfig["valueAxis"]["min"] = 200;
  //   chartConfig["valueAxis"]["max"] = 3000;
    
  //   console.log(JSON.stringify(chartConfig));
  //   $("#elochart").kendoChart(chartConfig);
  // }

}
