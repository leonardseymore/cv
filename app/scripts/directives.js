'use strict';

angular.module('cvApp')

  //http://www.ng-newsletter.com/posts/d3-on-angular.html
  .directive('d3Bars', function($window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, element, attrs) {
        var renderTimeout;
        var margin = parseInt(attrs.margin) || 20,
          barHeight = parseInt(attrs.barHeight) || 20,
          barPadding = parseInt(attrs.barPadding) || 5;

        var svg = d3.select(element[0])
          .append('svg')
          .style('width', '100%');

        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        scope.render = function(data) {
          svg.selectAll('*').remove();

          if (!data) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(function() {
            var width = d3.select(element[0])[0][0].offsetWidth - margin,
              height = scope.data.length * (barHeight + barPadding),
              color = d3.scale.category20(),
              xScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                  return d.score;
                })])
                .range([0, width]);

            svg.attr('height', height);

            svg.selectAll('rect')
              .data(data)
              .enter()
              .append('rect')
              .on('click', function(d,i) {
                return scope.onClick({item: d});
              })
              .attr('height', barHeight)
              .attr('width', 140)
              .attr('x', Math.round(margin/2))
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding);
              })
              .attr('fill', function(d) {
                return color(d.score);
              })
              .transition()
              .duration(1000)
              .attr('width', function(d) {
                return xScale(d.score);
              });
            svg.selectAll('text')
              .data(data)
              .enter()
              .append('text')
              .attr('fill', '#fff')
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding) + 15;
              })
              .attr('x', 15)
              .text(function(d) {
                return d.name + " (scored: " + d.score + ")";
              });
          }, 200);
        };
      }};
  })

  .directive('skillsMatrix', function($window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, element, attrs) {
        var renderTimeout;

        var diameter = element.width();
        var svg = d3.select(element[0])
          .append('svg')
          .attr("width", diameter)
          .attr("height", diameter)
          .append("g")
          .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        scope.render = function(d) {
          svg.selectAll('*').remove();

          if (!d) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          var data = {};
          angular.copy(d, data);

          renderTimeout = $timeout(function() {
            var tree = d3.layout.tree()
              .size([360, element.width() / 2 - 120])
              .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

            var diagonal = d3.svg.diagonal.radial()
              .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

            var nodes = tree.nodes(data),
              links = tree.links(nodes);

            var link = svg.selectAll(".link")
              .data(links)
              .enter().append("path")
              .attr("class", "link")
              .attr("d", diagonal);

            var node = svg.selectAll(".node")
              .data(nodes)
              .enter().append("g")
              .attr("class", function(d) {return d.level == 10 ? "high" : "node";})
              .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

            node.append("circle")
              .attr("r", 4.5);

            node.append("text")
              .attr("dy", ".31em")
              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
              .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
              .text(function(d) { return d.name + (d.level ? " (" + d.level + ")" : ""); });

            svg.attr("height", element.width());
          }, 200);
        };
      }};
  })

;
