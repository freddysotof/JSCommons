const swalType = {
    INFO: "info",
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success"
};

const swalAlert = (titulo, mensaje, type, btnconfirm='Aceptar')=> {
    const response = swal({
        title: titulo,
        text: mensaje,
        type: type,
        confirmButtonText: btnconfirm
    }).then(function(result) {
        return true;
    });
    return response;
}

const swalConfirm = (titulo, mensaje, type, btnconfirm='Aceptar', )=> {
    const response = swal({
        title: titulo,
        text: mensaje,
        type: type,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: btnconfirm
    }).then(function(result) {
        if (result.value) {
            return true;
        } else {
            return false;
        }
    });
    return response;
}

