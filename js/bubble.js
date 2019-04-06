$(document).ready(function(){
	var minNum,maxNum,random_num,i,change_obj,num1,num2,step,obj1,obj2,intervalID,timeoutID;
	var num_array = new Array(); //массив для сортировки

	//Генерация чисел
	$('#random').click(function(){
		$('#nums, span').html('');
		$('#bubble,#binary').removeAttr('disabled').show();//активировать кнопки сортировки
		$('#nums,#container').css("display", "none");//скрыть область визуализации сортировок
		
		clearTimeout(timeoutID);//отмена таймера
		clearInterval(intervalID);//отмена интервала
		
		for (i = 0; i < 10; i++) {
			minNum = 0; //минимальное число 
			maxNum = 100;  //максимальное число
			randomNum = Math.round((Math.random() * (maxNum - minNum) + minNum)); //рандомное число
			$('.numbers').append(randomNum + ' ');//вывод рандомного числа
			num_array[i] = randomNum;
			$('#nums').append('<div class="num">' + randomNum + '</div>'); //визуализация массива
		}
	});

	//Сортировка
	$('#bubble').click(function(){		
		$("#bubble").attr('disabled',true);//отключить кнопку
		step = 1;

		function bubble() {	
			if( step < 11 ){
				step++;
				i = 1;
				(function() {
					if (i < 11) { 
						if( num_array[i] < num_array[i-1] ){
							num1 = i;//индекс текущего элемента массива
							num2 = i-1;//индекс предыдущего элемента массива
							obj1 = $('#nums .num:eq('+num1+')');//выборка текущего числа
							obj2 = $('#nums .num:eq('+num2+')');//выборка предыдущего числа	
							obj1.swap(obj2);//визуализация сортировки массива
							change_obj = num_array[i];
							num_array[i] = num_array[i-1];
							num_array[i-1] = change_obj;							
							timeoutID = setTimeout(arguments.callee, 1000); 
						}
						else{
							timeoutID = setTimeout(arguments.callee, 0);
						}
						i++;	
					}
					else{ 
						clearInterval(intervalID);
						bubble();
						intervalID = setInterval(bubble, 10000);
					}
				})();
			}
			else{
				clearTimeout(timeoutID);
				clearInterval(intervalID);
			}
		}
		bubble();
	});
});


