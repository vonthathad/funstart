var GridNumber = function(obj){
    this.row = obj.row || null;
    this.col = obj.col || null;
    this.arr = [];
    this.arrShuffle = [];
    this.clickedNumbers;
    this.max;
    this.numbers;
    this.canClick;
}

GridNumber.prototype.createArray = function () {
    var max = this.col * this.row;
    for(var i = 1; i <= max; i ++){
        this.arr.push(i);
    }
};
GridNumber.prototype.start = function(){
    var self = this;
    self.clickedNumbers = [];
    self.max = 1;
    self.numbers = [];
    self.canClick = true;
    self.score = 0;
    self.arrShuffle = self.arr.shuffle();
    console.log(this.arr);
    for(var i = 0; i < self.row; i++){
        $('.fs-game-section').append('<div class="row'+i+'" flex layout="row"></div>');
        for(var j = 0; j < self.col; j++){
            var number = self.arrShuffle.pop();
            $('.row'+i).append('<div flex class="box" id="box'+number+'" value="'+number+'" layout="column" layout-align="center center"><div><div>'+number+'</div></div></div>');
        }
    }
    $('.box').click(function(){
        console.log($(this).attr('id'));
        if(self.canClick && $(this).attr('value') == self.max){
            self.numbers.push(parseInt($(this).attr('value')));
            self.score += 50;
            fsGame.updateObj({numbers: self.numbers, score: self.score});
            self.canClick = false;
        };

    })
}
var gridNumber = new GridNumber({row: 10,col: 10});
gridNumber.createArray();
fsGame.fetchPlayers(function(data){
    console.log(data);
    if(gridNumber && gridNumber.clickedNumbers){
        gridNumber.clickedNumbers = [];
        for( var e in data){
            console.log(e);
            gridNumber.clickedNumbers = gridNumber.clickedNumbers.concat(data[e].numbers);
        };
        gridNumber.clickedNumbers.sort(function(a, b){return b-a});
        gridNumber.max = gridNumber.clickedNumbers[0] + 1 || 1;
        gridNumber.canClick = true;
        console.log('max',gridNumber.max);
        $('.box').removeClass('active');
        $('.box').removeClass('me');
        console.log(gridNumber.clickedNumbers);
        gridNumber.clickedNumbers.forEach(function(e){
            $('#box'+e).addClass('active');
        });
        gridNumber.numbers.forEach(function(e){
            $('#box'+e).addClass('me');
        })
    }
});
fsGame.gameStart(function(){
    gridNumber.start();
});
