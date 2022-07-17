function create_data_array(){

  var all_txns = document.querySelectorAll("[class^='HistoryListContainer']")[0].children;
  var count_txns = all_txns.length;

  if (count_txns > 1) {
    array_data = create_data_array_txns(all_txns, count_txns)
  } else {
    return
  }
  return array_data
}

function create_data_array_txns(all_txns, count_txns) {
  var all_price_data = [];
  var index_array = [];
  var eth_price_array_reverse_order = [];

  for (let i = 0; i < count_txns; i++) {
    try{
      price_data = all_txns[i].querySelector("p").children[0].querySelectorAll("strong")[2].innerHTML
      eth_and_local_curr = price_data.split(" ETH ")
      eth_price = eth_and_local_curr[0]
      local_curr_price = eth_and_local_curr[1].slice(1, -1)
    }
    catch {
      price_data = 0
      eth_price = 0
      local_curr_price = 0
    }
    try{
      seller_user_id = all_txns[i].querySelector("p").children[0].querySelectorAll("strong")[1].querySelector("a").getAttribute("href")
    }
    catch {
      seller_user_id = 'unknown'
    }
    try {
      buyer_user_id = all_txns[i].querySelector("p").children[0].querySelectorAll("strong")[0].querySelector("a").getAttribute("href")
    }
    catch {
      buyer_user_id = 'unknown'
    }
    price_obj = {
      'eth_price': eth_price,
      'local_curr_price': local_curr_price,
      'seller_user_id': seller_user_id,
      'buyer_user_id': buyer_user_id,
    }
    index_array.push(i.toString())
    eth_price_array_reverse_order.push(eth_price)
    all_price_data.push(price_obj)
  }
  eth_price_array = eth_price_array_reverse_order.reverse()
  array_data = {
    'index_array': index_array,
    'eth_price_array': eth_price_array
  }
  return array_data
}

function create_chart(index_array, eth_price_array) {
  outerContainer = document.querySelectorAll("[class^='ContentContainer']")[0]
  const outerDiv = document.createElement("div");
  outerDiv.setAttribute("class", "ContentContainerDesktop-sc-1p3n06p-5")

  const headerDiv = document.createElement("header");
  headerDiv.setAttribute("class","SectionTitle")

  const pheaderDiv = document.createElement("p");
  pheaderDiv.setAttribute("class","vhTUk")
  pheaderDiv.innerText = "Chart"

  headerDiv.appendChild(pheaderDiv)
  outerDiv.appendChild(headerDiv)

  const canvasDiv = document.createElement("canvas")
  canvasDiv.setAttribute("id", "nftChart_eth")
  outerDiv.appendChild(canvasDiv)
  outerContainer.appendChild(outerDiv)

  const labels = index_array;
  const data = {
    labels: labels,
    datasets: [{
      label: 'NFT Price in ETH by transaction index',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: eth_price_array,
    }]
  };
  const config = {
    type: 'line',
    data: data,
    options: {}
  };
  const nftChart = new Chart(
    document.getElementById('nftChart_eth'),
    config
  );
  console.log('NFT Chart Loaded.')
  return [config]
}

function ready_check(){
  function waitForElement(querySelector, timeout){
    return new Promise((resolve, reject)=>{
      var timer = false;
      if(document.querySelectorAll(querySelector).length) return resolve();
      const observer = new MutationObserver(()=>{
        if(document.querySelectorAll(querySelector).length){
          observer.disconnect();
          if(timer !== false) clearTimeout(timer);
          return resolve();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      if(timeout) timer = setTimeout(()=>{
        observer.disconnect();
        reject();
      }, timeout);
    });
  }

  waitForElement("[class^='HistoryItemWrapper']", 30000).then(function(){
      main()
  });
}

function main() {
  array_data = create_data_array()
  if (array_data == null){
    console.log('Not enough data to create an NFT Chart.')
    return
  }
  output = create_chart(array_data['index_array'], array_data['eth_price_array'])
}

document.addEventListener('readystatechange', e => {
  if(document.readyState === "complete"){
    ready_check();
  }
});
