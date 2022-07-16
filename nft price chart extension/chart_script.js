const labels = ["INDEX_ARRAY"];
const data = {
  labels: labels,
  datasets: [{
    label: 'NFT Price in ETH by transaction index',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: ["ETH_PRICE_ARRAY"],
  }]
};
const config = {
  type: 'line',
  data: data,
  options: {}
};
