function decToBin(numb){
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
function binToDec(num){
    var result;
    for(var i = num.length - 1; i > 0; i--){
        if(num[i] == "1"){
            buf = 1;
        } else{
            buf = 0;
        } 
        result += Math.pow(2, buf);
    }
    return result;
}

function isPositive(binNum)
{
    return binNum[0] == '0';
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

function setYoungerDigit(binNum, value){
    binNum[binNum.length - 1] = value;
};

function toIntArr(arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i].match(/^\d+$/)){
            arr[i] = + arr[i];
        }
        else {
            alert("incorrect input data, can't translate "+ arr[i] + " to int");
            throw new SyntaxError("incorrect input data, can't translate "+ arr[i] + " to int");
        }   
    }
    return arr;
}

function generateTable(elementsNumber){
    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("id","TableDiv");
    var table = document.createElement("table");
    var row = document.createElement("tr");
    row.setAttribute("id", "r"+ 0);
    for(var columnIndex = 0; columnIndex < elementsNumber; columnIndex++){
        var thCell = document.createElement("th");
        var name;
        switch(columnIndex % 3){
            case 1:
                name = columnIndex + "<br>сдвиг";
                break;
            case 2:
                name = columnIndex + "<br>вычитание";
                break;
            case 0:
                name = columnIndex + "<br>установка младшего бита";
                break;
        }
        if(columnIndex == 0){
            name = "Пары"
        }
        if(columnIndex == elementsNumber - 1){
            name = "результат"
        }
        thCell.innerHTML = name;
        row.appendChild(thCell);
    }
    table.appendChild(row);
    for (var rowIndex = 1; rowIndex < elementsNumber; rowIndex++) {
        var row = document.createElement("tr");
        row.setAttribute("id", "r" + rowIndex);
        for (var columnIndex = 0; columnIndex < elementsNumber; columnIndex++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", "h" + rowIndex + "w" + columnIndex);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    tableDiv.appendChild(table);
    document.body.appendChild(tableDiv);
}

function start(){
    var firstNums = document.getElementById('FirstNumbers').value;
    var secondNums = document.getElementById('SecondNumbers').value;
    var time = + document.getElementById("Time").value;

    var firstArr = firstNums.split(',');
    var secondArr = secondNums.split(',');

    firstArr = toIntArr(firstArr);
    secondArr = toIntArr(secondArr);

    if(firstArr.length != secondArr.length){
        alert("arrays have different length")
        throw new SyntaxError("arrays have different length");
    }
    generateTable(firstArr.length + 18);

    var numOfPair = firstArr.length;
    //перевод в 2сс
    for(var i = 0; i< firstArr.length; i++){
        firstArr[i] = decToBin(firstArr[i]);
        secondArr[i] = decToBin(secondArr[i]);
    }

    var registersA = new Array(numOfPair);
    var registersB = new Array(numOfPair);
    var registersP = new Array(numOfPair);
    //распрделяются значения по регистрам
    for(var i = 0; i < numOfPair; i++){
        registersA[i] = firstArr[i];
        registersB[i] = secondArr[i];
        registersP[i] = decToBin(0);
    }

    for(var cicle = 0; cicle < 6; cicle++){
        //1
        for(var i = 0; i < numOfPair; i++){
            registersA[i] =  leftShift(registersA[i]);
            registersP[i] =  leftShift(registersP[i]);
        }
        console.log(registersA, registersB, registersP);
        //2
        for(var i = 0; i < numOfPair; i++){
            if(isPositive(registersP[i])){
                registersP[i] = sumBinNumbers(registersP[i],
                     twosComplemnetCode(registersB[i]));
            } else{
                registersP[i] = sumBinNumbers(registersP[i],
                    registersB[i]);
            }
        }
        console.log(registersA, registersB, registersP);
        //3
        for(var i = 0; i < numOfPair; i++){
            if(isPositive(registersP[i])){
                setYoungerDigit(registersP[i],'1');
            } else{
                setYoungerDigit(registersP[i],'0');
            }
        }
        console.log(registersA, registersB, registersP);
    }


}
