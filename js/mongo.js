var api = "https://yourapi/";

async function insert(url,data){

    
    let insert  = "error";
    
    await fetch(api+"add",
    {headers:{"Content-Type":" application/json"},
    body:JSON.stringify({url:url,data:data}),method:"POST"})
    .then((resp) => resp.json()).then(data=>{insert = data});

    console.log(insert);

    return insert;
    
}

async function get(url,query){

    let get  = "error";

    await fetch(api+"get",
    {headers:{"Content-Type":" application/json"},
    body:JSON.stringify({url:url,query:query}),method:"POST"})
    .then((resp) => resp.json()).then(data=>{get = data});

   // console.log(get);

    return get;
    
}

function geti(url){
    get(url).then(r=>{console.log(r);});
    
}


async function buyp(b,p,q,a){

    let buy  = "error";
    
    await fetch(api+"buy",
    {headers:{"Content-Type":" application/json"},
    body:JSON.stringify({buyer:b,product:p,quantity:q,address:a,total:p.data.price*q}),method:"POST"})
    .then((resp) => resp.json()).then(data=>{buy = data});

    console.log(buy);

    return buy;
    
}


async function updatep(id,updt){

    let update  = "error";

    await fetch(api+"update",
    {headers:{"Content-Type":" application/json"},
    body:JSON.stringify({id:id,data:updt}),method:"POST"})
    .then((resp) => resp.json()).then(data=>{update = data});

    console.log(update);

    return update;
    
}
