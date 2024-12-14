export const setCookie = (cname, cvalue, expirationValue = null, format = 'minutes') => {

    let cookieValues = cname + "=" + cvalue;

    if (expirationValue)
        cookieValues = cookieValues + ";expires=" + setExpiration(expirationValue, format);

    document.cookie = cookieValues + ";path=/";
}

const setExpiration = (expirationValue, format) => {
    let currentDate = new Date();
    switch (format) {
        case 'years':
            currentDate.setFullYear(currentDate.getFullYear() + expirationValue)
            break;
        case 'months':
            currentDate.setMonth(currentDate.getMonth() + expirationValue)
            break;
        case 'days':
            currentDate.setHours(currentDate.getHours() + expirationValue * 24)
            break;
        case 'hours':
            currentDate.setHours(currentDate.getHours() + expirationValue)
            break;
        case 'minutes':
            currentDate.setMinutes(currentDate.getMinutes() + expirationValue)
            break
        case 'seconds':
            currentDate.setSeconds(currentDate.getSeconds() + expirationValue)
            break;
        default:
            break;
    }
    return currentDate.toUTCString()
}

export const getCookie = cname => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const expireCookie = cname => {

    let yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
    document.cookie = cname + "=;expires=" + yesterday.toUTCString() + ";path=/";

}