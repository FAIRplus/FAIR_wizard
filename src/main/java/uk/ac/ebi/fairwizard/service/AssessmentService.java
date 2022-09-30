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
import java.util.HashMap;
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
    /*int overallFairLevel = 0;
    float overallFairPercentage = 0.0f;
    List<FairAssessmentLevel> fairLevels = new ArrayList<>();
    Map<String, Integer> overallFairCategoriesMap = new HashMap<>();

    //todo consider about the linked indicators
    Map<Integer, List<Indicator>> levelIndicatorMap = new HashMap<>();
    for (IndicatorGroup group : indicatorGroups) {
      for (Indicator indicator : group.getIndicators()) {
        if (!levelIndicatorMap.containsKey(indicator.getLevel())) {
          levelIndicatorMap.put(indicator.getLevel(), new ArrayList<>());
        }
        levelIndicatorMap.get(indicator.getLevel()).add(indicator);
      }
    }

    for (Map.Entry<Integer, List<Indicator>> entry : levelIndicatorMap.entrySet()) {
      boolean levelComplete = true;
      int completeCount = 0;
      int totalCount = 0;
      Map<String, Float> categoryPercentageMap = new HashMap<>();
      Map<String, Integer> categoryCompleteCountMap = new HashMap<>();
      Map<String, Integer> categoryCountMap = new HashMap<>();
      for (Indicator indicator : entry.getValue()) {
        totalCount++;
        categoryCountMap.put(indicator.getCategory(), categoryCountMap.getOrDefault(indicator.getCategory(), 0));
        if (indicator.isEvaluation()) {
          completeCount++;
          categoryCompleteCountMap.put(indicator.getCategory(), categoryCompleteCountMap.getOrDefault(indicator.getCategory(), 0));
        } else {
          levelComplete = false;
        }
      }

      for (Map.Entry<String, Integer> e : categoryCountMap.entrySet()) {
        categoryPercentageMap.put(e.getKey(), categoryCompleteCountMap.get(e.getKey()) * 100f / e.getValue());
      }

      float fairPercentage = completeCount * 100f / totalCount;
      fairLevels.add(new FairAssessmentLevel(entry.getKey(), fairPercentage, categoryPercentageMap, entry.getValue()));
      overallFairLevel = levelComplete && entry.getKey() > overallFairLevel ? entry.getKey() : overallFairLevel;
    }

    return new FairAssessment(overallFairLevel, overallFairPercentage, overallFairCategoriesMap, fairLevels);*/

    ///////////////////////////

    int fairLevel = 1;
    float fairPercentage = 90;
    Map<String, Float> fairCategories = Map.of("Content related", 85f, "Hosting environment", 80f, "Representation and format", 90f);
    List<Indicator> indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList(), ""));
    FairAssessmentLevel fairAssessmentLevel = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 2;
    fairPercentage = 80;
    fairCategories = Map.of("Content related", 70f, "Hosting environment", 80f, "Representation and format", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList(), ""));
    FairAssessmentLevel fairAssessmentLevel2 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 3;
    fairPercentage = 80;
    fairCategories = Map.of("Content related", 70f, "Hosting environment", 80f, "Representation and format", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList(), ""));
    FairAssessmentLevel fairAssessmentLevel3 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 4;
    fairPercentage = 80;
    fairCategories = Map.of("Content related", 70f, "Hosting environment", 80f, "Representation and format", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList(), ""));
    FairAssessmentLevel fairAssessmentLevel4 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);
    fairLevel = 5;
    fairPercentage = 80;
    fairCategories = Map.of("Content related", 70f, "Hosting environment", 80f, "Representation and format", 80f);
    indicators = List.of(new Indicator("id", "name", "description", 1, 1, true, Collections.emptyList(), ""));
    FairAssessmentLevel fairAssessmentLevel5 = new FairAssessmentLevel(fairLevel, fairPercentage, fairCategories, indicators);

    List<FairAssessmentLevel> fairLevels = List.of(fairAssessmentLevel, fairAssessmentLevel2, fairAssessmentLevel3, fairAssessmentLevel4, fairAssessmentLevel5);
    int overallFairLevel = 4;
    float overallFairPercentage = 85.0f;
    Map<String, Integer> categoriesMap = Map.of("Content related", 4, "Hosting environment", 3, "Representation and format", 2);
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
