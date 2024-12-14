export function debounce(func, delay) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            func.apply(this, arguments)
        }, delay)
    };
}

export const copyToClipboard = url => {
    let textField = document.createElement('textarea')
    textField.innerText = url
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
};