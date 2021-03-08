import React, { useEffect } from 'react'
import * as d3 from 'd3'
import datos from "./data/datos-mapa.csv"
import * as topojson from 'topojson'
import { json } from 'd3'
import './style.css'

    // function textArt(text) {
    // // let fontIndex = Math.round(Math.random() * FONTS.length);
    // // let fontFamily = FONTS[fontIndex] + ", " + BASE_FONT;

    // // bigText.style("font-family", fontFamily).text(text);

    // // dummyText.style("font-family", fontFamily).text(text);
    // let bbox = dummyText.node().getBBox();

    // let textWidth = bbox.width;
    // let textHeight = bbox.height;
    // let xGap = 3;
    // let yGap = 1;

    // let selection = effectLayer
    //     .selectAll("text")
    //     .data(positions, function (d) {
    //         return d.text + "/" + d.index;
    //     });

    // selection.exit().transition().style("opacity", 0).remove();

    // selection
    //     .enter()
    //     .append("text")
    //     .text(function (d) {
    //         return d.text;
    //     })
    //     .attr("x", function (d) {
    //         return d.x;
    //     })
    //     .attr("y", function (d) {
    //         return d.y;
    //     })
    //     // .style("font-family", fontFamily)
    //     .style("fill", "#777")
    //     .style("opacity", 0);

    // selection
    //     // .style("font-family", fontFamily)
    //     .attr("x", function (d) {
    //         return d.x;
    //     })
    //     .attr("y", function (d) {
    //         return d.y;
    //     });

    // selection
    //     .transition()
    //     .delay(function (d) {
    //         return d.distance * 0.01 + Math.random() * 1000;
    //     })
    //     .style("opacity", function (d) {
    //         return 0.1 + Math.random() * 0.4;
    //     });
    // }

const Mapa = () => {

   // Copyright (c) 2017 John Alexis Guerra Gómez

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
useEffect(() => {
    debugger
    var tooltip = d3
.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var width = 400,
height = 500,
centered;

// Define color scale
var color = d3.scaleLinear()
.domain([1, 20])
.clamp(true)
.range(["#fff", "#409A99"]);

var projection = d3.geoMercator()
.scale(1500)
// Center the Map in Colombia
.center([-74, 4.5])
.translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

function responsivefy(svg) {
var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

// add viewBox and preserveAspectRatio properties,
// and call resize so that svg resizes on inital page load
svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

// to register multiple listeners for same event type, 
// you need to add namespace, i.e., 'click.foo'
// necessary if you call invoke this function for multiple svgs
// api docs: https://github.com/mbostock/d3/wiki/Selections#on
d3.select(window).on("resize." + container.attr("id"), resize);

// get width of container and resize svg to fit it
function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
}
}
// Set svg width & height
var svg = d3.select("svg")
.attr("width", width)
.attr("height", height)
.call(responsivefy)

// Add background
svg
.append("rect")
.attr("class", "background")
.attr("width", width)
.attr("height", height);

var g = svg.append("g");

var effectLayer = g.append("g").classed("effect-layer", true);

var mapLayer = g.append("g").classed("map-layer", true);

var dummyText = g
.append("text")
.classed("dummy-text", true)
.attr("x", 10)
.attr("y", 30)
.style("opacity", 0);

var bigText = g
.append("text")
.classed("big-text", true)
.attr("x", 20)
.attr("y", 45);

var data_dpt = null;

// Load map data
d3.json("./data/Colombia.geo.json").then(function (mapData) {
    debugger
var features = mapData.features;

// Update color scale domain based on data
color.domain([0, d3.max(features, nameLength)]);
// Draw each province as a path
function processData(allText) {
    var record_num = 6; // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    var entries = allTextLines[0].split(";");
    var jsonData = {};
    var topSolicitudesSinTramite = {
        "1": {solicitudes: 0},
        "2": {solicitudes: 0},
        "3": {solicitudes: 0},
    }

    for (var i = 1; i < allTextLines.length; i++) {
        var deptoActual = allTextLines[i].split(";");
        jsonData[deptoActual[0]] = {
            nombre: deptoActual[1],
        };
        for (var j = 2; j < record_num; j++) {
            jsonData[deptoActual[0]] = {
                ...jsonData[deptoActual[0]],
                [entries[j]]: parseInt(deptoActual[j]),
            };
        }

        if(jsonData[deptoActual[0]]["Solicitudes sin tramite"] > topSolicitudesSinTramite["1"].solicitudes) {
            topSolicitudesSinTramite["3"] = topSolicitudesSinTramite["2"]
            topSolicitudesSinTramite["2"] = topSolicitudesSinTramite["1"]
            topSolicitudesSinTramite["1"] = {
                solicitudes: jsonData[deptoActual[0]]["Solicitudes sin tramite"],
                departamento: deptoActual[0]
            }
        } else if(jsonData[deptoActual[0]]["Solicitudes sin tramite"] > topSolicitudesSinTramite["2"].solicitudes) {
            topSolicitudesSinTramite["3"] = topSolicitudesSinTramite["2"]
            topSolicitudesSinTramite["2"] = {
                solicitudes: jsonData[deptoActual[0]]["Solicitudes sin tramite"],
                departamento: deptoActual[0]
            }
        } else if(jsonData[deptoActual[0]]["Solicitudes sin tramite"] > topSolicitudesSinTramite["3"].solicitudes) {
            topSolicitudesSinTramite["3"] = {
                solicitudes: jsonData[deptoActual[0]]["Solicitudes sin tramite"],
                departamento: deptoActual[0]
            }
        }
    }

    jsonData[topSolicitudesSinTramite["1"]["departamento"]] = {
        ...jsonData[topSolicitudesSinTramite["1"]["departamento"]],
        topSolicitudesSinTramite: 1
    }

    jsonData[topSolicitudesSinTramite["2"]["departamento"]] = {
        ...jsonData[topSolicitudesSinTramite["2"]["departamento"]],
        topSolicitudesSinTramite: 2
    }

    jsonData[topSolicitudesSinTramite["3"]["departamento"]] = {
        ...jsonData[topSolicitudesSinTramite["3"]["departamento"]],
        topSolicitudesSinTramite: 3
    }

    data_dpt = jsonData;
    mapLayer
        .selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("vector-effect", "non-scaling-stroke")
        .style("fill", fillFn)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
}
fetch("./data/datos-mapa.csv").then((response)=>{
    return response.json()
}).then(json=>{
    processData(json)
})
// $.ajax({
//     type: "GET",
//     url: "./data/datos-mapa.csv",
//     dataType: "text",
//     success: function (data) {
//         processData(data);
//     },
// });
});

// Get province name
function nameFn(d) {
return d && d.properties ? d.properties.NOMBRE_DPT : null;
}

// Get province name length
function nameLength(d) {
var n = nameFn(d);
return n ? n.length : 0;
}

// Get province color
function fillFn(d) {
return "#eee";
}

function mouseover(d) {
// Tooltip
let dataDptActual = data_dpt[d.properties.NOMBRE_DPT];

tooltip.transition().duration(200).style("opacity", 0.9);
// var a = Math.random() * 200;
tooltip
    .html(
        "<b>" +
        dataDptActual["nombre"] +
        `</b><hr style="background-color: white"></hr>` +
        `<div class='item-tooltip'>Defensores de familia: ${dataDptActual["Defensores"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>` +
        `<div class='item-tooltip'>Comisarios de familia: ${dataDptActual["Comisarios"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>` +
        `<div class='item-tooltip'>Procuradores judiciales: ${dataDptActual["Procuradores"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>`+
        `<div class='item-tooltip'>Procesos Administrativos de Restablecimiento de Derechos: ${dataDptActual["Solicitudes sin tramite"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>`
    )
    .style("left", 100 + "px")
    .style("top", 100 + "px");

// Highlight hovered province
if(!dataDptActual["topSolicitudesSinTramite"]) 
    d3.select(this).style("fill", "#00568F");
else if(dataDptActual["topSolicitudesSinTramite"] === 1) 
    d3.select(this).style("fill", "#FF0000");
else if(dataDptActual["topSolicitudesSinTramite"] === 2) 
    d3.select(this).style("fill", "#E3800C");
else if(dataDptActual["topSolicitudesSinTramite"] === 3) 
    d3.select(this).style("fill", "#F5D590");

// Draw effects
// textArt(nameFn(d));
}

function mouseout(d) {
tooltip.transition().duration(500).style("opacity", 0);
// Reset province color
mapLayer.selectAll("path").style("fill", "#eee");
//.style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

// Remove effect text
effectLayer.selectAll("text").transition().style("opacity", 0).remove();

// Clear province name
bigText.text("");
}
},[])


    return (
        <div>
            <div class="contenedor-mapa">
                <div class="contenedor-indicadores">
                <div class="contenedor-indicador"><div id="top-1" class="cuadro-color"></div>Departamento con más Procesos Administrativos de Restablecimiento de Derechos</div>
                <div class="contenedor-indicador"><div id="top-2" class="cuadro-color"></div>Segundo departamento con más Procesos Administrativos de Restablecimiento de Derechos</div>
                <div class="contenedor-indicador"><div id="top-3" class="cuadro-color"></div>Tercer departamento con más Procesos Administrativos de Restablecimiento de Derechos</div>
                </div>
                <svg id='mapa-colombia'></svg>
            </div>
        </div>
    )
}

export default Mapa