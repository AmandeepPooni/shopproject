window.onload = function(){
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            showproducts("all");
        } else {
            window.location.replace("../login");
        }
    });
    
    
    
}


var products = [];

var tempprod = [];

function showproducts(keyword){
    
    var single = {
        _id:"",
        data:{
            img : "",
            label :"",
            name :"",
            des :"",
            price :0,
            stock :0,
            seller :""
        }
    };
    
    
    
    
    Vue.component('product', {
        props: ['product'],
        template: '<div class="prod"><img class="image" v-bind:src="product.data.img">'+
        '<div class="pname flex">{{product.data.name}}<div class="f1"></div>₹{{product.data.price}}</div>'+
        '<div class="sname">Seller: {{product.data.seller}}</div><div @click="detail(product)" class="buy teal">BUY</div></div>',
        methods: {
            detail: function (prod) {
                single._id=prod._id;
                single.data.img = prod.data.img;
                single.data.label = prod.data.label;
                single.data.name = prod.data.name;
                single.data.des = prod.data.des;
                single.data.price = prod.data.price;
                single.data.stock = prod.data.stock;
                single.data.seller = prod.data.seller;
                document.getElementById('infocon').style.display = 'flex';
            }
        }
    })
    
    var app = new Vue({
        el: '#products',
        data: {
            products: products
        }
    })
    
    var app2 = new Vue({
        el: '#infocon',
        data: {
            product: single
        },
        methods:{
            buy: async function(prod){
                let s = parseInt(document.getElementById('sss').value);
                let a = document.getElementById('aaa').value.trim();
                
                if(s<=prod.data.stock && a){
                    var butt = document.getElementById('butt');
                    butt.disabled = true;
                    butt.innerHTML = "BUYING";
                    
                    let res = await buyp(firebase.auth().currentUser.email,prod,s,a);
                    
                    butt.disabled=false;
                    butt.innerHTML = "BUY";
                    window.location.replace("../");
                    
                }
            }
        }
    })
    
    
    
    
    get("seller",{}).then(ret=>{
        products.push.apply(products,ret);
        tempprod.push.apply(tempprod,ret);
        document.getElementById('shownum').innerHTML= "SHOWING "+products.length+" RESULTS";
    });
    
    
    var ord = document.getElementById('prevorders');
    ord.innerHTML = "";
    var stringinner = "";
    
    get("orders",{buyer:firebase.auth().currentUser.email}).then(ret=>{
        
        let i =1;
        
        ret.forEach(element => {
            stringinner+=i+".";
            for(key in element){
                if(key=="product"){
                    stringinner+=key+": "+element[key].data.name+"<br>";
                    stringinner+="Seller: "+element[key].data.seller+"<br>";
                }
                else{
                    stringinner+=key+": "+element[key]+"<br>";
                }
            }
            i++;
            stringinner+="<br><br>"
        });
        
        
        ord.innerHTML = stringinner;
    });
    
    
    
    
    
    
}



function filtersearch(){
    var s = document.getElementById('searchfield').value.trim().toLowerCase();
    
    if(s){
        let filt = tempprod.filter(e => (e.data.label.trim().toLowerCase() === s || e.data.name.trim().toLowerCase() === s));
        
        while(products.length > 0) {
            products.pop();
        }
        products.push.apply(products,filt);
    }
    else{
        while(products.length > 0) {
            products.pop();
        }
        products.push.apply(products,tempprod);
    }
    
    
}




function toggle(el){
    let x = el.style.display;
    if(x!='none'){
        x='none';
    }else{
        x='flex';
    }
}