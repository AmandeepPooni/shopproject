





window.onload = function(){
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            showproducts("all");
        } else {
            window.location.replace("../login");
        }
    });
}



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
    
    
    var products = [];
    
    
    Vue.component('product', {
        props: ['product'],
        template: '<div class="prod"><img class="image" v-bind:src="product.data.img">'+
        '<div class="pname flex">{{product.data.name}}<div class="f1"></div>₹{{product.data.price}}</div>'+
        '<div @click="detail(product)" class="buy teal">VIEW DETAILS</div></div>',
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

                showorders(prod._id);
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
            update: async function(id){
                let s = parseInt(document.getElementById('sss').value);
                
                if(s>0){
                    var butt = document.getElementById('butt');
                    butt.disabled = true;
                    butt.innerHTML = "UPDATING";
                    
                    let res = await updatep(id,{"data.stock":s});
                    
                    butt.disabled=false;
                    butt.innerHTML = "UPDATE";
                    window.location.replace("../");
                    
                }
            }
        }
    })
    
    
    
    
    get("seller",{"data.seller":firebase.auth().currentUser.email}).then(ret=>{
        products.push.apply(products,ret);
        document.getElementById('shownum').innerHTML= "SHOWING "+products.length+" RESULTS";
    });    
    
    
}


function showorders(id){
    var ord = document.getElementById('prevorders');
    ord.innerHTML = "Fetching orders for this product";
    var stringinner = "";
    
    get("orders",{"product._id":id}).then(ret=>{
        
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