export const dummyData = {
    "id": "4523b9eb-5409-44fc-b3f7-0cc2e18b6d36",
    "name": "Rice",
    "category": {
        "id": 1,
        "name": "Cooking Essentials"
    },
    "priority": 1,
    "isHealthy": {
        "id": 0,
        "name": "-"
    },
    "quantityUnit": "KG",
    "expiryDays": 180,
    "consumptionRatePerDay": 0.2,
    "availableQuantity": 2.0,
    "mfgDate": "2020-03-20",
    "boughtOn": "2020-03-20",
    "expiryDate": "2020-09-16",
    "availableTillDays": null,
    "availableTillDate": null
}

export const getName = key => {
    // table header names
    switch (key) {
        case 'name': return 'Item'
        // case 'mfgDate': return 'Manufactured On'
        case 'bestBeforeDays': return 'Expires On'
        case 'availableQuantity': return 'Stock Left'
        // case 'quantityUnit': return 'Unit'
        case 'consumptionRatePerDay': return 'Consumed / Day'
        // case 'boughtOn': return 'Purchased On'
        case 'expiryDate': return 'Expires On'
        default: return key
    }
}

export const wrapWithEmpty = value => value ? value : 'N/A';

