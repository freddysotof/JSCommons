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

const RedirectTo = (url, isNewTarget = false) => {
    if (isNewTarget)
        window.open(url, "_blank");
    else
        window.location.href = url
};

const BuildUrl = (baseUrl, url) => `${baseUrl}${url}`; 





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
