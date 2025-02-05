// Einfachere Version des Radar Charts mit D3.js
function renderRadarChart() {
    const data = [
      { label: "Indicator 1", value: 70 },
      { label: "Indicator 2", value: 60 },
      { label: "Indicator 3", value: 80 },
      { label: "Indicator 4", value: 90 },
      { label: "Indicator 5", value: 50 },
    ];
  
    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2;
  
    const svg = d3.select("#radarChart")
      .html("") // Bestehenden Inhalt löschen
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
    const angleSlice = (2 * Math.PI) / data.length;
    const scale = d3.scaleLinear().domain([0, 100]).range([0, radius]);
  
    // Punkte zeichnen
    const points = data.map((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      return [scale(d.value) * Math.cos(angle), scale(d.value) * Math.sin(angle)];
    });
  
    // Datenlinie zeichnen
    svg.append("polygon")
      .attr("points", points.map(d => d.join(",")).join(" "))
      .attr("fill", "rgba(0, 128, 255, 0.5)")
      .attr("stroke", "blue")
      .attr("stroke-width", 2);
  
    // Achsenlinien zeichnen
    data.forEach((d, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", scale(100) * Math.cos(angle))
        .attr("y2", scale(100) * Math.sin(angle))
        .attr("stroke", "black")
        .attr("stroke-width", 1);
  
      // Labels hinzufügen
      svg.append("text")
        .attr("x", (scale(110) * Math.cos(angle)))
        .attr("y", (scale(110) * Math.sin(angle)))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(d.label)
        .style("font-size", "10px");
    });
  }
  