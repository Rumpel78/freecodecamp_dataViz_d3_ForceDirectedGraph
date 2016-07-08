import SvgCanvas from './SvgCanvas';

export default class ForceDirectedGraph extends SvgCanvas {
  postprocessData(data) {
    // Expecting data in form of 2 arrays: nodes[id, color] and array links[source,target]
    console.log(data);
    return data;
  }
  createGraph(parentElement) {
    const itemsNodes = parentElement.selectAll('.dataItem').data(this.data.nodes);
    this.itemsExit(itemsNodes.exit(), true);
    this.itemsEnter(itemsNodes.enter(), true);
    this.itemsUpdate(itemsNodes, true);

    const itemsLinks = parentElement.selectAll('.dataItem').data(this.data.links);
    this.itemsExit(itemsLinks.exit(), false);
    this.itemsEnter(itemsLinks.enter(), false);
    this.itemsUpdate(itemsLinks, false);
  }
  drawGraph() {
    this.createGraph(this.dataGroup);
  }

   itemsEnter(items, isNode) {
     if (isNode) {
       items.append('circle')
           .attr('class', 'dataNode')
           .attr('r', 5)
           .on('mouseover', d => this.onMouseOver(d))
           .on('mouseout', () => this.onMouseOut());
     } else {
       items.append('line')
           .attr('class', 'dataLine')
           .attr('stroke-width', 1)
           .on('mouseover', d => this.onMouseOver(d))
           .on('mouseout', () => this.onMouseOut());
     }
   }
}
