
var BIT_DEPTH = 6;
function decToBin(num){
    var maxInt = Math.pow(2, BIT_DEPTH);
    if( num >= maxInt){
        alert("число" + num + "больше" + maxInt);
        return;
    }
    var result = new Array(BIT_DEPTH + 1);
    if(num < 0 ){
        result[0] = 1;
    } else{
        result[0] = 0;
    }
    var strNum  = parseInt(Math.abs(num)).toString(2);
    if( strNum.length < BIT_DEPTH){
        var zeros = "";
        for(var i = 0; i < BIT_DEPTH - strNum.length; i++ ){
            zeros += "0";
        }
        strNum = zeros + strNum;
    }
    for(var i = 0; i < 6; i++){
        result[i + 1] = parseInt(strNum[i]);
    }
    return result;
}

function binToDec(bitArr){
    var result = 0;
    var buf = 0;
    for(var i = bitArr.length - 1; i > 0; i--){
        if(bitArr[i] == 1){
            buf = 1;
            result += Math.pow(2, bitArr.length - i - 1);
        }
    }
    return result;
}

function shiftUntilMatch(bitArr1, bitArr2){
    var n1 = 0;
    var n2 = 0;
    var i = 0;
    for(var i = 0; n1 == 0 && i < bitArr1.length; i++){
        if( bitArr1[i] == 1){
            n1 = i;
        }
    }
    for(var i = 0; n2 == 0 && i < bitArr2.length; i++){
        if( bitArr2[i] == 1){
            n2 = i;
        }
    }
    var shift = n2 - n1;
    while( n1 < n2){
        leftShift(bitArr2);
        n2--;
    }
    return shift;
}

function isPositive(binNum)
{
    return binNum[0] == 0;
}

function leftShift(bitArr){
    var sign = bitArr.shift();
    bitArr.shift();
    bitArr.push(0);
    bitArr.unshift(sign);
    //а надо ли
    return bitArr;
}

function sumBinNumbers(num1, num2){
    var result = new Array(BIT_DEPTH + 1);
    var carry = 0;
    for(var i = num1.length - 1; i >=0; i--){
        var sym1 =  +num1[i];
        var sym2 =  +num2[i];
        var sum = +(sym1 ^ sym2 ^ carry);
        result[i] = + sum;
        carry = (sym1 & carry)|(sym2 & carry)|(sym1 & sym2);
    }
    return result;
}

function twosComplemnetCode(num){
    var result = new Array(BIT_DEPTH + 1);
    for(var i = 0; i < num.length; i++ ){
        var ch = +!num[i];
        result[i]= ch;
    }
    result = sumBinNumbers(result, decToBin(1));
    return result;
}

function binCompleteToDec(num){
    var result = new Array(BIT_DEPTH + 1);
    for(var i = 0; i < num.length; i++ ){
        var ch = +!num[i];
        result[i]= ch;
    }
    result =  + binToDec(result);
    result += +1;
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

function setCellRegInfo(regA, regB, regR, row, col){
    var cell = document.getElementById("r" + row + "c" + col);
    cell.innerHTML ="A = " + formatView(regA)+ "<br>"
    + "B = " + formatView(regB) + "<br>"
    + "R = " + formatView(regR) + "<br>";
}
function setCellInfo(info, row, col){
    var cell = document.getElementById("r" + row + "c" + col);
    cell.innerHTML = info;
}

function formatView(reg){
    var result ="";
    result += reg[0] +".";
    for(var i = 1; i < 4; i++){
        result += reg[i];
    }
    result += " ";
    for(var i = 4; i < reg.length; i++){
        result += reg[i];
    }
    return result;
}

function generateTable(numOfPair){
    var tableDiv = document.getElementById("TableDiv");
    document.body.removeChild(tableDiv);
    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("id","TableDiv");
    var table = document.createElement("table");
    var row = document.createElement("tr");
    row.setAttribute("id", "r"+ 0);
    for(var columnIndex = 0; columnIndex < 3 * BIT_DEPTH + 2; columnIndex++){
        var thCell = document.createElement("th");
        var name;
        switch(columnIndex % 3){
            case 1:
                name = columnIndex + "<br>вычитание";
                break;
            case 2:
                name = columnIndex + "<br>сдвиг";
                break;
            case 0:
                name = columnIndex + "<br>установка младшего бита";
                break;
        }
        if(columnIndex == 0){
            name = "Пары"
        }
        if(columnIndex == 3 * BIT_DEPTH + 1){
            name = "результат"
        }
        thCell.innerHTML = name;
        row.appendChild(thCell);
    }
    table.appendChild(row);
    for (var rowIndex = 1; rowIndex <= numOfPair +1; rowIndex++) {
        var row = document.createElement("tr");
        row.setAttribute("id", "r" + rowIndex);
        for (var columnIndex = 0; columnIndex < 3 * BIT_DEPTH + 2; columnIndex++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", "r" + rowIndex + "c" + columnIndex);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    tableDiv.appendChild(table);
    document.body.appendChild(tableDiv);
}

function start(){
    var firstString = document.getElementById('FirstNumbers').value;
    var secondString = document.getElementById('SecondNumbers').value;
    var tactPerStage = + document.getElementById("Time").value;

    var firstVector = firstString.split(',');
    var secondVector = secondString.split(',');

    firstVector = toIntArr(firstVector);
    secondVector = toIntArr(secondVector);

    if(firstVector.length != secondVector.length){
        alert("arrays have different length")
        throw new SyntaxError("arrays have different length");
    }

    var numOfPair = firstVector.length;

    generateTable(numOfPair);

    for(var i = 0; i < numOfPair; i ++){
        var info = firstVector[i] + '/' +secondVector[i];
        setCellInfo(info, i + 1, 0); 
    }
    //перевод в 2сс
    for(var i = 0; i< firstVector.length; i++){
        firstVector[i] = decToBin(firstVector[i]);
        secondVector[i] = decToBin(secondVector[i]);
    }

    var registersA = new Array(numOfPair);
    var registersB = new Array(numOfPair);
    var registersP = new Array(numOfPair);
    //распрделяются значения по регистрам
    for(var i = 0; i < numOfPair; i++){
        registersA[i] = firstVector[i];
        registersB[i] = secondVector[i];
        registersP[i] = decToBin(0);
    }
    //первоначальный сдвиг
    var numOfShift = new Array(numOfPair);
    for(var i = 0; i < numOfPair; i++){
        numOfShift[i] = shiftUntilMatch(registersA[i],registersB[i]);
    }
    

    var time = 0;
    var stagesPerCicle = 3;
    for(var cicle = 0; cicle < BIT_DEPTH; cicle++){
        //1
        for(var i = 0; i < numOfPair; i++){
            if(cicle < numOfShift[i] + 1){
                if(isPositive(registersA[i])){
                    registersA[i] = sumBinNumbers(registersA[i],
                         twosComplemnetCode(registersB[i]));
                } else{
                    registersA[i] = sumBinNumbers(registersA[i],
                        registersB[i]);
                }
            }
            setCellRegInfo(registersA[i], registersB[i], registersP[i], 
                i + 1, cicle * stagesPerCicle + 1 );
        }
        time += tactPerStage;
        setCellInfo("Time: " + time, numOfPair + 1, cicle * stagesPerCicle + 1 );
        //2
        for(var i = 0; i < numOfPair; i++){
            if(cicle < numOfShift[i] + 1){
                registersA[i] =  leftShift(registersA[i]);
                registersP[i] =  leftShift(registersP[i]);
            }
            setCellRegInfo(registersA[i], registersB[i], registersP[i],
                 i + 1, cicle * stagesPerCicle + 2 );
        }
        time += tactPerStage;
        setCellInfo("Time: " + time, numOfPair + 1, cicle * stagesPerCicle + 2 );
        //3
        for(var i = 0; i < numOfPair; i++){
            if(cicle < numOfShift[i] + 1){
                if(isPositive(registersA[i])){
                    setYoungerDigit(registersP[i], 1);
                } else{
                    setYoungerDigit(registersP[i], 0);
                }
            }
            setCellRegInfo(registersA[i], registersB[i], registersP[i],
                 i + 1, cicle * stagesPerCicle + 3 );
        }
        time += tactPerStage;
        setCellInfo("Time: " + time, numOfPair + 1, cicle * stagesPerCicle + 3 );
    }
    for(var i = 0; i < numOfPair; i++){
        var result = binToDec(registersP[i]);
        setCellInfo("результат: <br>" + result +"<br>"+ "Тактов: " +time,
                 i+1, stagesPerCicle * BIT_DEPTH + 1);
    } 
}


