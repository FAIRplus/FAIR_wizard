package uk.ac.ebi.fairwizard.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Assessment;
import uk.ac.ebi.fairwizard.model.FairAssessment;
import uk.ac.ebi.fairwizard.model.FairAssessmentLevel;
import uk.ac.ebi.fairwizard.model.Indicator;
import uk.ac.ebi.fairwizard.model.IndicatorGroup;
import uk.ac.ebi.fairwizard.mongo.AssessmentRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AssessmentService {
  private final ResourceLoader resourceLoader;
  private final ApplicationConfig applicationConfig;
  private final ObjectMapper jsonMapper;
  private final AssessmentRepository assessmentRepository;

  public AssessmentService(ResourceLoader resourceLoader, ApplicationConfig applicationConfig,
                           ObjectMapper jsonMapper, AssessmentRepository assessmentRepository) {
    this.resourceLoader = resourceLoader;
    this.applicationConfig = applicationConfig;
    this.jsonMapper = jsonMapper;
    this.assessmentRepository = assessmentRepository;
  }


  @PostConstruct
  public void init() throws ApplicationStatusException {
    if (applicationConfig.isLoadResourcesOnStart()) {
      log.warn("Loading FAIR assessment from file to the database");
      loadAssessmentFromFile();
    }
  }

  public List<Assessment> getFairAssesment() throws ApplicationStatusException {
    List<Assessment> assessments = new ArrayList<>();
//    InputStream in = null;
//    try {
//      in = resourceLoader.getResource(applicationConfig.getFairAssessmentFile()).getInputStream();
//    } catch (Exception e) {
//      throw new ApplicationStatusException("Failed to read fair assessment fiel");
//    }

    String assessmentFile = "classpath:assessment.csv"; //applicationConfig.getFairAssessmentFile()
    try (InputStream in = resourceLoader.getResource(assessmentFile).getInputStream();
         CSVReader reader = new CSVReader(new InputStreamReader(in))) {
      String[] f = reader.readNext();
      log.info("Reading assessment header with " + f.length + " fields");
      boolean headerSkipped = false;
      while ((f = reader.readNext()) != null) {
        if (!headerSkipped) {
          headerSkipped = true;
          continue;
        }
        // Expecting csv file Leveles, Sub-principle, ID, Indicator, Category, Lables
        List<String> labels = Arrays.stream(f[5].split(",")).collect(Collectors.toList());
        assessments.add(
          new Assessment(f[0], f[1], f[2], f[3], f[4], true, "", "", labels));
      }
    } catch (IOException | CsvValidationException e) {
      throw new ApplicationStatusException("Failed to read FAIR assessment file");
    }

    return assessments;
  }

  public List<IndicatorGroup> getIndicatorsForAssessment() {
    return assessmentRepository.findAll();
  }

  public FairAssessment getFairAssessment(List<IndicatorGroup> indicatorGroups) {
    for (IndicatorGroup group : indicatorGroups) {
      for (Indicator indicator : group.getIndicators()) {

      }
    }







    int fairLevel = 1;
    float fairPercentage = 90;
    Map<String, Float> fairCategories = Map.of("cat 1", 85f, "cat 3", 80f, "cat 4", 91f, "cat 5", 95f, "cat 2", 90f);
    List<Indicator> indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList()));
    FairAssessmentLevel fairAssessmentLevel = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 2;
    fairPercentage = 80;
    fairCategories = Map.of("cat 1", 70f, "cat 3", 80f, "cat 4", 75f, "cat 5", 95f, "cat 2", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList()));
    FairAssessmentLevel fairAssessmentLevel2 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 3;
    fairPercentage = 80;
    fairCategories = Map.of("cat 1", 70f, "cat 3", 80f, "cat 4", 75f, "cat 5", 95f, "cat 2", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList()));
    FairAssessmentLevel fairAssessmentLevel3 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 4;
    fairPercentage = 80;
    fairCategories = Map.of("cat 1", 70f, "cat 3", 80f, "cat 4", 75f, "cat 5", 95f, "cat 2", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList()));
    FairAssessmentLevel fairAssessmentLevel4 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 5;
    fairPercentage = 80;
    fairCategories = Map.of("cat 1", 70f, "cat 3", 80f, "cat 4", 75f, "cat 5", 95f, "cat 2", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList()));
    FairAssessmentLevel fairAssessmentLevel5 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);

    List<FairAssessmentLevel> fairLevels = List.of(fairAssessmentLevel, fairAssessmentLevel2, fairAssessmentLevel3, fairAssessmentLevel4, fairAssessmentLevel5);
    int overallFairLevel = 4;
    float overallFairPercentage = 85.0f;
    Map<String, Integer> categoriesMap = Map.of("cat 1", 4, "cat 3", 3, "cat 4", 1, "cat 5", 5, "cat 2", 2);
    FairAssessment fairAssessment = new FairAssessment(overallFairLevel, overallFairPercentage, categoriesMap, fairLevels);

    return fairAssessment;
  }

  private void loadAssessmentFromFile() throws ApplicationStatusException {
    assessmentRepository.deleteAll();

    try (InputStream in = resourceLoader.getResource(applicationConfig.getFairAssessmentFile()).getInputStream()) {
      List<IndicatorGroup> indicators = jsonMapper.readValue(in, new TypeReference<>() {
      });
//      populateReverseLinks(fairResources);
//      validateResources(fairResources);
      assessmentRepository.saveAll(indicators);
    } catch (IOException e) {
      log.error("Failed to load FAIR resources from file {}", e.getMessage(), e);
    }
  }

}
