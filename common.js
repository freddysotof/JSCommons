

const modalDialogClasses = {
    scrollable :1,
    large :2,
    xtraLarge :3,
    small : 4
    }

    // Si se quiere agregar mas clases en modal dialgos ya sea scrollable o el tamaño
    // en el parametro de classes se agregan las clases del enum con bitwise operator
    // Ej: ModalDialogClasses.scrollable | ModalDialogClasses.large
const CreateModal = (title, classes, html, toggle = false) => {
    const modalComponentDialog = $('#ModalComponent > .modal-dialog');
    modalComponentDialog.removeClass().addClass('modal-dialog');
    if(classes & ModalDialogClasses.scrollable)
        modalComponentDialog.removeClass().addClass('modal-dialog-scrollable');
    if(classes & ModalDialogClasses.scrollable)
        modalComponentDialog.removeClass().addClass('modal-lg');
    if(classes & ModalDialogClasses.scrollable)
        modalComponentDialog.removeClass().addClass('modal-xl');
    if(classes & ModalDialogClasses.scrollable)
        modalComponentDialog.removeClass().addClass('modal-sm');
    $('#ModalComponent_header > h5').html(title);
    $('#ModalComponent_body').empty().append(html);
    $('#ModalComponent_footer>#btnModalCancel').css({ 'visibility': 'visible', display: 'block' })
        .removeClass().addClass('btn btn-outline-danger');
    $('#ModalComponent_footer>#btnModalAction').css({'visibility':'hidden'})
        .removeClass().addClass('btn btn-brand btn-hover-brand');
    $('#ModalComponent_footer>#btnModalClean').css({ visibility: 'hidden' })
        .removeClass().addClass('btn btn-outline-accent');
    if(toggle)
        $('#ModalComponent').modal('toggle');

}

const SetModalButtonVisible = () => $('#ModalComponent_footer > button').css("visibility", "visible")
const HideModalButtons = (selectorException = '#btnModalClose') => $('#ModalComponent_footer > button').not(selectorException).css("visibility", "hidden")
const EditModalButton = (selector, title, actionName, classNames, visibility = true, css = null) => {
    if (title)
        $(selector).html(title);
    if(actionName)
        $(selector).attr("onclick", `${actionName}`);
    if (classNames)
        $(selector).removeClass().addClass('btn').addClass(classNames)
   if (visibility)
        $(selector).css('visibility', 'visible')
    else
        $(selector).css('visibility', 'hidden')
    if (css)
        $(selector).css(css);
}
const CreateModalButton = (id, title, actionName, classNames, visibility = true) => {
    $('#ModalComponent_footer').append(`
        <button
            type="button"
            onclick="${actionName}"
            class="btn ${classNames}"
            style="visibility:${visibility?"visible":"hidden"}"
            id="${id}">
            ${title}
        </button>`);
};
const ToggleModal = () => $('#ModalComponent').modal('toggle');
const RedirectTo = (url, isNewTarget = false) => {
    if (isNewTarget)
        window.open(url, "_blank");
    else
        window.location.href = url
};


const formatDate = (date) => {
    if (date) {
        const arrDate = date.split('-');
        if (arrDate.length == 3)
            return `${arrDate[2]}-${arrDate[1]}-${arrDate[0]}`;
    }
    return null;
}
const removeInputTextFormat = (val) => val.replaceAll('-', '').replaceAll('_', '');
const convertTextToInt = (val) => parseInt(val);
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

const swalType = {
    INFO: "info",
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success"
};


const validateSelect = (element) =>KTBootstrapSelect.validate(element)

const blockPage = (message = "Espere mientras se cargan los datos",color = '#F7F8FA', state = KTBlockUI.state.success, type = null, size = KTBlockUI.size.large) => KTBlockUI.Block(color, state, message, type, size);

const blockElement = (selector, message = null,color = '#F7F8FA', state = KTBlockUI.state.success, type = null, size = KTBlockUI.size.large)  => KTBlockUI.Block(color, state, message, type, size, selector);

const unBlockPage = () => KTBlockUI.Unblock();
const unBlockElement = (selector) => KTBlockUI.Unblock(selector);
const openNewTab = (isExternalModule = false, moduleName, url, isAppActive, isPositionBefore, appName, positionInTab) =>
{
    if (window.top != window) {
        const menuUrl = `${moduleName}/${url}`;
        window.top.openNewTab(menuUrl, isAppActive, isPositionBefore, appName, positionInTab);
    }
    else {
        switch (isExternalModule) {
            case true:
                const externalUrl = `${window.location.origin}/modulos/${moduleName}/${url}`;
                window.open(externalUrl, "_blank");
                break;
            default:
                const internalUrl = `${window.location.origin}/${url}`;
                window.open(internalUrl, "_blank");
                break;
        }
    }
}
const goToExternalModule = (moduleName,appName,route="account/login",params) => {
    let token = `?token=@Session["token"]`;
    let url = `${route}${token}&${params}`;
    OpenNewTab(true, moduleName, url, null, null, appName);
}
const validateForm = async () =>{
    var result = true;
    $('.Required>select').each(function () {
        result = ValidateSelect(this);
    })
    $('.Required').not('select').not('.dropdown').each(function () {
        if (this.value == '') {
            result = false;
            $(this).attr("style", "border-color:#FF8000; height:23px");
        }
    });
}
