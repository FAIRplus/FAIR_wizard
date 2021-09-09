package uk.ac.ebi.fairwizard.service;

import com.itextpdf.text.BadElementException;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.stream.Stream;

public class ReportingService {

  public static void main(String[] args) throws Exception {

    ReportingService reportingService = new ReportingService();
    reportingService.getPdfIt();
  }

  public void getPdfIt() throws Exception {
    String  outputPdfPath = "/home/isuru/temp/test.pdf";
    Document document = new Document();
    PdfWriter.getInstance(document, new FileOutputStream(outputPdfPath));

    document.open();

    Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);
    Chunk chunk = new Chunk("Hello World", font);
    document.add(chunk);

//    Image img = Image.getInstance("/home/isuru/Downloads/visa.jpg");
//    document.add(img);

    PdfPTable table = new PdfPTable(3);
    addTableHeader(table);
    addRows(table);
    addCustomRows(table);
    document.add(table);

    document.close();
  }

  private void addTableHeader(PdfPTable table) {
    Stream.of("column header 1", "column header 2", "column header 3")
          .forEach(columnTitle -> {
            PdfPCell header = new PdfPCell();
            header.setBackgroundColor(BaseColor.LIGHT_GRAY);
            header.setBorderWidth(2);
            header.setPhrase(new Phrase(columnTitle));
            table.addCell(header);
          });
  }

  private void addRows(PdfPTable table) {
    table.addCell("row 1, col 1");
    table.addCell("row 1, col 2");
    table.addCell("row 1, col 3");
  }

  private void addCustomRows(PdfPTable table)
    throws URISyntaxException, BadElementException, IOException {
//    Path path = Paths.get(ClassLoader.getSystemResource("Java_logo.png").toURI());
//    Image img = Image.getInstance(path.toAbsolutePath().toString());
    Image img = Image.getInstance("/home/isuru/Downloads/visa.jpg");
    img.scalePercent(10);

    PdfPCell imageCell = new PdfPCell(img);
    table.addCell(imageCell);

    PdfPCell horizontalAlignCell = new PdfPCell(new Phrase("row 2, col 2"));
    horizontalAlignCell.setHorizontalAlignment(Element.ALIGN_CENTER);
    table.addCell(horizontalAlignCell);

    PdfPCell verticalAlignCell = new PdfPCell(new Phrase("row 2, col 3"));
    verticalAlignCell.setVerticalAlignment(Element.ALIGN_BOTTOM);
    table.addCell(verticalAlignCell);
  }
}
