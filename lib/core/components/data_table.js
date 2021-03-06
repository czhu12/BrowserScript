import { Grid } from 'ag-grid-community';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';

import Component from "./component";

export default class DataTable extends Component {
  createElement() {
    const div = this._createElement('div');
    div.classList.add("ag-theme-alpine");
    if (this.options.width && this.options.height) {
      div.style = `width:${this.options.width}px; height: ${this.options.height};`;
    } else {
      div.style = `width:100%; height:300px;`;
    }
    return div;
  }

  getValue() {
    return window.__bs_data[this.id()].gridOptions.rowData;
  }

  onCreate() {
    if (!('__bs_data' in window)) {
      window.__bs_data = {}
    }
    window.__bs_data[this.id()] = new Grid(this.el, {...this.options.gridOptions, onCellValueChanged: this.options.onChange});
  }
}