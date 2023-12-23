import * as Relax from '../dist/relax.js';

const points = [
    {x: 37, y: 44},
    {x: 99, y: 44},
    {x: 161, y: 45},
    {x: 222, y: 45},
    {x: 283, y: 47},
    {x: 37, y: 205},
    {x: 99, y: 147},
    {x: 160, y: 109},
    {x: 221, y: 86},
    {x: 282, y: 73},
    {x: 343, y: 72},
    {x: 649, y: 44},
    {x: 587, y: 44},
    {x: 525, y: 45},
    {x: 464, y: 45},
    {x: 403, y: 47},
    {x: 649, y: 205},
    {x: 587, y: 147},
    {x: 526, y: 109},
    {x: 465, y: 86},
    {x: 404, y: 73}
];

const triangles = [
    [0,5,6],
    [0,6,1],
    [1,6,7],
    [1,7,2],
    [2,7,8],
    [2,8,3],
    [3,8,9],
    [3,9,4],
    [4,9,10],
    [11,17,16],
    [11,12,17],
    [12,18,17],
    [12,13,18],
    [13,19,18],
    [13,14,19],
    [14,20,19],
    [14,15,20],
    [15,10,20]
];

export function bridgeExample(rc) {
    const ps = points.map((point) => rc.addPoint(point.x, point.y));

    triangles.forEach((triangle) => {
        const p0 = ps[triangle[0]];
        const p1 = ps[triangle[1]];
        const p2 = ps[triangle[2]];
        rc.addLine(p0, p1);
        rc.addLine(p1, p2);
        rc.addLine(p2, p0);

        const dist = (e1, e2) => {
            let d1 = points[e1];
            let d2 = points[e2];
            let x1 = d1.x;
            let y1 = d1.y;
            let x2 = d2.x;
            let y2 = d2.y;
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        };

        rc.addConstraint(new Relax.geom.LengthConstraint(p0, p1, dist(triangle[0], triangle[1])));
        rc.addConstraint(new Relax.geom.LengthConstraint(p1, p2, dist(triangle[1], triangle[2])));
        rc.addConstraint(new Relax.geom.LengthConstraint(p2, p0, dist(triangle[2], triangle[0])));
    });

    rc.addConstraint(new Relax.geom.CoordinateConstraint(ps[0], points[0]));
    rc.addConstraint(new Relax.geom.CoordinateConstraint(ps[5], points[5]));

    rc.addConstraint(new Relax.geom.CoordinateConstraint(ps[11], points[11]));
    rc.addConstraint(new Relax.geom.CoordinateConstraint(ps[16], points[16]));
    const weight = new Relax.geom.WeightConstraint(ps[10], 10);
    rc.addConstraint(weight);

    window.rc = rc;
    if (!document.body.querySelector("#weightSlider")) {
        const slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.id = "weightSlider";
        document.body.appendChild(slider);
        slider.min = 0;
        slider.max = 20;
        slider.value = "10";
        slider.oninput = (evt) => {
            weight.setWeight(parseFloat(evt.currentTarget.value));
        }

        slider.setAttribute("type", "range");
        slider.id = "weightSlider";
        document.body.appendChild(slider);
        slider.min = 0;
        slider.max = 20;
        slider.value = "10";
        slider.oninput = (evt) => {
            weight.setWeight(parseFloat(evt.currentTarget.value));
        };
    }

    if (!document.body.querySelector("#iterationSlider")) {
        const slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.id = "iterationSlider";
        document.body.appendChild(slider);
        slider.min = 0;
        slider.max = 10;
        slider.value = "3";
        rc.showSomeIteration = 3;
        slider.oninput = (evt) => {
            rc.showSomeIteration = parseFloat(evt.currentTarget.value);
        }
    }
}

/* global window document */
