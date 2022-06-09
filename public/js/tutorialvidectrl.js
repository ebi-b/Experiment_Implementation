function toggleControls() {
   console.log("INNNNxaxzdawsd")
   var video = document.getElementById("baselinevideo");
   //   if (video.hasAttribute("controls")) {
   //      video.removeAttribute("controls")   
   //   } else {
   //      video.setAttribute("controls","controls")   
   //   }

   video.addEventListener('ended', (event) => {
      console.log('Video stopped either because 1) it was over, ' +
         'or 2) no further data is available.');
      //window.location.assign('http://127.0.0.1:5500/screens/startplay.html');
      document.getElementById('proceed_btn').innerHTML=
      `<form action="/tutorial1" method="post">
      <button class="btn" type="submit" onclick="clicked()">Proceed</button>
    </form>`


   });
}


function clicked()
{
   console.log("clicked")
}