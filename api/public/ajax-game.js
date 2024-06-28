window.onload= function(){   

    document.getElementById('game-button').addEventListener('click', RandomQuote)


    
    function RandomQuote(){
        // Create XHR Object
        var xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'https://hasbeenquoted.herokuapp.com/microapp', true);
        
        console.log('READYSTATE: ', xhr.readyState);

        // OPTIONAL - used for loaders
        xhr.onprogress = function(){
          console.log('READYSTATE: ', xhr.readyState);
        }

        xhr.onload = function(){
            console.log('READYSTATE: ', xhr.readyState);
            if(this.status == 200){
              //console.log(this.responseText);
             var data = JSON.parse(this.responseText);
             
             console.log(data);
             var output = '';
             output += `<div  id= 'quoteandauthor'>                    
             <article id="quote"> " ${data.quote} "<br>
             <span id="author"> --- ${data.author} </span>              
             </article> 
             </div>`;

            document.getElementById('card').innerHTML = output;

            } else if(this.status == 404){
              document.getElementById('text').innerHTML = 'Not Found';
            }
          }

        xhr.onerror = function(){
              console.log('Request Error...');
            }


    // Sends request
    xhr.send();
  }


  document.getElementById('game-button-clear').addEventListener('click', Clear)

  function Clear(){
       document.getElementById('card').innerHTML = " ";
  }



 }
