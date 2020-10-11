import { VNodeDirective } from 'vue'

export interface ElScrollbar extends VNodeDirective{
  name: 'scrollbar';
  value: Function;
}
