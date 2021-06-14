// Fetch.js

const RequestMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
}

//Flag Enumerations in JavaScript
//Flag enums: Values must increment by powers of 2
const ParameterType = {
    Route: 1,
    RouteValueOnly:2,
    QueryString: 4,
    JsonBody:8
}

const objectToQueryString = (obj) => Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
const objectToPathRoute = (obj) => Object.keys(obj).map(key => key + '/' + obj[key]).join('/');
const objectToRouteValue = (obj) => Object.keys(obj).map(key => obj[key]).join('/');

const generateErrorResponse = (message) => {
    status: 'error',
    message
};

const request = async (url, params, paramType, method) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (params)
        if (method === RequestMethod.GET && paramType == ParameterType.Route)
            url += `/${objectToPathRoute(params)}`;
        else if (method === RequestMethod.GET && paramType == ParameterType.RouteValueOnly)
            url += `/${objectToRouteValue(params)}`;
        else if (method === RequestMethod.GET && paramType == ParameterType.QueryString)
            url += $`?${objectToQueryString(params)}`;
        else {
            if (paramType & ParameterType.Route)
                url += `/${objectToPathRoute(params)}`;
            if (paramType & ParameterType.RouteValueOnly)
                url += `/${objectToRouteValue(params)}`;
            if (paramType & ParameterType.QueryString)
                url += $`?${objectToQueryString(params)}`;
            if (paramType & ParameterType.JsonBody)
                options.body =  JSON.stringify(params);
        }
        

    const response = await fetch(url, options);

    if (response.status !== 200) {
        return generateErrorResponse('The server responded with an unexpected status.');
    }

    const result = await response.json();

    return result;
}




const get = (url, params, paramType = ParameterType.RouteValueOnly) => request(url, params, paramType, RequestMethod.GET);

const create = (url, params) => request(url, params, ParameterType.JsonBody, RequestMethod.POST);

const update = (url, params) => request(url, params, ParameterType.JsonBody, RequestMethod.PUT);

const remove = (url, params, paramType = ParameterType.RouteValueOnly) => request(url, params, paramType, RequestMethod.DELETE);


//export default {
//    get,
//    create,
//    update,
//    remove,
//    RequestMethod,
//    ParameterType
//};