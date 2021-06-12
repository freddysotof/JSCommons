
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