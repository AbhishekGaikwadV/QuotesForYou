
 window.onload= function(){    
 
    //Click on last page button

    // Create event listener

        document.getElementById('button-next').addEventListener('click', nextPage);

        function nextPage(){
       
                var xhr = new XMLHttpRequest();
               
               // console.log(nextPage);  
               // OPEN - type, url/file, async  
             
                var endIndex = 1643;
                var page;
                if( page == endIndex){
                console.log("This is the Last Page");
                page = 1643;
                } else {
                page = document.getElementById('button-next').value;
                         }
              
            //    var url =`https://hasbeenquoted.herokuapp.com/ajax?page=${page}&limit=5`; 
            var url =`http://localhost:3000/ajax?page=${page}&limit=5`; 
             
               xhr.open('GET', url, true);
               
               console.log('READYSTATE: ', xhr.readyState);
               
                // OPTIONAL - used for loaders
                xhr.onprogress = function(){
                console.log('READYSTATE: ', xhr.readyState);
                }            
                 
                        xhr.onload = function(){
                        console.log('READYSTATE: ', xhr.readyState);
                        if(this.status == 200){            
                            var data = JSON.parse(this.responseText);
                            // console.log(data.results);
                            var output = ' ';
                                for(var i = 0; i <= 4; i++ ){      
                                            output += ` <div class="box middle center" id='cards' > 
                                                        <div  id= 'quoteandauthor'>                    
                                                        <article id="quote"> "${data.results[i].quote} "<br>
                                                        <span id="author"> --- ${data.results[i].author}</span>              
                                                        </article> 
                                                        </div>
                                                        </div>`; 
                                                    }
                                    document.getElementById('content-wrap').innerHTML = ' ';
                                    document.getElementById('content-wrap').innerHTML += output;
                          
                                     
                                    var endIndex = 329;                           
                                    if( data.next.page == endIndex){
                                       console.log("This is the Last Page inside ajax");
                                       document.getElementById('button-next').value = '---';
                                        } else if(data.next.page < endIndex) {
                                            document.getElementById('button-next').value = data.next.page;
                                            document.getElementById('button-previous').value = data.previous.page;
                                            document.getElementById('CurrPage-1').innerHTML = data.next.page - 1 ;
                                            document.getElementById('CurrPage-2').innerHTML = data.next.page - 1 ;
                                             var Totalpages = document.getElementById('PagesLeft-2').innerHTML;
                                             document.getElementById('PagesLeft-1').innerHTML = Totalpages - 1;  
                                             document.getElementById('PagesLeft-2').innerHTML = Totalpages - 1;
                                                }

                                            }              
                                     else if(this.status == 404){
                                        document.getElementById('button-next').value = 'Not Found';
                                                    }
                              }
                                
                        xhr.onerror = function(){
                        console.log('Request Error...');
                                                 }
                        
                // Sends request
                xhr.send();
        
             }
       
         
          

    //Click on previous page button
   
    document.getElementById('button-previous').addEventListener('click', previousPage);

       function previousPage(){
     
                var xhr = new XMLHttpRequest();
               
               // console.log(nextPage);  
               
                // OPEN - type, url/file, async
                   
                        var startIndex = 1;
                        var page ; 
                        if( page < startIndex && page == 0){
                        console.log("This is the First Page");
                        page = 1;
                        } else {
                        page = document.getElementById('button-previous').value;
                        }   
                                   
                        
            //    var url =`https://hasbeenquoted.herokuapp.com/ajax?page=${page}&limit=5`;   
            var url =`http://localhost:3000/ajax?page=${page}&limit=5`; 

               xhr.open('GET', url, true);
              
               console.log('READYSTATE: ', xhr.readyState);
               
                // OPTIONAL - used for loaders
                xhr.onprogress = function(){
                console.log('READYSTATE: ', xhr.readyState);
                }            
                 
                xhr.onload = function(){
                console.log('READYSTATE: ', xhr.readyState);

                        if(this.status == 200){            
                            const data = JSON.parse(this.responseText);
                            console.log(data.results);
                            var output = ' ';
                                for(var i = 0; i <= 4; i++ ){      
                                            output += ` <div class="box middle center" id='cards' > 
                                                        <div  id= 'quoteandauthor'>                    
                                                        <article id="quote"> "${data.results[i].quote} "<br>
                                                        <span id="author"> --- ${data.results[i].author}</span>              
                                                        </article> 
                                                        </div>
                                                        </div>`; 
                                                    }
                          document.getElementById('content-wrap').innerHTML = ' ';
                          document.getElementById('content-wrap').innerHTML += output;
                                        
                                     
                                    // if(data.previous !== undefined || data.previous !== null ){
                                         if(data.previous) {
                                         document.getElementById('button-previous').value = data.previous.page;
                                         document.getElementById('button-next').value = data.next.page;
                                         document.getElementById('CurrPage-1').innerHTML = data.next.page - 1 ;
                                         document.getElementById('CurrPage-2').innerHTML = data.next.page - 1 ;
                                         var Totalpages = document.getElementById('PagesLeft-2').innerHTML;
                                         var pages =parseInt(Totalpages);
                                         document.getElementById('PagesLeft-1').innerHTML = pages + 1; 
                                         document.getElementById('PagesLeft-2').innerHTML = pages + 1; 
                                        } 
                                         
                                          else if(data.previous === undefined || data.previous === null) {
                                         console.log("This is the First Page inside ajax");
                                         document.getElementById('button-previous').value = 1 ;
                                         document.getElementById('button-next').value = 2; 
                                         document.getElementById('CurrPage-1').innerHTML = data.next.page - 1 ;
                                         document.getElementById('CurrPage-2').innerHTML = data.next.page - 1 ;                            
                                         document.getElementById('PagesLeft-1').innerHTML = 328 ; 
                                         document.getElementById('PagesLeft-2').innerHTML = 328 ;
                                         } else {
                                             console.log("There was some problem");
                                         }
                                           

                                    } else if(this.status == 404){
                                        document.getElementById('button-previous').value = 'Not Found';
                                                    }
                              }
                 xhr.onerror = function(){
                  console.log('Request Error...');
                      }
                              
                // Sends request
                xhr.send(); 
       
        } 



    
}

            
