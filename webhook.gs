const paypalHost = "https://api-m.sandbox.paypal.com";
const clientId = "CLIENT_ID";
const secret = "SECRET";

function getPaypalToken() {
  const url = `${paypalHost}/v1/oauth2/token`;
  const key = Utilities.base64Encode(`${clientId}:${secret}`);

  var formData = {
    grant_type: "client_credentials",
  };
  var options = {
    method: "POST",
    payload: formData,
    headers: {
      Authorization: `Basic ${key}`,
    },
  };

  const response = UrlFetchApp.fetch(url, options);
  const paypalResponse = JSON.parse(response.getContentText());
  return paypalResponse.access_token;
}

function getPaypalOrder(orderId) {
  const url = `${paypalHost}/v2/checkout/orders/${orderId}`;
  const token = getPaypalToken();

  var options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = UrlFetchApp.fetch(url, options);
  const paypalResponse = JSON.parse(response.getContentText());
  return paypalResponse;
}

function paypalWebhook(e) {
  try {
    const order = getPaypalOrder(e.resource.id);

    const htmlBody = `
      <h3>Nueva venta: ${e.resource.purchase_units[0].amount.currency_code} ${e.resource.purchase_units[0].amount.value}</h3>
      <p><b>Nombre:</b> ${e.resource.payer.name.given_name}</p>
      <p><b>Apellido:</b> ${e.resource.payer.name.surname}</p>
      <p><b>Email:</b> ${e.resource.payer.email_address}</p>
      <h3>Shipping:</h3>
      <p><b>Linea 1:</b> ${e.resource.purchase_units[0].shipping.address.address_line_1}</p>
      <p><b>Linea 2:</b> ${e.resource.purchase_units[0].shipping.address.address_line_2}</p>
      <p><b>Area 1:</b> ${e.resource.purchase_units[0].shipping.address.admin_area_1}</p>
      <p><b>Area 2:</b> ${e.resource.purchase_units[0].shipping.address.admin_area_2}</p>
      <p><b>Codigo Postal:</b> ${e.resource.purchase_units[0].shipping.address.postal_code}</p>
      <p><b>Pais:</b> ${e.resource.purchase_units[0].shipping.address.country_code}</p>
      <hr>
      <h3>Order:</h3>
      <p>${JSON.stringify(order)}</p>
    `;

    GmailApp.sendEmail("utilapis@gmail.com", "Nuevo Pago", "", { htmlBody });
  } catch (err) {
    const log = {
      event: e,
      err: err,
    };
    GmailApp.sendEmail("utilapis@gmail.com", "Error", JSON.stringify(log));
  }

  return HtmlService.createHtmlOutput("Ok");
}
