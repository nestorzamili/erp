export const getQuotationTemplate = (quotation: any): string => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quotation - PT Navindo Maritim Indonesia</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 210mm;
                min-height: 297mm;
                margin: auto;
                padding: 5px;
                box-sizing: border-box;
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
                padding: 30px 0;
                position: relative;
            }
            .logo-container {
                position: absolute;
                left: 10px;
            }
            .header img {
                width: 120px;
                height: auto;
            }
            .header h1 {
                color: #0056b3;
                margin: 0;
                flex-grow: 1;
                text-align: center;
                font-size: 27px;
            }
            .quotation-title {
                background: #f4b400;
                padding: 10px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
            }
            .contact-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 10px;
                align-items: start; 
            }

            .contact-info {
                display: grid;
                grid-template-columns: 100px 1fr;
                gap: 5px;
                font-size: 14px;
                align-items: center;
            }

            .contact-label {
                font-weight: bold;
                text-align: right;
                white-space: nowrap;
            }

            .contact-value {
                text-align: left;
                padding-left: 10px;
                word-wrap: break-word;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 12px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: center;
            }
            table td.text-right {
                text-align: right;
                padding-right: 10px;
            }
            table td.text-left {
                text-align: left;
                padding-right: 10px;
            }
            th {
                background: #3aa7d3;
                color: white;
            }
            .total {
                text-align: right;
                font-weight: bold;
                font-size: 1.1em;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-container">
                    <img src="https://jgtkeyfxjkjzumehdhpo.supabase.co/storage/v1/object/sign/navindo/Logo%20Navindo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJuYXZpbmRvL0xvZ28gTmF2aW5kby5wbmciLCJpYXQiOjE3Mzg0MzE2NjgsImV4cCI6MTc2OTk2NzY2OH0.eUILCJAehY_VJ02gMN07_EtURSomfUtnUgd5mvcDAdE" alt="PT Navindo Maritim Indonesia">
                </div>
                <h1>PT NAVINDO MARITIM INDONESIA</h1>
            </div>

            <hr style="border: 1px solid #00050a; margin-bottom: 20px;">

            <div class="contact-container">
                <div class="contact-info">
                    <span class="contact-label">Address:</span> 
                    <span>Exclusive Commercial Radin Inten</span>
                    <span class="contact-label"></span> 
                    <span>Kav. 18 Jl. Radin Inten II No. 80,</span>
                    <span class="contact-label"></span> 
                    <span>Duren Sawit, Jakarta Timur 13440</span>
                </div>
                <div class="contact-info">
                    <span class="contact-label">Phone:</span>
                    <span>021-22321146</span>
                    <span class="contact-label">WA/Mobile:</span>
                    <span>0813-2323-3159</span>
                    <span class="contact-label">Email:</span>
                    <span>navindomaritimindonesia@gmail.com</span>
                </div>
            </div>

            <div class="quotation-title">QUOTATION</div>

            <div class="contact-container">
                <div class="contact-info">
                    <span class="contact-label">Quotation#:</span>
                    <span>${quotation.document_number}</span>
                    <span class="contact-label">Date:</span>
                    <span>${new Date(quotation.quotation_date).toLocaleDateString()}</span>
                    <span class="contact-label">Customer ID:</span>
                    <span>${quotation.customer.customer_code || 'N/A'}</span>
                </div>
                <div class="contact-info">
                    <span class="contact-label">Customer :</span>
                    <span>${quotation.customer.customer_company || 'N/A'}</span>
                    <span class="contact-label"></span>
                    <span>${quotation.customer.customer_name || 'N/A'}</span>
                    <span class="contact-label"></span>
                    <span>${quotation.customer.customer_address || 'N/A'}</span>
                    <span class="contact-label"></span>
                    <span>${quotation.customer.customer_contact || 'N/A'}</span>
                </div>
            </div>

            <table>
                <tr>
                    <th>Created By</th>
                    <th>PR Number</th>
                    <th>Vessel</th>
                    <th>Terms Of Payment</th>
                </tr>
                <tr>
                    <td>${quotation.creator.name || 'N/A'}</td>
                    <td>Phone</td>
                    <td>SPOB Adeline 01</td>
                    <td>${quotation.terms_of_payment || 'N/A'}</td>
                </tr>
            </table>

            <table>
                <tr>
                    <th>No</th>
                    <th>Qty</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Disc</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                </tr>
                ${quotation.products
                  .map(
                    (product: any, index: number) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${product.quantity}</td>
                        <td>${product.product.product_name || 'N/A'}</td>
                        <td class="text-left">${product.product.product_description || 'N/A'}</td>
                        <td></td>
                        <td class="text-right">${formatNumber(Number(product.unit_price))}</td>
                        <td class="text-right">${formatNumber(product.quantity * product.unit_price)}</td>
                    </tr>
                `,
                  )
                  .join('')}
                <tr>
                    <td colspan="5"></td>
                    <td>Total</td>
                    <td class="text-right">
                    ${formatNumber(
                      quotation.products.reduce(
                        (acc: any, product: any) =>
                          acc + product.quantity * product.unit_price,
                        0,
                      ),
                    )}
                </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
  `
}
