
function factorial(num){
    let result = 1;
    if (num == 0) {
        return 1;
    }
    
    for (let i = 1; i < num+1; i++) result *= i;
    return result;
    

    
}

const resultado = factorial(171);

console.log(resultado);