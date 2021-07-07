export const createLayer = (width, height) => {
    if(!width || !height) return 

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
}