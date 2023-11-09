export function getStyles(el, prop){
    if(window.getComputedStyle){
        if(prop){
            return window.getComputedStyle(el, null)[prop]
        } else {
            return window.getComputedStyle(el, null)
        }
    } else {
        if(prop){
            return el.currentStyle[prop]
        } else {
            return el.currentStyle
        }
    }
}