var graph = undefined;

function renderGraph(simart, fisheyeEnable, highlightEnable) {

    //set graph size and color
    var svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    //parse graph
    if(graph === undefined)
        graph = JSON.parse(simart);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    //update
    var update = function () {

        //delete previous links & nodes
        svg.selectAll("g.nodes").remove();
        svg.selectAll("g.links").remove();
        svg.selectAll("g.node").remove();

        //set links
        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function (d) {
                return 2;
            });

        //set fisheye effect if fisheye enabled
        if (fisheyeEnable) {
            var fisheye = d3.fisheye.circular()
                .radius(100)
                .distortion(2);
        }

        var node;

        node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .on("click", function (d) {
                if (d3.event.shiftKey) {
                   // console.log("aa");
                    //location.href = '/artist/' + d.id;
                    $("#artistname").text(d.id);
                    $.get('/html/artist/' + d.id, function(res){
                        $("#artistinfo").html(res);
                    });
                    $.get('/json/artist/' + d.id, function(res){
                        var a = JSON.parse(res);
                        for(var item in a.nodes) {
                            if(findNode(a.nodes[item].id) == undefined)
                                addNode(a.nodes[item].id, a.nodes[item].group + d.group);
                        }
                        for(var item in a.links) {
                            if(findLink(a.links[item].source, a.links[item].target) == undefined)
                                //console.log("asd");
                                addLink(a.links[item].source, a.links[item].target);
                        }

                        update();
                    });
                }
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("circle")
            .attr("r", function (d) {
                if(d.group == 0)
                    return 9;
                else
                    return 7;
            })
            .attr("fill", function (d) {
                return color(d.group);
            });

        node.append("title")
            .text(function (d) {
                return d.id;
            });

        node.append("text")
            .attr("dx", function (d) {
                if (d.id.length < 5)
                    return d.id.length * 3;
                else
                    return 10;
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.id
            });

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
            node
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")"
                });
        }

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        //mouseover different in fisheye and highlight effect
        if (highlightEnable) {
            node.on("mouseover", function (d) {
                link.style('stroke-width', function (l) {
                    if (d === l.source || d === l.target)
                        return 3;
                    else
                        return 2;
                });
                link.style('stroke', function (l) {
                    if (d === l.source || d === l.target)
                        return "#000";
                    else
                        return "#999";
                });
                node.select("circle").style('r', function (a) {
                    if (d == a) {
                        return 12;
                    }
                    else {
                        var neighborNodes = findNeighborNodes(d);
                        for (var i in neighborNodes) {
                            if (a.id == neighborNodes[i].id) {
                                return 10;
                            }
                        }
                        return 6;
                    }
                });
                node.style('stroke-width', function (l) {
                    if (d == l) {
                        return 2;
                    }
                    else
                        return 0;
                });
                node.select("text").style('font-weight', function (l) {
                    if (d == l) {
                        return 'bold';
                    }
                    else
                        return 'normal';
                });
            });
        }

        if (fisheyeEnable) {

            d3.select("svg").on("mousemove", function () {

                fisheye.focus(d3.mouse(this));

                node.each(function (d) {
                    d.fisheye = fisheye(d);
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.fisheye.x + "," + d.fisheye.y + ")";
                    })
                    .attr("r", function (d) {
                        return d.fisheye.z * 4.5;
                    })
                    .attr("font-weight", function (d) {
                        return "bold";
                    });

                link.attr("x1", function (d) {
                    return d.source.fisheye.x;
                })
                    .attr("y1", function (d) {
                        return d.source.fisheye.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.fisheye.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.fisheye.y;
                    });
            });
        }

    };

    update();

    // Add and remove elements on the graph object
    function addNode(id, group) {
        graph.nodes.push({
            "id": id,
            "group": group
        });
        update();
    }

    function addLink(source, target) {
        graph.links.push({"source": source, "target": target});
        update();
    }

    function removeNode(id) {
        var i = 0;
        var n = findNode(id);
        while (i < graph.links.length) {
            if ((graph.links[i]['source'] == n) || (graph.links[i]['target'] == n)) {
                graph.links.splice(i, 1);
            }
            else i++;
        }
        graph.nodes.splice(findNodeIndex(id), 1);
        update();
    }

    function removeLink(source, target) {
        for (var i = 0; i < graph.links.length; i++) {
            if (graph.links[i].source.id == source && graph.links[i].target.id == target) {
                graph.links.splice(i, 1);
                break;
            }
        }
        update();
    }

    function removeallLinks() {
        graph.links.splice(0, graph.links.length);
        update();
    }

    function removeAllNodes() {
        graph.nodes.splice(0, graph.links.length);
        update();
    }

    function findNode(id) {
        for (var i in graph.nodes) {
            if (graph.nodes[i]["id"] === id) return graph.nodes[i];
        }
    }

    function findNodeIndex(id) {
        for (var i = 0; i < graph.nodes.length; i++) {
            if (graph.nodes[i].id == id) {
                return i;
            }
        }
    }

    function findLink (source, target) {
        for (var i in graph.links) {
            if (graph.links[i]["source"].id == source) {
                if (graph.links[i]["target"].id == target) {
                    console.log(graph.links[i]["source"].id);
                    return graph.links[i];
                }
            }
        }
    }

    var findNeighborNodes = function (id) {
        var neighborNodes = [];
        var nodeId;
        for (var i in graph.links) {
            if (graph.links[i]["source"] == id) {
                nodeId = graph.links[i]["target"];
                if (neighborNodes.indexOf(nodeId) == -1)
                    neighborNodes.push(findNode(nodeId.id));
            } else if (graph.links[i]["target"] == id) {
                nodeId = graph.links[i]["source"];
                if (neighborNodes.indexOf(nodeId) == -1)
                    neighborNodes.push(findNode(nodeId.id));
            }
        }
        //console.log(neighborNodes);
        return neighborNodes;
    };

    /*
     setTimeout(function () {
     removeNode('The Killers');
     }, 8000);*/
    /*
     for (var j = 0; j < graph.links.length; j++) {
     (function (j) {

     setTimeout(function () {
     removeLink(graph.links[j].source, graph.links[j].target);
     }, j * 2000);

     })(j);
     }
     */

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}

function addEffect(fisheyeEnable, hightlightEnable) {
    renderGraph(graph, fisheyeEnable, hightlightEnable);
}