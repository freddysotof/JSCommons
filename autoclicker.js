const autoClick = (classId,position)=>{
	let input = $(`[name='${classId}']`)[position]
let botonSubmit = document.getElementById('btnGuardar')
setInterval(()=>{
window.alert = function() {};
	input.click();
	botonSubmit.click();
},500)
}
