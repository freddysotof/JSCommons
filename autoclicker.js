const autoClick = (classId,position)=>{
  let tbody = $(classId).siblings('tbody')[0]
  let row = $('tr',tbody)[position];
	let input = $('input',temp1);
let botonSubmit = document.getElementById('btnGuardar')
setInterval(()=>{
window.alert = function() {};
	input.click();
	botonSubmit.click();
},500)
}
