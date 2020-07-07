var ff = firebase.firestore();


var data = {};


window.onload = function(){
    
    data = {};
    
    upload();
    
}




function upload(){
    var file="";
    
    
    
    
    
    document.getElementById('imageChooser').addEventListener("change",function(e){
        if(e.target.files.length>0){
            file = e.target.files[0];
            
            if(file.size > (10 * 1024 * 1024)){
                return;
            }
            
            document.getElementById('lablImg').innerHTML = "Uploading "+file.name+"...";
            
            var storageRef = firebase.storage().ref('images/'+file.name);
            var uploadTask = storageRef.put(file);
            
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                function(snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById('lablImg').innerHTML = file.name+"   (Uploading: "+Math.floor(progress)+"%)";
                    
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                        case firebase.storage.TaskState.RUNNING:
                       // console.log('Upload is running');
                        break;
                    }
                }, function(error) {
                    console.log(error);
                    //LOL
                    if(error.code!=='storage/canceled'){
                        //showsnacktemp(error.message,'e');
                    }
                }, function() {
                    //showsnacktemp('Uploaded','g');
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        data.img = downloadURL;
                        document.getElementById('plabel').value = "Finding a tag for this image. Please wait...";
                        ff.collection("pic").doc("pic").set({img:downloadURL}, {merge: true})
                        .then(function() {
                            
                            var i = 0;
                            
                            document.getElementById('lablImg').innerHTML = file.name;

                           
                            
                            incontrast(file);
                            greyscale(file);
                            invert(file);
                            
                            
                            var ls = ff.collection("pic").doc("labl").onSnapshot(function(doc) {
                                if(i==1){
                                    document.getElementById('plabel').value = doc.data().tag;
                                    ls();
                                }
                                else{i++;}
                            });
                            
                            
                        }).catch(function(error) {
                            console.log(error);
                            document.getElementById('lablImg').innerHTML = "FAILED";
                        });
                        
                    });
                });
                
                
            }
        });
    }
    
    
    
    
    function addtoshop(){
        
        data.label = document.getElementById('plabel').value;
        data.name = document.getElementById('pname').value;
        data.des = document.getElementById('description').value;
        data.price = parseInt(document.getElementById('price').value);
        data.stock = parseInt(document.getElementById('stock').value);
        data.seller = firebase.auth().currentUser.email;
        
        if(data.label&&data.name&&data.des&&data.price&&data.stock&&data.img&&data.seller){
            document.getElementById('upp').disabled = true;
            document.getElementById('upp').innerHTML = "UPLOADING";
            insert("seller",data).then(val=>{window.location.replace("../");});
        }
        
    }
    



    function incontrast(file){
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('display3').src = fr.result;
        }
        fr.readAsDataURL(file);

        var img = document.getElementById("display3");

        
        img.onload = function(){
            
            var c = document.getElementById("myCanvas3");
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            var ctx = c.getContext("2d");

            
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, c.width, c.height);

            contrast = 50;
            
            var d = imgData.data;
            contrast = (contrast/100) + 1;
            var intercept = 128 * (1 - contrast);
            for(let i=0;i<d.length;i+=4){
                d[i] = d[i]*contrast + intercept;
                d[i+1] = d[i+1]*contrast + intercept;
                d[i+2] = d[i+2]*contrast + intercept;
            }

            ctx.putImageData(imgData, 0, 0);

            
        var dataUrl = c.toDataURL();
        document.getElementById('displayhigh').src = dataUrl;
            
        }
        
        
    }


    function greyscale(file){
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('display2').src = fr.result;
        }
        fr.readAsDataURL(file);

        var img = document.getElementById("display2");

        
        img.onload = function(){
            
            var c = document.getElementById("myCanvas2");
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            var ctx = c.getContext("2d");

            
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, c.width, c.height);
            
            
            var i;
            for (i = 0; i < imgData.data.length; i += 4) {
                
                let grey = (imgData.data[i]+imgData.data[i+1]+imgData.data[i+2])/3;
                imgData.data[i] = grey;
                imgData.data[i+1] = grey;
                imgData.data[i+2] = grey;
            }
            ctx.putImageData(imgData, 0, 0);

            
        var dataUrl = c.toDataURL();
        document.getElementById('displaygrey').src = dataUrl;
            
        }
        
        
    }
    
    
    function invert(file){
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('display').src = fr.result;
        }
        fr.readAsDataURL(file);

        var img = document.getElementById("display");

        
        img.onload = function(){
            
            var c = document.getElementById("myCanvas");
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            var ctx = c.getContext("2d");

            
            ctx.drawImage(img, 0, 0);
            var imgData = ctx.getImageData(0, 0, c.width, c.height);
            
            //console.log(imgData);
            
            var i;
            for (i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = 255 - imgData.data[i];
                imgData.data[i+1] = 255 - imgData.data[i+1];
                imgData.data[i+2] = 255 - imgData.data[i+2];
                imgData.data[i+3] = 255;
            }
            ctx.putImageData(imgData, 0, 0);

            
        var dataUrl = c.toDataURL();
        document.getElementById('displayinvert').src = dataUrl;
            
        }
        
        
    }