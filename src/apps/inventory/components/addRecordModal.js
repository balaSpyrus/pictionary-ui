import React, { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars';
import { saveRecord } from '../util/endpoints';
import { AppModal } from '../../../components';

const FORM_DATA = Object.freeze({
    "name": "",
    "category": {
        "id": 1
    },
    "priority": 0,
    "isHealthy": {
        "id": 0
    },
    "quantityUnit": "KG",
    "expiryDays": 0,
    "consumptionRatePerDay": 0,
    "availableQuantity": 0,
    "mfgDate": "",
    "boughtOn": ""
});

const AddRecordModal = ({ isOpen, onClose, onComplete, metaData }) => {

    const [formData, setFormData] = useState(FORM_DATA);

    const saveRecordData = e => {
        let reqData = JSON.parse(JSON.stringify(formData));

        reqData.isHealthy = { id: Number(reqData.isHealthy) }
        reqData.category = { id: Number(reqData.category) }
        reqData.expiryDays = Number(reqData.expiryDays)
        reqData.consumptionRatePerDay = Number(reqData.consumptionRatePerDay)
        reqData.availableQuantity = Number(reqData.availableQuantity)

        saveRecord(reqData, reqData.id ? true : false).then(() => onComplete())
        e.preventDefault();

    }

    const onValueChange = e => {

        setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }))
        e.persist()
    }

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Item Details"
        >
            <form class="form-horizontal">
                <fieldset>

                    <legend>
                        Item Details

                        <div style={{ float: 'right' }} className='icon closebtn' onClick={onClose}><i class="fa fa-times-circle" aria-hidden="true" /></div>
                    </legend>

                    <Scrollbars
                        renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{ display: "none" }} />}
                        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{ display: "none" }} />}
                        style={{ width: 510, height: 360 }}>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="name">Item Name</label>
                            <div class="col-md-7">
                                <input id="name" name="name" type="text" value={formData.name} onChange={onValueChange} placeholder="Name of the Item" class="form-control input-md" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="priority">Priority</label>
                            <div class="col-md-7">
                                <select id="priority" name="priority" class="form-control" value={formData.priority} onChange={onValueChange}>
                                    {
                                        new Array(5).fill(0).map((ele, i) => <option key={i} value={(ele + i)}>{ele + i}</option>)
                                    }
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="category">Category Type</label>
                            <div class="col-md-7">
                                <select id="category" name="category" class="form-control" value={formData.category.id} onChange={onValueChange}>
                                    {
                                        metaData.categoryTypes && metaData.categoryTypes.map(each => <option key={each.id} value={each.id}>{each.name}</option>)
                                    }
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="quantityUnit">Unit</label>
                            <div class="col-md-7">
                                <select id="quantityUnit" name="quantityUnit" class="form-control" value={formData.quantityUnit} onChange={onValueChange}>
                                    {
                                        metaData.quantityUnitTypes && metaData.quantityUnitTypes.map((each, i) => <option key={i} value={each}>{each}</option>)
                                    }
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="isHealthy">Is Healthy</label>
                            <div class="col-md-7">
                                <select id="isHealthy" name="isHealthy" class="form-control" value={formData.isHealthy.id} onChange={onValueChange}>
                                    {
                                        metaData.isHealthyTypes && metaData.isHealthyTypes.map(each => <option key={each.id} value={each.id}>{each.name}</option>)
                                    }
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="expiryDays">Expiire In (Days)</label>
                            <div class="col-md-7">
                                <input id="expiryDays" name="expiryDays" type="number" value={formData.expiryDays} onChange={onValueChange} placeholder="no of days till expiration" class="form-control input-md" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="consumptionRatePerDay">Consumption (Days)</label>
                            <div class="col-md-7">
                                <input id="consumptionRatePerDay" name="consumptionRatePerDay" value={formData.consumptionRatePerDay} onChange={onValueChange} type="number" placeholder="consumption per day" class="form-control input-md" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="availableQuantity">Stock Left</label>
                            <div class="col-md-7">
                                <input id="availableQuantity" name="availableQuantity" value={formData.availableQuantity} onChange={onValueChange} type="number" placeholder="remaining quantity of the item" class="form-control input-md" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="boughtOn">Bought On</label>
                            <div class="col-md-7">
                                <input id="boughtOn" name="boughtOn" type="date" value={formData.boughtOn} onChange={onValueChange} placeholder="Date of purchase" class="form-control input-md" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-md-4 control-label" htmlFor="mfgDate">Manufactured On</label>
                            <div class="col-md-7">
                                <input id="mfgDate" name="mfgDate" type="date" value={formData.mfgDate} onChange={onValueChange} placeholder="date of manufacturing" class="form-control input-md" required />
                            </div>
                        </div>
                    </Scrollbars>
                    <div class="col-md-12 nopadding">
                        <div id="apply" name="apply" style={{ float: 'right' }} className='icon apply' onClick={saveRecordData}><i class="fa fa-check-circle" aria-hidden="true" /></div>
                    </div>
                </fieldset>
            </form>

        </AppModal>
    )
}

export default AddRecordModal;