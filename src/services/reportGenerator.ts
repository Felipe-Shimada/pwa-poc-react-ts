import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Fishing } from "../types/fishing";

// define a generatePDF function that accepts a fishing argument
const generatePDF = (fishingList: Fishing[]) => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["Id", "Data", "Peso"];

  const tableRows = fishingList.map((fishing) => [
    fishing.id,
    new Date(fishing.date).toLocaleDateString(),
    `${fishing.weight} kg`,
  ]);

  // startY is basically margin-top
  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });

  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  doc.text("MONITORAMENTO DO CARREGAMENTO E PROCESSO DE DESPESCA", 14, 15);
  // we define the name of our PDF file.
  doc.save(`report_${dateStr}.pdf`);
};

export default generatePDF;
