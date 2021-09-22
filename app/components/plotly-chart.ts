import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import Plotly from 'plotly.js';

interface Args {
  traces: Plotly.Data[];
  layout: Plotly.Layout;
}

/**
 * @param traces
 * @param layout
 * @param onPlotlyClick
 */
export default class PlotlyChartComponent extends Component<Args> {
  id: string = guidFor(this);
  el: HTMLElement | undefined;

  @action
  onInsert(): void {
    let el = document.getElementById(this.id);

    if (el !== null) {
      this.el = el;

      Plotly.newPlot(el, this.args.traces, this.args.layout, { displaylogo: false });
    }
  }

  @action
  onUpdate(): void {
    if (this.el) {
      Plotly.react(this.el, this.args.traces, this.args.layout, { displaylogo: false });
    }
  }
}
