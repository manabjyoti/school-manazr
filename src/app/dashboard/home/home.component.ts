import { Component, OnInit, Input, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardConfig, DashboardWidget, GridType, DisplayGrid, ToolPaletteItem, DashboardItemComponentInterface } from '../dashboard.model';
import { Subscription } from 'rxjs/internal/Subscription';


import { StudentCountComponent } from '../widgets/student-count/student-count.component';
import { StaffCountComponent } from '../widgets/staff-count/staff-count.component';
import { LeaveDetailsComponent } from '../widgets/leave-details/leave-details.component';
import { ClassStatsComponent } from '../widgets/class-stats/class-stats.component';
import { FeeCollectionStatsComponent } from '../widgets/fee-collection-stats/fee-collection-stats.component';
import { ClassCountComponent } from '../widgets/class-count/class-count.component';
import { SubjectCountComponent } from '../widgets/subject-count/subject-count.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Input() dashboardId: string;
  public options: DashboardConfig;
  public items: DashboardWidget[];
  protected subscription: Subscription;
  public toolPaletteItems: ToolPaletteItem[];
  private canDrop = true;
  public components = {
    studentCount: StudentCountComponent,
    staffCount: StaffCountComponent,
    leaveDetails: LeaveDetailsComponent,
    classStats: ClassStatsComponent,
    sessionFeeStats: FeeCollectionStatsComponent,
    subjectCount: SubjectCountComponent,
    classesCount: ClassCountComponent
  };

  constructor(private dashboardService: DashboardService, private elementRef: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.options = {
      disablePushOnDrag: true,
      draggable: { enabled: true },
      gridType: GridType.Fit,
      resizable: { enabled: true }
    };
    this.dashboardId = '1'; // fortest
    this.getOptions();
    this.getToolPaletteItems();
    this.subscribe();
  }

  protected subscribe() {
    this.subscription = this.dashboardService.getDashboard(this.dashboardId).subscribe(data => {
      // console.log(data);
      this.items = data.widgets;
    });

  }

  public getOptions() {

    //
    // There is some documentation re angular-gridster2's config properties in this file: gridsterConfig.constant.ts
    // See: https://github.com/tiberiuzuld/angular-gridster2/blob/master/projects/angular-gridster2/src/lib/gridsterConfig.constant.ts
    //

    this.options = {

      disablePushOnDrag: true,
      displayGrid: DisplayGrid.Always,
      draggable: {
        enabled: true,
        ignoreContent: true,
        // dropOverItems: true,
        dropOverItems: false,
        dragHandleClass: 'drag-handler',
        ignoreContentClass: 'no-drag',
      },
      emptyCellDragMaxCols: 20,
      emptyCellDragMaxRows: 20,
      emptyCellDropCallback: this.onDrop.bind(this),
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: false,
      gridType: GridType.ScrollVertical,
      itemResizeCallback: this.itemResize.bind(this),
      maxCols: 18,
      maxRows: 25,
      minCols: 12, // 6
      minRows: 15,  // 6
      pushDirections: { north: true, east: true, south: true, west: true },
      pushItems: true,
      resizable: { enabled: true }
      // swap: true,
    };

  }

  public getToolPaletteItems() {

    const subscription: Subscription = this.dashboardService.getToolPaletteItems().subscribe(data => {

      this.toolPaletteItems = data;
      // this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));

      subscription.unsubscribe();
    });

  }

  public ngOnChanges(changes: SimpleChanges) {
    this.dashboardId = changes.dashboardId.currentValue;
    this.unsubscribe();
    this.subscribe();
  }

  public onDragEnter(event) {
    const gridsterPreviewElements = this.elementRef.nativeElement.getElementsByTagName('gridster-preview');
    this.renderer.setStyle(gridsterPreviewElements[0], 'background', 'rgba(0, 0, 0, .15)');
  }

  public onDrop(event) {
    if (this.canDrop) {
      this.canDrop = false;
      const widgetId = event.dataTransfer.getData('widgetIdentifier');
      const toolPaletteItem = this.getToolPaletteItem(widgetId);
      const widget = { cols: 4, rows: 4, y: 0, x: 0, ...toolPaletteItem };
      this.items.push(widget);
      setTimeout(() => {
        this.canDrop = true;
      }, 1000);
    }
  }

  public onDelete(item) {
    this.items.splice(this.items.indexOf(item), 1);
    const gridsterPreviewElements = this.elementRef.nativeElement.getElementsByTagName('gridster-preview');
    this.renderer.setStyle(gridsterPreviewElements[0], 'background', '#fafafa');
  }

  public onSettings(item) {
    console.log('Settings is Clicked');
  }

  public getToolPaletteItem(widgetId: string) {

    return this.toolPaletteItems.find(toolPaletteItem => toolPaletteItem.id === widgetId);
  }

  protected unsubscribe() {

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  public itemResize(item: DashboardWidget, itemComponent: DashboardItemComponentInterface): void {

    // this.dashboardWidgetService.reflowWidgets();
  }

}
