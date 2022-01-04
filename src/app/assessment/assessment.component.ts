import { Component, OnInit } from '@angular/core';
import {DecisionService} from "../decision.service";
import {FairResource} from "../models/FairResource";

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {

  public selectedLevels = "Level-0";
  fairResources: FairResource[];

  assessmentFields = [
    {
      "levels":"Level-0",
      "Sub-principle":"Level-0: Content",
      "id":"F+MM-0.1C",
      "name":"The Data object or dataset as an entity is undefined or undescribed",
      "category":"Content",
      "labels":[
        ""
      ],
      "score_overall":true
    },
    {
      "levels":"Level-0",
      "Sub-principle":"Level-0: Content",
      "id":"F+MM-0.2C",
      "name":"No metadata available",
      "category":"Content",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-0",
      "Sub-principle":"Level-0: Representation & Format",
      "id":"F+MM-0.1R",
      "name":"No formal definition or representation of metadata",
      "category":"Representation & Format",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-0",
      "Sub-principle":"Level-0: Representation & Format",
      "id":"F+MM-0.2R",
      "name":"Metadata not available in machine readable format (e.g. no metadata or in pdf)",
      "category":"Representation & Format",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-0",
      "Sub-principle":"Level-0: Hosting Env. Capabilities",
      "id":"F+MM-0.1H",
      "name":"Data or metadata is hosted in non-accessible storage (e.g., personal desktop, local file system or archive) and only retrievable by a single or limited users",
      "category":"Hosting Env. Capabilities",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-0",
      "Sub-principle":"Level-0: Hosting Env. Capabilities",
      "id":"F+MM-0.2H",
      "name":"Data or metadata hosted in an accessible resource but with no retrieval capability",
      "category":"Hosting Env. Capabilities",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Content",
      "id":"F+MM-1.1C",
      "name":"Data object is defined and it is assigned a globally unique and persistent identifier",
      "category":"Content",
      "labels":[
        "select your identifier scheme"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Content",
      "id":"F+MM-1.2C",
      "name":"Metadata for the data object includes generic descriptive elements of the data object as a whole (e.g., name, description, keywords)",
      "category":"Content",
      "labels":[
        "model your domain"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Content",
      "id":"F+MM-1.3C",
      "name":"Metadata includes study/project level summary information (i.e., project-level metadata)",
      "category":"Content",
      "labels":[
        "project metadata"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Representation & Format",
      "id":"F+MM-1.1R",
      "name":"Representation of metadata conforms to a locally defined model/schema (e.g., dictionary of key/value pairs)",
      "category":"Representation & Format",
      "labels":[
        "model your domain"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Representation & Format",
      "id":"F+MM-1.2R",
      "name":"Data Objects do not conform to a defined or structured representation (data model)",
      "category":"Representation & Format",
      "labels":[
        "data model",
        "data representation",
        "model your domain"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Representation & Format",
      "id":"F+MM-1.3R",
      "name":"Metadata available in a machine-readable format (e.g. CSV, JSON, XML, or similar)",
      "category":"Representation & Format",
      "labels":[
        "data format"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Hosting Env. Capabilities",
      "id":"F+MM-1.1H",
      "name":"Data retrieval capability Data object AND its metadata record are indexed and retrievable via its globally unique and persistent identifier by a standardized communication protocol",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "accessibility",
        "protocols"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Hosting Env. Capabilities",
      "id":"F+MM-1.2H",
      "name":"The standardized communication protocol for data / metadata retrieval is open, free and universally implementable such as HTTP, FTP (e.g. simple links for download)",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "accessibility"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-1",
      "Sub-principle":"Level-1: Hosting Env. Capabilities",
      "id":"F+MM-1.3H",
      "name":"If legally required, the hosting environment offers authentication and authorisation capabilities",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "accessibility",
        "hosting strategies",
        "IP checker"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Content",
      "id":"F+MM-2.1C",
      "name":"Each study variable is reported in a single dataset field / variable",
      "category":"Content",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Content",
      "id":"F+MM-2.2C",
      "name":"Metadata includes dataset field/variable level metadata (e.g. field name, field description and type) ",
      "category":"Content",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Content",
      "id":"F+MM-2.3C",
      "name":"Data values (i.e. field/variable values) are standardized against a locally defined dictionary of terms within and across datasets",
      "category":"Content",
      "labels":[
        "validate against standards"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Content",
      "id":"F+MM-2.4C",
      "name":"Metadata contains access information for the data",
      "category":"Content",
      "labels":[
        "accessibility"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Representation & Format",
      "id":"F+MM-2.1R",
      "name":"Metadata describing project datasets conforms to a Defined Standard Model (e.g. DCAT, DublinCore, BioSchemas)",
      "category":"Representation & Format",
      "labels":[
        "apply data model on metadata",
        "interoperability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Representation & Format",
      "id":"F+MM-2.2R",
      "name":"Overall project/study data representation uniformly conforms to a locally defined (project-defined) data model or schema providing contextual information about the relationships between data content across datasets",
      "category":"Representation & Format",
      "labels":[
        "interoperability",
        "reusability",
        "findability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Representation & Format",
      "id":"F+MM-2.3R",
      "name":"Dataset(s) available in machine readable format (e.g. CSV, JSON, XML, or similar) ",
      "category":"Representation & Format",
      "labels":[
        "interoperability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Hosting Env. Capabilities",
      "id":"F+MM-2.1H",
      "name":"Retrieval capability\nData and Metadata exchange format is retrieved using API technologies (REST, RPC, GRAPHQL)",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "accessibility",
        "data retrieval"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-2",
      "Sub-principle":"Level-2: Hosting Env. Capabilities",
      "id":"F+MM-2.2H",
      "name":"Search capability\nMetadata is registered or indexed in a searchable resource. Data can be retrieved via its metadata descriptive elements",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "findability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Content",
      "id":"F+MM-3.1C",
      "name":"Data values (i.e. field/variable values) are standardized against community standard controlled vocabularies and/or ontologies",
      "category":"Content",
      "labels":[
        "validate against standards"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Content",
      "id":"F+MM-3.2C",
      "name":"Metadata includes license information under which data can be reused",
      "category":"Content",
      "labels":[
        "data access"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Representation & Format",
      "id":"F+MM-3.1R",
      "name":"Overall project/study data representation conforms to a community defined standard domain model (e.g., domain specific repos, OMOP, DATS, ISA)",
      "category":"Representation & Format",
      "labels":[
        "interoperability",
        "reusability",
        "evaluate against standards"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Representation & Format",
      "id":"F+MM-3.2R",
      "name":"Dataset(s) available in a structural representation conforming to a community data exchange standard model (e.g. domain specific repos, SDTM, FHIR, or similar)",
      "category":"Representation & Format",
      "labels":[
        "interoperability",
        "reusability",
        "evaluate against standards"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Representation & Format",
      "id":"F+MM-3.3R",
      "name":"Dataset(s) available in machine readable community standard format relevant to the adopted domain and data model",
      "category":"Representation & Format",
      "labels":[
        "interoperability",
        "reusability",
        "evaluate against standards"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Hosting Env. Capabilities",
      "id":"F+MM-3.1H",
      "name":"Search capability\nData content is searchable. (e.g. data is retrieable via queries for standarised field names, ontology or controlled terms reported in the datasets",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "findability",
        "vocabulary annotation"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Hosting Env. Capabilities",
      "id":"F+MM-3.2H",
      "name":"The hosting environment is a public / controlled-access repository",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "hosting strategies",
        "accessibility"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Hosting Env. Capabilities",
      "id":"F+MM-3.3H",
      "name":"The hosting environment offers data archiving capability",
      "category":"Hosting Env. Capabilities",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-3",
      "Sub-principle":"Level-3: Hosting Env. Capabilities",
      "id":"F+MM-3.4H",
      "name":"The hosting environment offers version control capability",
      "category":"Hosting Env. Capabilities",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Content",
      "id":"F+MM-4.1C",
      "name":"Dataset(s) are semantically typed",
      "category":"Content",
      "labels":[
        "semantics"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Content",
      "id":"F+MM-4.2C",
      "name":"Dataset(s) fields are semantically typed",
      "category":"Content",
      "labels":[
        "semantics"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Content",
      "id":"F+MM-4.3C",
      "name":"Master Data Entities across all datasets are defined",
      "category":"Content",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Content",
      "id":"F+MM-4.5C",
      "name":"Relevant attributes are provided to allow reuse of the data between communities",
      "category":"Content",
      "labels":[
        "reusability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Representation & Format",
      "id":"F+MM-4.1R",
      "name":"Metadata is represented in a semantic machine interpretable form",
      "category":"Representation & Format",
      "labels":[
        "semantics",
        "interoperability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Representation & Format",
      "id":"F+MM-4.2R",
      "name":"Master entity models are formally represented",
      "category":"Representation & Format",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-4",
      "Sub-principle":"Level-4: Hosting Env. Capabilities",
      "id":"F+MM-4.1H",
      "name":"Search capability\nCross-study data is queryable via harmonized master data entities and their attributes",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "findability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Content",
      "id":"F+MM-5.1C",
      "name":"Domain model entities are defined and harmonized against enterprise managed master data entities (e.g. Observation Features Types, Subject Types, Domain Types)",
      "category":"Content",
      "labels":[
        "interoperability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Content",
      "id":"F+MM-5.2C",
      "name":"Field/Variable Level data is linked and harmonized against enterprise managed Reference Data (e.g. MDR registered Data Elements)",
      "category":"Content",
      "labels":[
        "interoperability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Content",
      "id":"F+MM-4.4C",
      "name":"Metadata includes provenance information according to a cross-community language",
      "category":"Content",
      "labels":[
        "reusability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Representation & Format",
      "id":"F+MM-5.1R",
      "name":"Data-linked Data Elements are represented and formatted in a community standard model/format (e.g. ISO 11179 MDR standard)",
      "category":"Representation & Format",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Representation & Format",
      "id":"F+MM-5.2R",
      "name":"Data-linked controlled terminologies and ontologies are formatted and represented by community standards",
      "category":"Representation & Format",
      "labels":[
        "vocabulary management",
        "interoperability"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Hosting Env. Capabilities",
      "id":"F+MM-5.1H",
      "name":"Hosting Environment implements Master Data Management Capability",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "hosting strategies"
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Hosting Env. Capabilities",
      "id":"F+MM-5.2H",
      "name":"Hosting Environment implements Reference Data Management Capability",
      "category":"Hosting Env. Capabilities",
      "labels":[
        ""
      ],
      "score_overall":false
    },
    {
      "levels":"Level-5",
      "Sub-principle":"Level-5: Hosting Env. Capabilities",
      "id":"F+MM-5.3H",
      "name":"Hosting Environment implements Data Governance Capability",
      "category":"Hosting Env. Capabilities",
      "labels":[
        "accessibility",
        "privacy restriction checker"
      ],
      "score_overall":false
    }
  ]
  displayedFields;

  constructor(public decisionService: DecisionService) { }

  ngOnInit(): void {
    this.decisionService.getAssessments()
      .subscribe(p => {
        this.assessmentFields = p;
        this.filterResults("Level-0");
      });
  }

  filterResults(levels) {
    this.selectedLevels = levels;
    this.displayedFields = this.assessmentFields.filter(a => a.levels === levels);
  }

  submitAssessment() {
    this.decisionService.searchResources(Array.from(this.filters.values())).subscribe(r => this.fairResources = r);
  }

  get filters() : Set<string> {
    let filters = new Set<string>();
    for (let field of this.assessmentFields) {
      if (!field.score_overall) {
        for(let l of field.labels)
          filters.add(l);
      }
    }
    return filters;
  }

}
