const CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'

    }
}

const END_POINT = Object.freeze({
    API: 'https://api.url4u.in/inv/v1/inventory',
    GET_META_DATA: 'https://api.url4u.in/inv/v1/meta',
    WAKE: 'https://api.url4u.in/inv/v1/health'
})

export const setInventoryHeader = (key, value, isHeader = true) => {

    if (isHeader)
        CONFIG.headers[key] = value;
    else
        CONFIG[key] = value;
}

export const wakeInventoryCall = () => executeEndPoint(END_POINT.WAKE, CONFIG)

export const getItemList = async () => {
    let config = { ...CONFIG, method: 'GET' }
    let resText = await executeEndPoint(END_POINT.API, config)
    return JSON.parse(resText);
}

export const saveRecord = (data, isUpdate = false) => {
    let config = { ...CONFIG, method: isUpdate ? "PUT" : 'POST', body: JSON.stringify(data) }
    return executeEndPoint(END_POINT.API, config)
}

export const deleteRecord = id => {
    let config = { ...CONFIG, method: 'DELETE' }
    return executeEndPoint(`${END_POINT.API}/${id}`, config)
}

export const getMetaData = async () => {
    let config = { ...CONFIG, method: 'GET' }
    let resText = await executeEndPoint(END_POINT.GET_META_DATA, config)
    return JSON.parse(resText);
}


const executeEndPoint = async (url, config) => {
    try {
        let res = await fetch(url, config).then(res => res.text())

        if (res.includes('error'))
            throw new Error(res);

        return res;
    } catch (err) {
        console.error(err)
    }
}