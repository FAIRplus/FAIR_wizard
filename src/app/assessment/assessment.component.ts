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


  private features = ["Content related","Representation and format","Hosting environment"];
  private data1 = [{"Content related": 3, "Representation and format": 4, "Hosting environment": 5},
    {"Content related": 5, "Representation and format": 4, "Hosting environment": 1},
    {"Content related": 2, "Representation and format": 1, "Hosting environment": 3}];


  private svg;
  private margin = 40;
  private width = 560 - (this.margin * 2);
  private height = 500 - (this.margin * 2);
  private radialScale;
  private zoomFactor = 1.3;

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

    this.drawAssessmentFigures(); // todo temp
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
        this.drawAssessmentFigures();
      });
  }

  drawAssessmentFigures() {
    this.createSvgForSpider();
    this.drawSpider(this.data1);
  }

  private createSvgForSpider(): void {
    this.svg = d3.select("figure#spider")
      .append("svg")
      .attr("width", this.width + (this.margin))
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.margin / 2 + "," + this.margin / 2 + ")");
  }

  private drawSpider(data: any[]): void {
    this.radialScale = d3.scaleLinear()
      .domain([0,10])
      .range([0,250]);
    let ticks = [1, 2, 3, 4, 5];

    ticks.forEach(t =>
      this.svg.append("circle")
        .attr("cx", this.width / 2)
        .attr("cy", this.height / 2)
        .attr("fill", "none")
        .attr("stroke", "#eaeaea")
        .attr("r", this.radialScale(t * this.zoomFactor))
    );

    ticks.forEach(t =>
      this.svg.append("text")
        .attr("x", this.width / 2 + 5)
        .attr("y", this.height / 2 - this.radialScale(t * this.zoomFactor))
        .text(t.toString())
    );

    for (let i = 0; i < this.features.length; i++) {
      let ft_name = this.features[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      let line_coordinate = this.angleToCoordinate(angle, 6 * this.zoomFactor);
      let label_coordinate = this.angleToCoordinate(angle, 6.5 * this.zoomFactor);

      //draw axis line
      this.svg.append("line")
        .attr("x1", this.width / 2)
        .attr("y1", this.height / 2)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

      //draw axis label
      this.svg.append("text")
        .attr("x", label_coordinate.x - 75)
        .attr("y", label_coordinate.y + 10)
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
    return {"x": this.width / 2 + x, "y": this.height / 2 - y};
  }

  private getPathCoordinates(data_point){
    let coordinates = [];
    for (let i = 0; i < this.features.length; i++){
      let ft_name = this.features[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      coordinates.push(this.angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }


}
