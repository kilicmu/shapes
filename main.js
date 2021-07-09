import { Radar } from "@libs/radar/index.js"
const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 400
const states = [
    {
        label: 'hello1',
        proportion: '0.5'
    },
    {
        label: 'hello2',
        proportion: '0.2'
    },
    {
        label: 'hello3',
        proportion: '0.7'
    },
    {
        label: 'hello4',
        proportion: '0.6'
    },
    {
        label: 'hello5',
        proportion: '0.2'
    },
    {
        label: 'hello6',
        proportion: '0.5'
    }
]
new Radar("#node", DEFAULT_WIDTH, DEFAULT_HEIGHT, states)
