// Agrega un email al final de la Columna A.
function appendEmail(email) {
  if (!email) {
    email = "no.email@test.com";
  }
  let values = [[email]];

  const resource = {
    values,
  };
  const result = Sheets.Spreadsheets.Values.append(
    resource,
    "ID",
    "Sheet1!A2:A",
    { valueInputOption: "RAW" }
  );
  console.log(result);
  return HtmlService.createHtmlOutput("Ok");
}
