import * as XLSX from "xlsx/xlsx.mjs";
export default () => {
  // function to export download excel file
  const table_elt = document.getElementsByTagName("table");
  const wb = XLSX.utils.table_to_book(table_elt[0]);

  // Package and Release Data (`writeFile` tries to write and save an XLSB file)
  // @ts-ignore
  XLSX.writeFile(wb, "Report.xlsb");
};
