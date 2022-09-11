import { Component, OnInit } from '@angular/core';
import {DecisionService} from "../decision.service";
import {FairResource} from "../models/FairResource";
import {Question} from "../models/DecisionNode";
import {AssessmentResult, IndicatorGroup} from "../models/FairAssessment";
import {AssessmentService} from "../assessment.service";
import * as d3 from 'd3'

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {


  private features = ["A","B","C","D","E","F"];
  private data1 = [{"A": 3, "B": 4, "C": 5, "D": 2, "E": 1, "F": 8},
    {"A": 5, "B": 4, "C": 1, "D": 5, "E": 3, "F": 2},
    {"A": 2, "B": 7, "C": 3, "D": 7, "E": 7, "F": 5}];


  //
  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private svg1;
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  private radialScale;

  private createSvgForSpider(): void {
    this.svg = d3.select("figure#spider")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.width + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawSpider(data: any[]): void {
    this.radialScale = d3.scaleLinear()
      .domain([0,10])
      .range([0,250]);
    let ticks = [2,4,6,8,10];

    ticks.forEach(t =>
      this.svg.append("circle")
        .attr("cx", 300)
        .attr("cy", 300)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", this.radialScale(t))
    );

    ticks.forEach(t =>
      this.svg.append("text")
        .attr("x", 305)
        .attr("y", 300 - this.radialScale(t))
        .text(t.toString())
    );

    for (let i = 0; i < this.features.length; i++) {
      let ft_name = this.features[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      let line_coordinate = this.angleToCoordinate(angle, 10);
      let label_coordinate = this.angleToCoordinate(angle, 10.5);

      //draw axis line
      this.svg.append("line")
        .attr("x1", 300)
        .attr("y1", 300)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

      //draw axis label
      this.svg.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    }

    let line = d3.line()
      .x((d: any) => d.x)
      .y((d: any) => d.y);
    let colors = ["darkorange", "gray", "navy"];

    for (let i = 0; i < data.length; i ++){
      let d = data[i];
      let color = colors[i];
      let coordinates = this.getPathCoordinates(d);

      //draw the path element
      this.svg.append("path")
        .datum(coordinates)
        .attr("d",line)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);
    }
  }

  private angleToCoordinate(angle, value){
    let x = Math.cos(angle) * this.radialScale(value);
    let y = Math.sin(angle) * this.radialScale(value);
    return {"x": 300 + x, "y": 300 - y};
  }

  private getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < this.features.length; i++){
      let ft_name = this.features[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      coordinates.push(this.angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }

  private createSvg(): void {
    this.svg1 = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.Framework))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg1.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg1.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg1.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Framework))
      .attr("y", d => y(d.Stars))
      .attr("width", x.bandwidth())
      .attr("height", (d) => this.height - y(d.Stars))
      .attr("fill", "#d04a35");
  }

  // assessmentFields;



  indicators: IndicatorGroup[];
  currentIndicatorIndex: number;
  currentIndicatorGroup: IndicatorGroup;
  progress = 10;
  assessmentResult: AssessmentResult;

  constructor(public assessmentService: AssessmentService) {

  }

  ngOnInit(): void {
    this.assessmentService.getIndicatorsForAssessment()
      .subscribe(p => {
        this.indicators = p;
        this.initAssessment();
      });

    // this.createSvg();
    // this.drawBars(this.data);
    // this.createSvgForSpider();
    // this.drawSpider(this.data1);
  }

  initAssessment() {
    this.currentIndicatorIndex = 0;
    this.progress = 0;
    this.currentIndicatorGroup = this.indicators[this.currentIndicatorIndex];
  }

  nextIndicatorGroup() {
    if (this.currentIndicatorIndex < this.indicators.length - 1) {
      this.currentIndicatorIndex += 1;
      this.progress = this.currentIndicatorIndex / this.indicators.length * 100;
      this.currentIndicatorGroup = this.indicators[this.currentIndicatorIndex];
    }
  }

  previousIndicatorGroup() {
    if (this.currentIndicatorIndex > 0) {
      this.currentIndicatorIndex -= 1;
      this.progress = this.currentIndicatorIndex / this.indicators.length * 100;
      this.currentIndicatorGroup = this.indicators[this.currentIndicatorIndex];
    }
  }

  submitAssessment() {
    this.assessmentService.submitAssessment(this.indicators)
      .subscribe(r => {
        this.progress = 100;
        this.assessmentResult = r
        console.log(this.assessmentResult);

        this.createSvg();
        this.drawBars(this.data);
        this.createSvgForSpider();
        this.drawSpider(this.data1);
      });
  }

  // get filters() : Set<string> {
  //   let filters = new Set<string>();
  //   for (let field of this.assessmentFields) {
  //     if (!field.score_overall) {
  //       for(let l of field.labels)
  //         filters.add(l);
  //     }
  //   }
  //   return filters;
  // }

}
