import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import Plotly from 'plotly.js';

/**
 * @param traces
 * @param layout
 * @param onPlotlyClick
 */
export default class PlotlyChartComponent extends Component {
  id = guidFor(this);
  el;

  @action
  onInsert() {
    let el = document.getElementById(this.id);
    this.el = el;

    Plotly.newPlot(el, this.args.traces, this.args.layout, { displaylogo: false });
  }

  @action
  onUpdate() {
    Plotly.react(this.el, this.args.traces, this.args.layout, { displaylogo: false });
  }
}
