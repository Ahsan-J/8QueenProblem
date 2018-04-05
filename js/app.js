var p = 25,m = 20,Generation = 0,willMutate=75;
var mutation = 0.25,max_fitness=[];

function board(arr){
    this.positions = arr;
    var getFitness = function (myArray){
        var fitness=0;
        for(var i=0;i<myArray.length;i++){
            if(moveRightDiagonal(myArray,i)&&moveLeftDiagonal(myArray,i)){
                fitness++;
            }
        }
        return fitness;
    }
    this.fitness = getFitness(arr);
    this.updateFitness = function(){
        this.fitness = getFitness(arr);
    }
}
function start(){
    var n = parseInt( $('#n').val() );
    var currentGeneration=1;
    Generation = 80000/n;
    parents = initBoards(p,n);
    // console.log(parents);
    $('#terminal').empty();
    $('#graph').empty();
    do{
        childs = [];
        for(var i=0;i<m/2;i++){
            var parentA = parents[Math.floor((Math.random() * parents.length))];
            var parentB = parents[Math.floor((Math.random() * parents.length))];
            if(parentA.fitness==n){
                createBoxes(n);
                plotArray(parentA.positions); 
                println(currentGeneration + ' -> '+parentA.fitness);
                println(parentA.positions);
                return
            }
            if(parentB.fitness==n){
                createBoxes(n);
                plotArray(parentB.positions); 
                println(currentGeneration + ' -> '+parentB.fitness);
                println(parentB.positions);
                return
            }
            
            var childA1 = parentA.positions.slice(0,4);
            var childA2 = parentB.positions.slice(4,parentA.length)
            var childB1 = parentB.positions.slice(0,4);
            var childB2 = parentA.positions.slice(4,parentB.length)
            childA1.splice(childA1.length,0,...childA2)
            childB1.splice(childB1.length,0,...childB2)
            childA1 = new Set(childA1);
            childB1 = new Set(childB1);

            var temp = [...parentA.positions];
            while(childA1.size<parentA.positions.length){
                var val = temp.pop();
                if(!childA1.has(val)){
                    childA1.add(val);
                }
            }

            var temp = [...parentB.positions];
            while(childB1.size<parentB.positions.length){
                var val = temp.pop();
                if(!childB1.has(val)){
                    childB1.add(val);
                }
            }

            var childB = new board([...childB1]);
            var childA = new board([...childA1]);

            if(Math.floor((Math.random() * n))<willMutate){
                swap(childA.positions[Math.floor((Math.random() * n))],childA[Math.floor((Math.random() * n))]);
                childA.updateFitness();
            }

            if(Math.floor((Math.random() * n))<willMutate){
                swap(childB.positions[Math.floor((Math.random() * n))],childB[Math.floor((Math.random() * n))]);
                childB.updateFitness();
            }

            if(childA.fitness==n){
                createBoxes(n);
                plotArray(childA.positions); 
                println(currentGeneration + ' -> '+childA.fitness);
                println(childA.positions);
                return
            }
            if(childB.fitness==n){
                createBoxes(n);
                plotArray(childB.positions);
                println(currentGeneration + ' -> '+childB.fitness);
                println(childB.positions);
                return
            }
            childs.push(childA);
            childs.push(childB);
        }
        var combined = parents.concat(childs)
        combined.sort(function(a,b) {return (a.fitness < b.fitness) ? 1 : ((b.fitness < a.fitness) ? -1 : 0);} ); 
        combined.splice(p,combined.length-p);
        currentGeneration++;
    }while(currentGeneration<Generation);
    println('No Element Found till Generation ' + currentGeneration);
}
function getMaxFitness(boards){
    var temp = [];
    for(var i=0;i<boards.length;i++){
        temp.push(boards[i].fitness);
    }
    temp.sort();
    println(temp)
    return temp[temp.length-1];
}
function initBoards(length,dimension){
    var boards = [];
    for(var i=0;i<length;i++){
        var temp = new board(generateRandomUniqueArray(dimension));
        boards.push(temp);
    }
    return boards;
}

function moveRightDiagonal(myArray,i){
    for(j=1;((i+j)<myArray.length)&&((myArray[i]+j)<myArray.length);j++){
        if(myArray[i+j]==myArray[i]+j){
            return false;
        }
    }
    return true;
}
function moveLeftDiagonal(myArray,i){
    for(j=1;((i+j)<myArray.length)&&((myArray[i]-j)>=0);j++){
        if(myArray[i+j]==myArray[i]-j){
            return false;
        }
    }
    return true;
}
function println(text){
    $('#terminal').append('<span>'+text+'</span> <br/>');
}
function print(text){
    $('#terminal').append('<span>'+text+'</span>');
}
function checkIfArrayIsUnique(myArray) {
    return myArray.length === new Set(myArray).size;
}
function generateRandomUniqueArray(length){
    var arr = [];
    for(var i=0;i<length;i++){
        do {
            arr[i] = Math.floor((Math.random() * length));
        }
        while(!checkIfArrayIsUnique(arr));
    }
    return arr;
}
function plotArray(myArray){
    for(var i=0;i<myArray.length;i++){
        $('#'+'R'+i+'C'+myArray[i]).css({'background-color':'rgb(255, 0, 0)'});
    }
}
function createBoxes(n){
    $('#graph').empty();
    for(var row=0;row<n;row++){
        var td="";
        for(col=0;col<n;col++){
            td = td + '<td id="' +'R'+row+'C'+ col + '" style="border:1px solid black;height:'+(700/n)+'px;"></td>'
        }
        var tr = '<tr>'+ td +'</tr>'
        $('#graph').append(tr)
    }
}
function swap(x,y){
    var temp = x
    x = y
    y = temp
}