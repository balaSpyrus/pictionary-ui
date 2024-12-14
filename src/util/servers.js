
import CryptoJS from 'crypto-js';

const passPhrase = 'server'

const serverInfo = {
    1: CryptoJS.AES.encrypt(`pictionary-grkweb.herokuapp.com`, passPhrase).toString()
}

export const SERVERS = Object.keys(serverInfo)

export const getServer = key => CryptoJS.AES.decrypt(serverInfo[key], passPhrase)
    .toString(CryptoJS.enc.Utf8)