$(document).ready(function(){
  var tree = d3.layout.tree()//создать дерево
    .size([920,450]);

  var svg = d3.select('#container').append('svg')//создать контейнер
    .attr('width', '960')
    .attr('height', '500');

  var genId = (function () {//генерировать айди
    var i = 0;
    return function () { 
      return i++;
    };
  })();

  var slice = [].slice;//кусок массива

  var speed = 600;//скорость

  function choosePivot (node) {//выбор опорного элемента
    node.pivot = node.arr[0],
    node.pivot_index = 0;
  }

  function tryMerge(node) {//пробуем объединить
    var left = node.left ? undefined : [],
        right = node.right ? undefined : [];
    if(node.left && node.left.sorted) left = slice.call(node.left.arr);//вызвать левый отсортированный массив
    if(node.right && node.right.sorted) right = slice.call(node.right.arr);//вызвать правый отсортированный массив
    if(left && right) { 
      node.arr = left.concat([node.pivot]).concat(right);//объединить левый, опорный и правый массивы
      node.sorted = true;
    } else {
      node.children.forEach(function(child) { step(child); });//иначе создать дочерний узел
    }
  }

  function partition(node) {//разбить узел
    var arr = node.arr,
        pivot = node.pivot,
        i = 1,
        j = 1,
        len = arr.length,
        temp = undefined;
    for(; j < len; j++) {
      if(arr[j] < pivot) {//если значение справа меньше опорного
        if(j > i) {
          temp = arr[j];
          arr[j] = arr[i];//поменять местами с предыдущим
          arr[i] = temp;
        }
        i++;//сделать шаг вправо
      }
    }
    if(i > 1) {//при достижении конца массива
      arr[0] = arr[i - 1];//освободить место для опорного элемента, переместив число в начало массива
      arr[i - 1] = pivot;//записать опорный элемент в освободившееся место
    }
    node.pivot_index = i - 1;//индекс опорного элемента
  }

  function createChildNodes(node) {//создание дочерних узлов
    var arr = node.arr, len = arr.length, i = node.pivot_index;
    if(i > 0) {
      var first_half = arr.slice(0, i);
      var left = qsort_node(first_half);//узел сортировки для левой части
      node.children = [left];
      node.left = left;
    }
    if(i < (len - 1)) {
      var second_half = arr.slice(i+1, len);
      var right = qsort_node(second_half);//узел сортировки для правой части
      if(!node.children) node.children = [];
      node.children.push(right);
      node.right = right;
    }
  }

  function step(node) {//шаг для массива
    var arr = node.arr,//массив
        len = arr.length;//длина массива
    if(node.children) {//если имеются дочерние узлы
      tryMerge(node);//попытаться объединить узел
      return;
    }
    if(len < 2) {//если длина массива<2
      node.sorted = true;//узел отсортирован
      return;
    }
    partition(node);//разбить узел
    createChildNodes(node);//создать дочерние узлы
  }

  function qsort_node(arr) {//узел быстрой сортировки
    var node = {//создание объекта "узел"
      'arr' : arr,
      'id' : genId()
    };
    choosePivot(node);
    return node;
  }
	  
		
		var update = function (root) {//обновление дерева
			var nodes = tree.nodes(root),
					links = tree.links(nodes);
	
			var node = svg.selectAll('.node')
				.data(nodes, function (d) { return d.id; });
	
			node
				.transition()//переход
				.duration(speed - 50)//продолжительность
				.attr('transform', function(d) { return 'translate('+d.x + ',' + (d.y+25) + ')'; });//установка значения атрибута
	
			var group = node.enter().append('g')//добавить узел
				.attr('class', 'node')
				.attr('transform', function(d) { return 'translate('+d.x + ',' + (d.y+25) + ')'; });
	
			node.append('circle')//добавить состояние цикла
				.attr('class', function (d) { return d.sorted ? 'sorted' : 'unsorted' })
				.attr('r', '6px');
	
			node.select('text').remove();//удалить элемент
			var text = node.append('text');
			text.append('tspan')//левая половина
				.text(function(d) {//установка текста 
					var c = d.arr.slice(0,d.pivot_index);
					return c.length ? c+',' : c;
				})
			text.append('tspan')//опорный элемент
				.text(function(d) { return d.pivot; })
				.attr('class', 'pivot');
			text.append('tspan')//правая половина
				.text(function(d) { 
					var c = d.arr.slice(d.pivot_index+1);
					return c.length ? ',' + c : c;
				})
	
			text//текст
				.attr('class', function (d) { return d.sorted ? 'sorted' : 'unsorted' })
				.attr('dx', '8px')
				.attr('dy', '0.36em')
				.style('font-size', '16px');
	
			var link = svg.selectAll('.link').data(links);//добавить данные в элементы
	
			link.transition()//анимация перехода
				.duration(speed - 50)
				.style('stroke-opacity', 1)
				.attr('d', d3.svg.diagonal());
	
			link.enter().append('path')//отрисовка линии
				.attr('class', 'link')
				.attr('transform', function(d) { return 'translate(0,' + 25 + ')'; })
				.attr('d', d3.svg.diagonal())
				.style('stroke-opacity', 1e-6);
		};	
	  
		function flush() {//прилив
		  svg.selectAll('.node').remove();//удалить все элементы
		  svg.selectAll('.link').remove();
		}
	  
		function random_array() {//рандомный массив			
			var arr = document.querySelector('.numbers').innerHTML;//запросить значения для сортировки
			arr = arr.split(' ',10).map(function(i) { return parseInt(i, 10); })//создать массив
		  return arr;
		}
	  
		//инициализация
		var root_node = window.root_node = qsort_node(random_array());//корневой узел присваивает массив для сортировки
		update(root_node);//обновление корневого узла
	  
		var timer;//таймер
	  
		function intervalFn () {//интервал
		  step(root_node);//шаг корневого узла
		  update(root_node);//обновление корневого узла
      if(root_node.sorted)//если корневой узел отсортирован 
      { 
			  clearInterval(timer);//очистить интервал
		  	setTimeout(function() {//установить таймаут
			  }, 100);
		  }
		}
	  
		timer = setInterval(intervalFn, speed);	  
		
    d3.select('#binary').on('click', function() {
      $("#binary").attr('disabled',true);//деактивировать кнопку
      if(timer)clearInterval(timer);
      flush();//прилив
      root_node = qsort_node(random_array());//корневой узел с массивом для сортировки
			timer = setInterval(intervalFn, speed);//запуск таймера с установленным интервалом
		});
});