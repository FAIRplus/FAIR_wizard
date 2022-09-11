package uk.ac.ebi.fairwizard.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Assessment;
import uk.ac.ebi.fairwizard.model.FairAssessment;
import uk.ac.ebi.fairwizard.model.IndicatorGroup;
import uk.ac.ebi.fairwizard.service.AssessmentService;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AssessmentController {
  private static final Logger LOG = LoggerFactory.getLogger(AssessmentController.class);

  private final AssessmentService assessmentService;

  public AssessmentController(AssessmentService assessmentService) {
    this.assessmentService = assessmentService;
  }

  @GetMapping("assessment")
  public List<IndicatorGroup> getAssessment() throws ApplicationStatusException {
    return assessmentService.getIndicatorsForAssessment();
  }

//  @PostMapping("assessment")
  @GetMapping("assessment2")
  public FairAssessment saveAssessment() {
    return assessmentService.getFairAssessment(new ArrayList<>());
  }
}
