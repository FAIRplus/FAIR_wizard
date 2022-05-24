package uk.ac.ebi.fairwizard.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.extern.java.Log;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import uk.ac.ebi.fairwizard.config.ApplicationConfig;
import uk.ac.ebi.fairwizard.exceptions.ApplicationStatusException;
import uk.ac.ebi.fairwizard.model.Assessment;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log
public class AssessmentService {
  private final ResourceLoader resourceLoader;
  private final ApplicationConfig applicationConfig;

  public AssessmentService(ResourceLoader resourceLoader, ApplicationConfig applicationConfig) {
    this.resourceLoader = resourceLoader;
    this.applicationConfig = applicationConfig;
  }

  public List<Assessment> getFairAssesment() throws ApplicationStatusException {
    List<Assessment> assessments = new ArrayList<>();
//    InputStream in = null;
//    try {
//      in = resourceLoader.getResource(applicationConfig.getFairAssessmentFile()).getInputStream();
//    } catch (Exception e) {
//      throw new ApplicationStatusException("Failed to read fair assessment fiel");
//    }

    try (InputStream in = resourceLoader.getResource(applicationConfig.getFairAssessmentFile()).getInputStream();
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

  private boolean toBoolean(String s) {
    return "1".equals(s);
  }
}
