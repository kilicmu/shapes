import { Radar } from "@libs/radar/index.js"
const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 400
const states = [0.5, 0.2, 0.7, 0.6, 1, 0.8]
new Radar("#node", DEFAULT_WIDTH, DEFAULT_HEIGHT, states)
