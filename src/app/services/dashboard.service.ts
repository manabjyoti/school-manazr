import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import {Dashboard, ToolPaletteItem} from '../dashboard/dashboard.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // private readonly DASHBOARDS = 'http://demo6720989.mockable.io/dashboardwidgets';
  private readonly DASHBOARDS = environment.apiURL + 'dashboard-widgets.php';
  private readonly TOOL_PALETTE_ITEMS = 'http://demo6720989.mockable.io/toolbar';

  constructor(protected httpClient: HttpClient) { }
  public getDashboards(): Observable<Dashboard[]> {
    return this.httpClient.get<Dashboard[]>(this.DASHBOARDS);
  }

  public getDashboard(dashboardId: string): Observable<Dashboard>  {
    return this.httpClient.get<Dashboard[]>(this.DASHBOARDS).pipe(
      map((dashboards: Dashboard[]) =>
        dashboards.find(dashboard => dashboard.id === dashboardId)));
  }

  public getToolPaletteItems(): Observable<ToolPaletteItem[]> {
    return this.httpClient.get<ToolPaletteItem[]>(this.TOOL_PALETTE_ITEMS);
  }

  public getToolPaletteItem(widgetId: string): Observable<ToolPaletteItem>  {

    return this.httpClient.get<ToolPaletteItem[]>(this.TOOL_PALETTE_ITEMS).pipe(
      map((toolPaletteItems: ToolPaletteItem[]) =>
        toolPaletteItems.find(toolPaletteItem => toolPaletteItem.id === widgetId)));
  }
}
