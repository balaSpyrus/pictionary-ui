import React from 'react';
import CanvasJSReact from '../../../lib/canvasjs-2.3.2/canvasjs.react';
import '../css/chart.css';
import { getName } from '../util/util';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends React.Component {

    state = {
        selectedOptions: [],
        selected: 'name',
        dataList: this.props.dataList,
        dataPoints: []

    }
    chart = null;

    componentDidMount() {
        this.setSelectOptions();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dataList !== state.dataList) {
            return { dataList: props.dataList }
        }
        return null;
    }


    componentDidUpdate(prevProps, prevState) {
        // Typical usage (don't forget to compare props):
        if (this.props.dataList !== prevProps.dataList) {
            this.setSelectOptions();
            if (!this.state.dataPoints.length) {
                this.generateDataPoints(this.state.selected)
            }
        }
        if (prevState.selected !== this.state.selected) {
            this.generateDataPoints(this.state.selected)
        }
    }

    setSelectOptions = () => {
        if (this.state.dataList.length) {
            this.setState({
                selectedOptions: Object.keys(this.state.dataList[0])
                    .filter(value => !['id', 'availableTillDays', 'availableTillDate'].includes(value))
                    .filter(value => ['name', 'isHealthy', 'category'].includes(value)) // only 3 filter is allowed till now
            })
        }
    }

    generateDataPoints = selectedField => {

        let dataPoints = []

        switch (selectedField) {
            case 'name': {

                dataPoints = this.getItemFieldDataPoints(selectedField);
                break;
            }
            case 'isHealthy': {

                dataPoints = this.getIsHealthyFieldDataPoints(selectedField);
                break;
            }
            case 'category': {

                dataPoints = this.getCategoryFieldDataPoints(selectedField);
                break;
            }
            default:
                break;
        }

        this.setState({
            dataPoints
        })

    }

    getItemFieldDataPoints = (selectedField) => {
        let counterObj = {}, dataPoints = [];

        this.state.dataList.forEach(each => {
            if (counterObj[each[selectedField]] !== undefined)
                counterObj[each[selectedField]]++;
            else
                counterObj[each[selectedField]] = 0;
        });

        for (let key in counterObj)
            dataPoints.push({ y: this.getPercentage(counterObj[key]), label: key })

        return dataPoints;
    }

    getIsHealthyFieldDataPoints = (selectedField) => {

        let counterObj = {}
        this.props.metaData.isHealthyTypes.forEach(each => { counterObj[each.name] = 0 });

        return this.getDataPoints(counterObj, selectedField);

    }

    getCategoryFieldDataPoints = (selectedField) => {

        let counterObj = {}
        this.props.metaData.categoryTypes.forEach(each => { counterObj[each.name] = 0 });

        return this.getDataPoints(counterObj, selectedField);

    }

    getDataPoints = (counterObj, field) => {

        let dataPoints = [];

        this.state.dataList.forEach(data => counterObj[data[field].name]++);
        for (let key in counterObj)
            dataPoints.push({ y: this.getPercentage(counterObj[key]), label: key })

        return dataPoints;
    }

    getPercentage = value => (value * 100) / this.state.dataList.length

    onFieldChange = e => this.setState({ selected: e.target.value })

    render() {
        return (
            <div>
                <div className='chart-dropdown'>
                    <span> Field : </span>
                    <select
                        className="form-control"
                        value={this.state.selected}
                        onChange={this.onFieldChange}>
                        {this.state.selectedOptions.map(eachOption => (
                            <option key={eachOption} value={eachOption}>
                                {getName(eachOption)}
                            </option>
                        ))}
                    </select>
                </div>

                <CanvasJSChart options={{
                    animationEnabled: true,
                    exportEnabled: true,
                    theme: "light1", // "light1", "dark1", "dark2"
                    title: {
                        text: "Inventory Chart"
                    },
                    data: [{
                        type: "pie",
                        indexLabel: "{label}: {y}%",
                        startAngle: -90,
                        dataPoints: this.state.dataPoints
                    }]
                }}
                    onRef={ref => this.chart = ref} />
            </div>
        );
    }
}

export default Chart;