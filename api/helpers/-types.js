/** @type {<F>(f:F)=>Awaited<ReturnType<F>>} */
export function MRequire(f) {
    return f
}

/** @type {<X,F extends (p:X)=>any>(x:X,f:F)=>asserts x is (X & Awaited<ReturnType<F>>)} */
export function MNext(x,f) {
    Object.assign(x,f(x))
}