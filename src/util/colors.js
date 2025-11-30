import * as colors from '@material-ui/core/colors';

const materialUIPallete = ['red',
    'pink',
    'purple',
    'deepPurple',
    'indigo',
    'blue',
    'lightBlue',
    'cyan',
    'green',
    'lightGreen',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deepOrange',
    'brown',
    'grey',
    'blueGrey']

export const colorPallete = [...materialUIPallete.map(color => colors[color][500]), 'white', 'black'];

export const getRandomColor = () => colors[materialUIPallete[Math.floor(Math.random() * materialUIPallete.length)]];

export const getColor = (color = 'red', shade = 500) => {

    if (materialUIPallete.includes(color))
        return colors[color][shade]
    else
        return colors['grey'][shade]
}