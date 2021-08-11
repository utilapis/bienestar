function doPost(e) {
  if (!(e || {}).postData?.contents) {
    return HtmlService.createHtmlOutput("<p>ERROR: Body not found in the request</p>");
  }

  const body = JSON.parse(e.postData.contents);

  if (body.email) {
    return appendEmail(body.email);
  } else if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
    return paypalWebhook(body);
  }

  return HtmlService.createHtmlOutput("<p>ERROR: Request type not recognized</p>");
}
