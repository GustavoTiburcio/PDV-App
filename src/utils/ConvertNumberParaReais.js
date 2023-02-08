import "intl";
import "intl/locale-data/jsonp/pt";

export const ConvertNumberParaReais = (number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};