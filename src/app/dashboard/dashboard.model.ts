import { GridsterConfig, GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';

export enum DisplayGrid {
    Always = 'always',
    OnDragAndResize = 'onDrag&Resize',
    None = 'none'
}
export enum CompactType {
    None = 'none',
    CompactUp = 'compactUp',
    CompactLeft = 'compactLeft',
    CompactUpAndLeft = 'compactUp&Left',
    CompactLeftAndUp = 'compactLeft&Up',
    CompactRight = 'compactRight',
    CompactUpAndRight = 'compactUp&Right',
    CompactRightAndUp = 'compactRight&Up',
}

export enum GridType {
    Fit = 'fit',
    ScrollVertical = 'scrollVertical',
    ScrollHorizontal = 'scrollHorizontal',
    Fixed = 'fixed',
    VerticalFixed = 'verticalFixed',
    HorizontalFixed = 'horizontalFixed'
}

export interface DashboardItem extends GridsterItem {
    id?: string;
    name?: string;
    component?: any;
    // icon?: string;
  }

export interface DashboardConfig extends GridsterConfig {}

export interface DashboardWidget extends DashboardItem {}

export interface DashboardItemComponentInterface extends GridsterItemComponentInterface {}

export interface Dashboard {
  id?: string;
  name?: string;
  widgets?: Array<DashboardWidget>;
}

export interface ToolPaletteItem {

    id?: string;
    name?: string;
    component?: any;
    icon?: string;
}