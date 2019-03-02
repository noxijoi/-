function decTobin(numb){
    if( numb > 32){
        alert("число" + numb + "больше 32");
        return;
    }
    var result = "0";
    if(numb < 0 ){
        result = "1"
    }
    result += parseInt(Math.abs(numb)).toString(2);
    if( result.length < 6){
        var zeros = "";
        for(var i = 0; i< 6 - result.length; i++ ){
            zeros += "0";
        }
        result = result[0] + zeros + result.substring(1);
    }
    return result;
}

function leftShift(number){
    var result = number.charAt(0);
    var temp = number.substring(2);
    result = result + temp + "0";
    return result;
}


function sumBinNumbers(num1, num2){
    var result = "";
    var carry = 0;
    for(var i = num1.length - 1; i >=0; i--){
            var sym1 =  +num1.charAt(i);
            var sym2 =  +num2.charAt(i);
            var sum = (sym1 ^ sym2 ^ carry).toString() ;
            result = sum + result;
            carry = (sym1 & carry)|(sym2 & carry)|(sym1 & sym2);
    }
    return result;
}

function twosComplemnetCode(num){
    var result = num.charAt(0);
    for(var i = 1; i < num.length; i++ ){
        var ch = +!parseInt(num.charAt(i));
        result += ch;
    }
    result = sumBinNumbers(result, "000001");
    return result;
}

alert(twosComplemnetCode("100100"));