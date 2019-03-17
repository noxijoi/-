var BIT_DEPTH = 6;
var STAGES_PER_CICLE = 3;
function decToBin(num){
    var maxInt = Math.pow(2, BIT_DEPTH);
    if( num >= maxInt){
        alert("число " + num + "больше " + maxInt);
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
    for(var i = bitArr.length - 1; i >= 0; i--){
        if(bitArr[i] == 1){
            buf = 1;
            result += Math.pow(2, bitArr.length - i - 1);
        }
    }
    return result;
}
function isPositive(binNum)
{
    return binNum[0] == 0;
}
function shifRAReg(regR, regA){
    var sign = regR.shift();
    var bit = regA.shift();
    regR.push(bit);
    regA.push(0);
    return sign;
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
function setYoungerDigit(binNum, value){
    binNum[binNum.length - 1] = value;
}
function toIntArr(arr){
    for(var i = 0; i < arr.length; i++){
        if(arr[i].match(/^\d+$/)){
            arr[i] = + arr[i];
        }else {
            alert("incorrect input data, can't translate "+ arr[i] + " to int");
            throw new SyntaxError("incorrect input data, can't translate "+ arr[i] + " to int");
        } 
        if(arr[i] == 0 ){
            alert("деление на ноль!")
            throw new SyntaxError("деление на ноль!");
        }
    }
    return arr;
}
function setCellRegInfo(regA, regR, row, col){
    var cell = document.getElementById("r" + row + "c" + col);
    cell.innerHTML ="A = " + formatView(regA)+ "<br>"
    + "R = " + formatView(regR) + "<br>";
}
function setCellInfo(info, row, col){
    var cell = document.getElementById("r" + row + "c" + col);
    cell.innerHTML += info;
}
function formatView(reg){
    var result ="";
    if(reg.length % 2  == 1){
        result += reg[0] +".";
        for(var i = 1; i < 4; i++){
            result += reg[i];
        }
        result += " ";
        for(var i = 4; i < reg.length; i++){
            result += reg[i];
        }
    } else{
        for(var i = 0; i < reg.length; i++){
            result += reg[i];
        }
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
        if(columnIndex == 3 * BIT_DEPTH + 1){
            name = "результат"
        }
        thCell.innerHTML = name;
        row.appendChild(thCell);
    }
    table.appendChild(row);
    var rowNumber = numOfPair + 1 + BIT_DEPTH * STAGES_PER_CICLE;
    var colNumber = STAGES_PER_CICLE * BIT_DEPTH + 2;
    for (var rowIndex = 1; rowIndex < rowNumber;  rowIndex++) {
        var row = document.createElement("tr");
        row.setAttribute("id", "r" + rowIndex);
        for (var columnIndex = 0; columnIndex < colNumber; columnIndex++) {
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
    for(var i = 0; i < firstVector.length; i++){
        firstVector[i] = decToBin(firstVector[i]);
        firstVector[i].shift();
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
    var rowCol = numOfPair + BIT_DEPTH * STAGES_PER_CICLE;
    for( var  i = 1; i < rowCol; i++){
        setCellInfo("<br>Тактов:<br>"+ i, i, 0);
        setCellInfo("<br>Тактов:<br>"+ i +"<br>", i, 3 * BIT_DEPTH + 1);
    }
    for(var cicle = 0; cicle < BIT_DEPTH; cicle++){
        var signs = new Array(numOfPair);
        var stage = 0;
        //1 shift
        for(var i = 0; i < numOfPair; i++){
            signs[i] = shifRAReg(registersP[i], registersA[i]);
            var row = i + 1 + cicle * STAGES_PER_CICLE + stage;
            setCellRegInfo(registersA[i], registersP[i],
                row, cicle * STAGES_PER_CICLE + 1 );
        }  
        stage++;  
        //2 submit or add
        for(var i = 0; i < numOfPair; i++){
            if(signs[i] == 0){
                registersP[i] = sumBinNumbers(registersP[i],
                twosComplemnetCode(registersB[i]));
            } else{
                registersP[i] = sumBinNumbers(registersP[i],
                    registersB[i]);
            }
            var row = i + 1 + cicle * STAGES_PER_CICLE + stage;
            setCellRegInfo(registersA[i],  registersP[i], 
                row, cicle * STAGES_PER_CICLE + 2 );
        }
        stage++;
        //3 set low-order bit
        for(var i = 0; i < numOfPair; i++){
            if(isPositive(registersP[i])){
                setYoungerDigit(registersA[i], 1);
            } else{
                setYoungerDigit(registersA[i], 0);
            }
            var row = i + 1 + cicle * STAGES_PER_CICLE + stage;
            setCellRegInfo(registersA[i], registersP[i],
                 row, cicle * STAGES_PER_CICLE + 3 );
        }
    }
    for(var i = 0; i < numOfPair; i++){
        var info = binToDec(firstVector[i]) + '/' + binToDec(secondVector[i]) +"<br>";
        var result = binToDec(registersA[i]);
        var row = i + BIT_DEPTH * STAGES_PER_CICLE;
        setCellInfo(info + "результат: <br>" + result +"<br>",
                 row , STAGES_PER_CICLE * BIT_DEPTH + 1);
    } 
}