export const DECISION_TREE = [
  {
    "id": "1",
    "question": "What is the dataset/project status?",
    "answers": [
      {
        "text": "Prospective data",
        "labels": ["Prospective data"],
        "next": "2"
      },
      {
        "text": "Retrospective data",
        "labels": ["Retrospective data"],
        "next": "3"
      }
    ]
  },
  {
    "id": "2",
    "question": "What is the data type?",
    "answers": [
      {
        "text": "Metabolomics",
        "labels": ["Metabolomics"],
        "next": "0"
      },
      {
        "text": "Transcriptomics",
        "labels": ["Transcriptomics"],
        "next": "0"
      },
      {
        "text": "Chemical compounds",
        "labels": ["Chemical compounds"],
        "next": "0"
      },
      {
        "text": "Cell line metadata",
        "labels": ["Cell line metadata"],
        "next": "4"
      }
    ]
  },
  {
    "id": "3",
    "question": "Do you want to perform FAIR assessment?",
    "answers": [
      {
        "text": "Yes",
        "labels": ["FAIR assessment"],
        "next": "0"
      },
      {
        "text": "No",
        "labels": [],
        "next": "2"
      }
    ]
  },
  {
    "id": "4",
    "question": "Which FAIR principle do you want to focus?",
    "answers": [
      {
        "text": "Findability",
        "labels": ["Findability"],
        "next": "0"
      },
      {
        "text": "Interoperability",
        "labels": ["Interoperability"],
        "next": "0"
      },
      {
        "text": "Resuability",
        "labels": ["Resuability"],
        "next": "0"
      },
      {
        "text": "Accessiblity",
        "labels": ["Accessiblity"],
        "next": "0"
      }
    ]
  }
];

export const FAIR_RESOURCES = [
  {
    "id": "1",
    "name": "FAIR Resource",
    "location": "http://www.google.com",
    "description": "Test FAIR resource",
    "image": "assets/img/fair_resource.jpg"
  },
  {
    "id": "2",
    "name": "FAIR Resource 2",
    "location": "http://www.google.com",
    "description": "Test FAIR resource 2",
    "image": "assets/img/fair_resource.jpg"
  },
  {
    "id": "2",
    "name": "FAIR Resource 2",
    "location": "http://www.google.com",
    "description": "Test FAIR resource 2, this is a really long description to check how cards work",
    "image": "assets/img/fair_resource.jpg"
  },
  {
    "id": "2",
    "name": "FAIR Resource 2, this is a long title for the card",
    "location": "http://www.google.com",
    "description": "Test FAIR resource 2",
    "image": "assets/img/fair_resource.jpg"
  },
  {
    "id": "2",
    "name": "FAIR Resource 2",
    "location": "http://www.google.com",
    "description": "Test FAIR resource 2",
    "image": "assets/img/fair_resource.jpg"
  },
  {
    "id": "2",
    "name": "FAIR Resource 2",
    "location": "http://www.google.com",
    "description": "Test FAIR resource 2",
    "image": "assets/img/fair_resource.jpg"
  },
  {
    "id": "2",
    "name": "FAIR Resource 2",
    "location": "http://www.google.com",
    "description": "Test FAIR resource 2",
    "image": "assets/img/fair_resource.jpg"
  }
];
