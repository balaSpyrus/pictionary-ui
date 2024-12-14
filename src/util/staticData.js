const sideBarMenus = require(`../data/sideBarMenu.json`);
const aboutData = require(`../data/about.json`);

let footer = require(`../data/footerLinks.json`);
let categories = require(`../data/appCategories.json`);

const appCategories = categories.map(categorie => {

    if (categorie.type === "Web app")
        categorie.appList = categorie.appList.filter(app => app.appName === 'Pictionary')

    return categorie
})

const footerContent = footer.map(eachFooter => {
    eachFooter.description = eachFooter.description.map(eachDescription => (
        { ...eachDescription, link: `${process.env.PUBLIC_URL}/${eachDescription.link}` })
    )
    return eachFooter
})

const getAboutDetails = (type = 'default', backLink = '/') => {
    return { ...aboutData[type], backLink }
}

export {
    getAboutDetails,
    appCategories,
    sideBarMenus,
    footerContent
}