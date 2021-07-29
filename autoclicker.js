const autoClick = (classId,position)=>{
  let classElement = document.getElementsByName(classId)[position]
let botonSubmit = document.getElementById('btnGuardar')
setInterval(()=>{
window.alert = function() {};
	classElement.click();
	botonSubmit.click();
},500)
}
