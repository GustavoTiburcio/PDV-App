import * as Print from 'expo-print';
import api from '../services/api';
import * as Sharing from 'expo-sharing';

function currencyFormat(num) {
    return num.toFixed(2);
}

const PrintPDF = async (itensCarrinho, dadosCliente, valorBruto, codPed, nomRep) => {
    let date = new Date();
    let PrintItems = itensCarrinho.map(function (item) {
        return `<tr>
    <td style={{ fontSize: "38px" , maxWidth:"145px"}}>
        <b>${item.item} ${item.cor} ${item.tamanho}</b>
    </td>
    <td style={{ fontSize: "38px" , maxWidth:"20px"}} >
        <b>${item.quantidade}</b>
    </td>
    <td style={{ fontSize: "38px" , maxWidth:"60px" }}>
        <b>${currencyFormat(item.valor).replace('.', ',')}</b>
    </td>
    <td style={{ fontSize: "38px" , maxWidth:"80px" }}>
        <b>${currencyFormat(item.valor * item.quantidade).replace('.', ',')}</b>
    </td>
    </tr>`;
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pdf Content</title>
    <style>
        body {
            color: #000000;
        }
        p {
          font-family: "Didot", "Times New Roman";
          font-size: 38px;
          margin: 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          text-align: left;
          padding: 8px;
          font-family: "Didot", "Times New Roman";
          font-size: 38px;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
          margin-bottom:0px
        }
        div.small{
          
        }
    </style>
    </head>
    <body>
    <div class="small">
    </br>
    </br>
    <p></p>
    <p align="right"><b>Venda ${codPed}</b></p>
    </br>
    <p align="center"><b>PAPER PLAS</b></p>
    </br>
    <p align="center"><b></b></p>
    </br>
    </br>
    <div>
    <p><b>Data: ${date.toLocaleDateString()}</b></p>
    <p><b>Vendedor: ${nomRep}</b></p>
    <p><b>Razão Social:</b><b> ${dadosCliente.raz}</b></p>
    <p><b>CPF/CNPJ: ${dadosCliente.cgc}</b><b> Telefone: ${dadosCliente.fon}</b></p>
    <p><b>Email: ${dadosCliente.ema}</b></p>
    <p><b> Endereço: ${dadosCliente.log + ', ' + dadosCliente.num}</b></p>
    <p><b>Bairro: ${dadosCliente.bai}</b><b> Cidade: ${dadosCliente.cid + ' - ' + dadosCliente.uf}</b></p>
    </div>
    <table>
                            <thead>
                                <tr>
                                    <th>Descricao</th>
                                    <th>Qtd</th>
                                    <th>Vlr</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${PrintItems}
                            </tbody>
    </table>
    </div>
    </br>
    <p style="text-align:right"><b>Total geral: R$ ${valorBruto.toFixed(2).replace('.', ',')}</b></p>
    </body>
    </html>
    `;
    try {
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            width: 1000, height: 1500
        });
        await Print.printAsync({
            uri: uri
        })
    } catch (error) {
        console.error(error);
    }
};

async function reqPrintPDF(codped) {
    const response = await api.get(`pedidos/listarParaImprimir?cod=${codped}`)

    async function createAndPrintPDF() {
        var PrintItems = response.data.Pedidos[0].itensPedido.map(function (item) {
            return `<tr>
          <td style={{ fontSize: "36px" , maxWidth:"180px"}}>
              <b>${item.mer}  ${item.pad} ${item.codtam}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"20px"}} >
              <b>${item.qua}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"60px" }}>
              <b>${item.valUni.toFixed(2).replace('.', ',')}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"80px" }}>
              <b>${(item.qua * item.valUni).toFixed(2).replace('.', ',')}</b>
          </td>
          </tr>`;
        });

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Pdf Content</title>
              <style>
                  body {
                      color: #000000;
                  }
                  p {
                    font-family: "Didot", "Times New Roman";
                    font-size: 36px;
                    margin: 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  th, td {
                    text-align: left;
                    padding: 8px;
                    font-family: "Didot", "Times New Roman";
                    font-size: 36px;
                  }
                  tr:nth-child(even) {
                    background-color: #f2f2f2;
                    margin-bottom:0px
                  }
                  div.small{
                    
                  }
              </style>
          </head>
          <body>
            <div class="small">
            </br>
            </br>
              <p></p>
              <p align="right"><b>Venda ${codped}</b></p>
              </br>
              <p align="center"><b>PAPER PLAS</b></p>
              </br>
              <p align="center"><b></b></p>
              </br>
              </br>
              <div>
                <p><b>Data: ${response.data.Pedidos[0].dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</b></p>
                <p><b>Vendedor: TiFire</b></p>
                <p><b>Razão Social:</b><b> ${response.data.Pedidos[0].cliente.raz}</b></p>
                <p><b>CPF/CNPJ: ${response.data.Pedidos[0].cliente.cgc}</b><b> Telefone: ${response.data.Pedidos[0].cliente.tel}</b></p>
                <p><b>Email: ${response.data.Pedidos[0].cliente.ema}</b></p>
                <p><b> Endereço: ${response.data.Pedidos[0].cliente.endereco[0].log + ', ' + response.data.Pedidos[0].cliente.endereco[0].num}</b></p>
                <p><b>Bairro: ${response.data.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${response.data.Pedidos[0].cliente.endereco[0].cid + ' - ' + response.data.Pedidos[0].cliente.endereco[0].uf}</b></p>
              </div>
              <table>
                                      <thead>
                                          <tr>
                                              <th>Descricao</th>
                                              <th>Qtd</th>
                                              <th>Vlr</th>
                                              <th>Total</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                      ${PrintItems}
                                      </tbody>
              </table>
              </div>
              </br>
              <p style="text-align:right"><b>Total geral: R$ ${response.data.Pedidos[0].valPro.toFixed(2).replace('.', ',')}</b></p>
          </body>
          </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                width: 1000, height: 1500
            });
            await Print.printAsync({
                uri: uri
            })
        } catch (error) {
            console.error(error);
        }
    };

    createAndPrintPDF()
};

async function reqSharePDF(codped) {
    const response = await api.get(`pedidos/listarParaImprimir?cod=${codped}`)
    async function createPDF() {
        var PrintItems = response.data.Pedidos[0].itensPedido.map(function (item) {
            return `<tr>
          <td style={{ fontSize: "36px" , maxWidth:"180px"}}>
              <b>${item.mer} ${item.pad} ${item.codtam}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"20px"}} >
              <b>${item.qua}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"60px" }}>
              <b>${item.valUni.toFixed(2).replace('.', ',')}</b>
          </td>
          <td style={{ fontSize: "36px" , maxWidth:"80px" }}>
              <b>${(item.qua * item.valUni).toFixed(2).replace('.', ',')}</b>
          </td>
          </tr>`;
        });

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Pdf Content</title>
              <style>
                  body {
                      color: #000000;
                  }
                  p {
                    font-family: "Didot", "Times New Roman";
                    font-size: 36px;
                    margin: 0;
                  }
                  table {
                    border-collapse: collapse;
                    width: 100%;
                  }
                  th, td {
                    text-align: left;
                    padding: 8px;
                    font-family: "Didot", "Times New Roman";
                    font-size: 36px;
                  }
                  tr:nth-child(even) {
                    background-color: #f2f2f2;
                    margin-bottom:0px
                  }
                  div.small{
                    
                  }
              </style>
          </head>
          <body>
            <div class="small">
            </br>
            </br>
              <p></p>
              <p align="right"><b>Venda ${codped}</b></p>
              </br>
              <p align="center"><b>PAPER PLAS</b></p>
              </br>
              <p align="center"><b></b></p>
              </br>
              </br>
              <div>
                <p><b>Data: ${response.data.Pedidos[0].dat.slice(0, 19).replace(/-/g, "/").replace("T", " ")}</b></p>
                <p><b>Vendedor: TiFire</b></p>
                <p><b>Razão Social:</b><b> ${response.data.Pedidos[0].cliente.raz}</b></p>
                <p><b>CPF/CNPJ: ${response.data.Pedidos[0].cliente.cgc}</b><b> Telefone: ${response.data.Pedidos[0].cliente.tel}</b></p>
                <p><b>Email: ${response.data.Pedidos[0].cliente.ema}</b></p>
                <p><b> Endereço: ${response.data.Pedidos[0].cliente.endereco[0].log + ', ' + response.data.Pedidos[0].cliente.endereco[0].num}</b></p>
                <p><b>Bairro: ${response.data.Pedidos[0].cliente.endereco[0].bai}</b><b> Cidade: ${response.data.Pedidos[0].cliente.endereco[0].cid + ' - ' + response.data.Pedidos[0].cliente.endereco[0].uf}</b></p>
              </div>
              <table>
                                      <thead>
                                          <tr>
                                              <th>Descricao</th>
                                              <th>Qtd</th>
                                              <th>Vlr</th>
                                              <th>Total</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                      ${PrintItems}
                                      </tbody>
              </table>
              </div>
              </br>
              <p style="text-align:right"><b>Total geral: R$ ${response.data.Pedidos[0].valPro.toFixed(2).replace('.', ',')}</b></p>
          </body>
          </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                width: 1000, height: 1500
            });
            Sharing.shareAsync(uri)
        } catch (error) {
            console.error(error);
        }
    };
    createPDF();
};
export { PrintPDF, reqPrintPDF, reqSharePDF }