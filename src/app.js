// Create main svg element
var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");

// Set flags container
var flags = d3.select('.flagContainer')
                .style('width', `${width}px`)
                .style('height', `${height}px`);

// Create tooltip
var tooltip = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

// Prepare simulation 
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id((d, i) => i))
    .force("charge", d3.forceManyBody().distanceMax(500).distanceMin(100).strength(-4))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Load data, set graph
d3.json("datasets/countries.json", function(error, graph) {
    if (error) throw error;
      
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");
      
    var node = flags
        .selectAll('.flag')
        .data(graph.nodes)
        .enter()
        .append('img')
        .attr('class', d => `flag flag-${d.code}`)
        .on('mouseover', d => this.onMouseOver(d))
        .on('mouseout', () => this.onMouseOut())
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
      
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
      
    simulation.force("link")
        .links(graph.links);
      
    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
      
        node
            .style('left', d => `${d.x - 8}px`)
            .style('top', d => `${d.y - 5}px`);
    }
});
      
function dragstarted(d) {
    if (!d3.event.active) 
        simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}
      
function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}
      
function dragended(d) {
    if (!d3.event.active) 
        simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function onMouseOver(dataItem) {
    const content = dataItem.country;
    if (content !== '') {
        tooltip
            .transition()
            .duration(200)
            .style('opacity', 0.9)
            .style('left', `${d3.event.pageX + 10}px`)
            .style('top', `${d3.event.pageY - 30}px`);
      
        tooltip
            .html(content);
    }
  }

function onMouseOut() {
    tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
}
