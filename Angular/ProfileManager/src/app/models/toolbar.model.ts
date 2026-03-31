export type ToolbarAction = 'create' | 'edit' | 'view' | 'delete';

export interface UserActions {
  actionType: ToolbarAction;
  selectedProfileId?: string | null;
  openDrawer: boolean;
}
