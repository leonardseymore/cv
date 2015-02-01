'use strict';

angular.module('cvApp')

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
          .attr("class", "tree")
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
              .attr("r", function(d) {return d.level == 10 ? 4.5 : 1;});

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
