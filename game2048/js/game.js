//1.定义一个游戏对象，来保存游戏中的属性和方法
var game = {
	data:[],//数组来保存游戏数据
	score:0,//游戏分数
	status:1,//游戏状态，若为1时表示游戏正在进行，0时表示游戏结束
	//2.游戏开始
	start:function(){
		this.score = 0;
		this.status = 1;
		//将二维数组data数组元素设置为0
		for(var r = 0; r < 4; r++){
			this.data[r] = [];//初始化每一行
			for(var c = 0; c < 4; c++){
				this.data[r][c] = 0;//初始化每一个单元格
			}
		}
		//随机生成2或4
		this.randomNum();
		this.randomNum();
		this.dataView();
		console.log(this.data);
	},
	//3.定义一个随机生成2或4的方法
	randomNum:function(){
		//随机一个行和列[0,1,2,3]
		while(true){
			var r = Math.floor(Math.random()*4);
			var c = Math.floor(Math.random()*4);
			if(this.data[r][c] == 0){
				this.data[r][c] = Math.random()>0.5?2:4;//随机产生2或4中的一个数
				break;
			}
		}
	},
	//4.视图更新
	dataView:function(){
		//遍历二维数组
		for(var r = 0; r < 4; r++){
			for(var c = 0; c < 4; c++){
				if(this.data[r][c] == 0){
					document.getElementById("cell"+r+c).innerHTML = "";
					document.getElementById("cell"+r+c).className = "cell"
				}else{
					document.getElementById("cell"+r+c).innerHTML = this.data[r][c];
					document.getElementById("cell"+r+c).className = "cell n"+this.data[r][c];
				}
			}
		}
		//显示分数
		document.getElementById("score01").innerHTML = this.score;
		//显示分数
		document.getElementById("score01").innerHTML = this.score;
		//根据游戏状态来更新视图
		if(this.status == 0){
			//游戏结束，显示游戏结束界面 ，并设置分数
			document.getElementById("gameover").style.display = "block";
			document.getElementById("score02").innerHTML = this.score;
		}else{
			//游戏进行中，游戏结束界面隐藏
			document.getElementById("gameover").style.display = "none";
		}
	},
	isGameOver: function(){
		for(var r = 0; r < 4; r++){
			for(var c = 0; c < 4; c++){
				//1.若有一个为0，表示游戏没有结束
				if(this.data[r][c] == 0){
					return false;
				}
				//2.检查右边相邻的数字，有与自身相等的
				if(c < 3){
					if(this.data[r][c] == this.data[r][c+1]){
						return false;
					}
				}
				//3.检查下边相邻的数字，有与自身相等的
				if(r < 3){
					if(this.data[r][c] == this.data[r+1][c]){
						return false;
					}
				}
			}
		}
		//若游戏结束，返回true
		return true;
	},
	//向左
	moveLeftRight:function(num){
		//看移动前和移动后的数组是否改变，若改变了更新视图
		var before = String(this.data);
		//1.遍历行
		for(var r = 0; r < 4; r++){
			//实现每行具体的操作逻辑
			if(num == 37){
				this.moveLeftRow(r);
			}else if(num == 39){
				this.moveRightRow(r);
			}
		
		}
		var after = String(this.data);
		if(before != after){
			//生成一个随机数
			this.randomNum();
			//判断游戏是否结束
			if(this.isGameOver()){
				//将游戏状态设置为0，0时表示游戏结束
				this.status = 0;
			}
			//更新视图
			this.dataView();
		}
	},
	moveLeftRow:function(r){
		//从最左边的列开始遍历，遍历到倒数第二个（最大索引-1）
		for(var c = 0; c < 3; c++){
			//找到下一个不为0的索引
			var nextCell = this.getNextinRow(r, c);
			if(nextCell != -1){
				if(this.data[r][c] == 0){//最左边的值为0
					this.data[r][c] = this.data[r][nextCell];
					this.data[r][nextCell] = 0;
					c--;//回到上一个索引
				}else if(this.data[r][c] == this.data[r][nextCell]){//最左边的值为不为0的值相等时
					this.data[r][c] *= 2;
					this.data[r][nextCell] = 0;
					this.score += this.data[r][c];//累加分数
				}
			}else{
				break;
			}
		}
	},
	getNextinRow:function(r, c){
		for(var i = c+1; i < 4; i++){
			//找到不为0的索引，并且将索引值返回出去
			if(this.data[r][i] != 0){
				return i;
			}
		}
		return -1;
	},
	moveRightRow:function(r){//右移第r行
		for(var c = 3; c > 0; c--){
			var prevc = this.getPrevinRow(r, c);
			if(prevc != -1){
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[r][prevc];
					this.data[r][prevc] = 0;
					c++;
				}else if(this.data[r][c] == this.data[r][prevc]){
					this.data[r][c] *= 2;
					this.data[r][prevc] = 0;
					this.score += this.data[r][c];//更新分数
				}
			}else{
				break;
			}
		}
		
	},
	getPrevinRow:function(r, c){
		for(var i = c-1; i >= 0; i--){
			if(this.data[r][i] != 0){
				return i;
			}
		}
		return -1;
	},
	//向上
	moveUpDown:function(num){
		var before = String(this.data);//移动前数组拍照
		for(var c = 0; c < 4; c++){
			if(num == 38){
				this.moveUpCell(c);
			}else if(num == 40){
				this.moveDownCell(c);
			}
		
		}
		var after = String(this.data);//移动后数组拍照
		if(before != after){
			this.randomNum();
			//判断游戏是否结束
			if(this.isGameOver()){
				//将游戏状态设置为0，0时表示游戏结束
				this.status = 0;
			}
			this.dataView();
		}
	},
	moveUpCell: function(c){//上移第c列
		for(var r = 0; r < 3; r++){
			var nextr = this.getNextinCell(r, c);
			if(nextr != -1){
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c] = 0;
					r--;
				}else if(this.data[r][c] == this.data[nextr][c]){
					this.data[r][c] *= 2;
					this.data[nextr][c] = 0;
					this.score += this.data[r][c];//更新分数
				}
			}else{
				break;
			}
		}
		
	},
	getNextinCell: function(r, c){
		for(var i = r+1; i < 4; i++){
			if(this.data[i][c] != 0){
				return i;
			}
		}
		return -1;
	},
	moveDownCell: function(c){//下移第c列
		for(var r = 3; r > 0; r--){
			var prevr = this.getPrevinCell(r, c);
			if(prevr != -1){
				if(this.data[r][c] == 0){
					this.data[r][c] = this.data[prevr][c];
					this.data[prevr][c] = 0;
					r++;
				}else if(this.data[r][c] == this.data[prevr][c]){
					this.data[r][c] *= 2;
					this.data[prevr][c] = 0;
					this.score += this.data[r][c];//更新分数
				}
			}else{
				break;
			}
		}
		
	},
	getPrevinCell: function(r, c){
		for(var i = r-1; i >= 0; i--){
			if(this.data[i][c] != 0){
				return i;
			}
		}
		return -1;
	}
}
game.start();
//获取键盘事件
document.onkeydown = function(event){
	var event  = event || arguments[0] || e;
	//console.log(event.keyCode);
	if(event.keyCode == 37){
		//向左
		game.moveLeftRight(37);
	}
	if(event.keyCode == 39){
		//向右
		game.moveLeftRight(39);
	}
	if(event.keyCode == 38){
		//向上
		game.moveUpDown(38);
	}
	if(event.keyCode == 40){
		//向下
		game.moveUpDown(40);
	}
}