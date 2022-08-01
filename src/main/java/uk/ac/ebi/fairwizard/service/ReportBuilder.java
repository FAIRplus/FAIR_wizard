package uk.ac.ebi.fairwizard.service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.ListItem;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import uk.ac.ebi.fairwizard.model.MongoFairResource;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ReportBuilder {
  private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
  private static final Font SUB_TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
  private static final Font HEADING_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
  private static final Font SUB_HEADING_FONT = new Font(Font.FontFamily.HELVETICA, 13, Font.BOLD);
  private static final Font PARAGRAPH_BOLD_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
  private static final Font PARAGRAPH_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
  private static final Font PARAGRAPH_FONT_GRAY = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.DARK_GRAY);
  private static final Font PARAGRAPH_FONT_BLUE = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.BLUE);

  private static final Font redFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.RED);
  private static final Font smallBold = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

  private final Document document;
  private final ByteArrayOutputStream outputStream;

  private ReportBuilder() throws DocumentException {
    document = new Document();
    outputStream = new ByteArrayOutputStream();
    PdfWriter.getInstance(document, outputStream);
    document.open();
  }

  public static ReportBuilder getBuilder() throws DocumentException {
    return new ReportBuilder();
  }

  public ByteArrayOutputStream build() {
    document.close();
    return outputStream;
  }

  public ReportBuilder withData() throws DocumentException, IOException, URISyntaxException {
    addMetaData(document);
    addReportHeader(document);
    addFairGoals(document);
    addProjectExamination(document);
    addFairProcess(document);

    return this;
  }

  public ReportBuilder withQuestions(List<String> questions) throws DocumentException {
    document.newPage();
    Paragraph wizard = new Paragraph();
    wizard.setSpacingAfter(20);
    wizard.setSpacingBefore(20);
    wizard.add(new Paragraph("Wizard Decision Tree", HEADING_FONT));

    com.itextpdf.text.List decisionList = new com.itextpdf.text.List(true, false, 20);
    questions.forEach(q -> {
      decisionList.add(new ListItem(q, PARAGRAPH_FONT));
    });
    wizard.add(decisionList);
    document.add(wizard);

    return this;
  }

  public ReportBuilder withResources(Set<MongoFairResource> resources) throws DocumentException {
    Map<String, List<MongoFairResource>> resourceMap =
      resources.stream().collect(Collectors.groupingBy(r -> r.getResourceType()));

    for (Map.Entry<String, List<MongoFairResource>> e : resourceMap.entrySet()) {
      String resourceType = e.getKey().endsWith("s") ? e.getKey() + "es" : e.getKey() + 's';
      Paragraph resourceHeading = new Paragraph(resourceType, SUB_HEADING_FONT);
      resourceHeading.setSpacingAfter(6);
      document.add(resourceHeading);
      addResourceTableToDocument(e.getValue());
    }

    return this;
  }

  public ReportBuilder withFooter(List<String> answers, String permaLink) throws DocumentException {
    StringBuilder urlBuilder = new StringBuilder("www.ebi.ac.uk/ait/fair-wizard/wizard?");
    answers.forEach(a -> urlBuilder.append("answers=" + a + '&'));

    Paragraph reportFooter = new Paragraph();
    reportFooter.setAlignment(Element.ALIGN_JUSTIFIED);
    reportFooter.setSpacingBefore(20);

    reportFooter.add(new Chunk("For more information please check ", PARAGRAPH_FONT));
    reportFooter.add(new Chunk("FAIR Wizard.", PARAGRAPH_FONT_BLUE).setAnchor(urlBuilder.toString()));
    reportFooter.add(new Chunk(" To view an interactive web version of this report, please visit ", PARAGRAPH_FONT));
    reportFooter.add(new Chunk("here.", PARAGRAPH_FONT_BLUE).setAnchor(urlBuilder.toString()));
    reportFooter.add(
      new Chunk(" If you have any questions or have any comments, please provide feedback ", PARAGRAPH_FONT));
    reportFooter.add(
      new Chunk("here.", PARAGRAPH_FONT_BLUE).setAnchor("https://github.com/FAIRplus/FAIR_wizard/issues/new?title=Re: "
                                                        + permaLink + "&body=Please include report link with your issue. <br/> "
                                                        + permaLink + " <br/> "));
    document.add(reportFooter);

    Paragraph license = new Paragraph();
    license.setSpacingBefore(15);
    license.add(new Paragraph("This is a preliminary version of the report and not subject to any license agreement.",
                              PARAGRAPH_FONT_GRAY));
    document.add(license);

    return this;
  }

  private PdfPTable addResourceTableToDocument(List<MongoFairResource> resources) throws DocumentException {
    PdfPTable table = new PdfPTable(2);
    table.setWidths(new int[] { 1, 2 });
    table.setWidthPercentage(100);

    Stream.of("Resource Name", "Resource Description")
          .forEach(columnTitle -> {
            PdfPCell header = new PdfPCell();
            header.setBackgroundColor(BaseColor.LIGHT_GRAY);
            header.setBorderWidth(1);
            header.setPhrase(new Phrase(columnTitle));
            table.addCell(header);
          });
    addResourcesToTable(table, resources);
    document.add(table);
    return table;
  }

  private void addResourcesToTable(PdfPTable table, List<MongoFairResource> resources) {
    Font f = new Font(FontFamily.HELVETICA, 10, Font.NORMAL);
    resources.forEach(r -> {
      table.addCell(new PdfPCell(new Phrase(r.getName(), f)));
      table.addCell(new PdfPCell(new Phrase(r.getDescription(), f)));
    });
  }


  void addReportHeader(Document document) throws DocumentException {
    Paragraph reportHeader = new Paragraph();
    reportHeader.add(new Paragraph("Personalized FAIRification process report", TITLE_FONT));
    reportHeader.add(new Paragraph("Generated by: FAIR Wizard on " + new Date(), PARAGRAPH_FONT));
    addEmptyLine(reportHeader, 1);
    reportHeader.add(new Paragraph("This report follows the FAIRplus 4-step FAIRification process, and recommends " +
                                   "FAIRification resources based on the project examination performed through the FAIR " +
                                   "Wizard www.ebi.ac.uk/ait/fair_wizard", PARAGRAPH_FONT));

    reportHeader.add(new Paragraph("Content", PARAGRAPH_BOLD_FONT));
    com.itextpdf.text.List list = new com.itextpdf.text.List(false, false, 20);
    list.add(new ListItem("Stage 1: Define FAIRification Goal", PARAGRAPH_FONT));
    list.add(new ListItem("Stage 2: Project Examination", PARAGRAPH_FONT));
    list.add(new ListItem("Stage 3: Designed FAIRification process", PARAGRAPH_FONT));
    list.add(new ListItem("Decision Tree and Results", PARAGRAPH_FONT));
    reportHeader.add(list);

    document.add(reportHeader);
  }

  void addFairGoals(Document document) throws DocumentException {
    Paragraph fairGoals = new Paragraph();
    fairGoals.setSpacingBefore(15);
    fairGoals.setAlignment(Element.ALIGN_JUSTIFIED);
    fairGoals.add(new Paragraph("Stage 1: Define FAIRification Goal", HEADING_FONT));
    fairGoals.add(new Paragraph("A FAIRification goal defines the aim of FAIRification, communicates clear " +
                                "scientific value, defines a specific scope and ensures the FAIRification plan is " +
                                "actionable. Please think about your FAIRification goal and focus on the scientific " +
                                "value of the FAIRification.", PARAGRAPH_FONT));
    fairGoals.add(new Paragraph(
      "Determine goals for FAIRfiication in terms of desired usability of data that is not current possible",
      PARAGRAPH_FONT));
    fairGoals.add(new Paragraph("Here are FAIRification goals that we think are similar to your needs：\n" +
                                "Map the metadata parameters (data dictionary) to appropriate domain-relevant ontologies and standards to enable applying to data catalogues and repositories to make the data more findable.\n" +
                                "Provide advice and information to the consortium members so they can decide on the type of licensing for publicly sharing the data and clarifying the possible reuse of the data.\n" +
                                "☑\n" +
                                "OR write down your own FAIRification goal here.\n", PARAGRAPH_FONT));
    document.add(fairGoals);
  }

  void addProjectExamination(Document document) throws DocumentException {
    Paragraph projectExam = new Paragraph();
    projectExam.setSpacingBefore(15);
    projectExam.add(new Paragraph("Stage 2: Project Examination", SUB_TITLE_FONT));
    projectExam.add(
      new Paragraph("Examine the current state of the project with respect to FAIRification goal", PARAGRAPH_FONT));

    com.itextpdf.text.List list = new com.itextpdf.text.List(true, false, 20);
    list.add(new ListItem("Identify Data Requirements\n" +
                          "Here are the indicators that specify how the data needs to be presented to fulfil the expected " +
                          "FAIR usage. For more information about the indicators, please check link\n",
                          PARAGRAPH_FONT));
    list.add(new ListItem("Identify FAIRification Capabilities & Resources\n" +
                          "Based on your FAIRification goal, we recommend you focus on the FAIR capabilities listed below.\n",
                          PARAGRAPH_FONT));
    list.add(new ListItem("Produce the FAIRification Backlog\n" +
                          "You can also further decide which capabilities you’d like to focus.\n", PARAGRAPH_FONT));
    projectExam.add(list);

    document.add(projectExam);
  }

  void addFairProcess(Document document) throws DocumentException, IOException {
    Paragraph fairProcess = new Paragraph();
    fairProcess.setSpacingBefore(15);
    fairProcess.add(new Paragraph("Stage 3: Designed FAIRification process", SUB_TITLE_FONT));
    fairProcess.add(new Paragraph("Based on the FAIRification goal and project status, below is the " +
                                  "FAIRification implementation cycle we recommend. The cycle starts from " +
                                  "pre-FAIRification assessment, and is guided by a designed FAIRification work plan. " +
                                  "One the work plan is implemented, users can re-perform FAIR assessment to measure " +
                                  "the outcome of the FAIRification", PARAGRAPH_FONT));

    try (InputStream in = getClass().getResourceAsStream("/fair_process.png"))  {
      Image processDiagram = Image.getInstance(in.readAllBytes());
      processDiagram.scaleToFit(PageSize.A4.getWidth() * 0.75f, PageSize.A4.getHeight() * 0.75f);
      processDiagram.setAlignment(Element.ALIGN_CENTER);
      document.add(processDiagram);
    }


    fairProcess.add(new Paragraph("The FAIRifictaion work plan we built for your project is listed below, the " +
                                  "left panel steps in the FAIRification implementation template. Steps that are " +
                                  "highly related to your project are in purple. The table on the right side provides " +
                                  "details about what needs to be done in each step. ", PARAGRAPH_FONT));

//    Image workflowDiagram = Image.getInstance("./src/main/resources/fair_process_workflow.jpg");
//    workflowDiagram.scalePercent(50);
//    document.add(workflowDiagram);

    document.add(fairProcess);
  }

  void addMetaData(Document document) {
    document.addTitle("FAIR Wizard personlized report");
    document.addSubject("Generated by FAIR Wizard");
    document.addKeywords("FAIR");
    document.addAuthor("EBI BioSamples");
    document.addCreator("EBI BioSamples");
  }

  private static void addEmptyLine(Paragraph paragraph, int number) {
    for (int i = 0; i < number; i++) {
      paragraph.add(new Paragraph(" "));
    }
  }

  private void addEmptyLinesToDocument(int number) throws DocumentException {
    for (int i = 0; i < number; i++) {
      document.add(new Paragraph(" "));
    }
  }
}
