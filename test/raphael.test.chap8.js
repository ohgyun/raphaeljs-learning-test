moduleOnRaphael('성능개선');

testWithPaper('여러 개의 막대를 그리는 일반적인 방법', function (paper) {
	var x = 0,
		y = 20,
		yInterval = 20,
		w = 0,
		h = 10,
		attr = {'fill': 'green', 'stroke': 'none'};
	
	for (var i = 0; i < 8; i++) {
		w = rand();
		paper.rect(x, y, w, h).attr(attr); // 사각형으로 그린다.
		y += yInterval;
	}
	
	// 일반적인 방법, 각 막대가 하나의 엘리먼트이다.
	// 각 막대의 컬러를 별도로 줄 수 있고, 테두리도 자유롭게 선택할 수 있다.
	// 하지만, 막대의 개수가 많아지면 성능이 떨어질 수 있다.
});

function rand() {
	return parseInt(Math.random() * (1<<30)) % 300;
}

testWithPaper('하나의 선으로 여러 개의 막대 그리기', function (paper) {
	var x = 0,
		y = 20,
		yInterval = 20,
		w = 0,
		h = 10,
		attr = {'fill': 'green', 'stroke': 'none'},
		aPath = [];
	
	for (var i = 0; i < 8; i++) {
		w = rand();
		aPath.push([
			'M', x, y,
			'h', w,
			'v', h,
			'h', -w,
			'z'
		].join()); // 각 좌표를 패스 문자열로 저장한다.
		
		y += yInterval;
	}
	
	paper.path(aPath.join()).attr(attr);
	
	// 여러 막대를 하나의 엘리먼트로 구현할 수 있다.
	// 단, 각 막대가 같은 컬러와 테두리를 가져야 한다는 한계가 있다.
	// 네이버 애널리틱스에서는 한 막대에 여러 데이터를 표현하는 누적형 막대 차트에 이 방법을 활용했다.
});

testWithPaper('패스로 여러 개의 원 그리기', function (paper) {
	var data = [];
	for (var i = 0; i < 10; i++) { data.push(rand()); }
	
	var x = 0,
		y = 10,
		yInterval = 20,
		w = 0,
		h = 10,
		r = 3,
		attr = {
			'stroke': 'green',
			'stroke-width': 3
		};
	
	var pathString = [];
	for (var i = 0; i < data.length; i++) {
		x = data[i];
		pathString.push(getCirclePath(x, y, r));
			// 이전 테스트에서 만든 원의 패스를 가져오는 함수를 사용한다.
		y += yInterval;
	}
	
	paper.path(pathString.join()).attr(attr);
});

function getCirclePath(x, y, r) {
	return [
		'M', x, y-r,
		'A', r, r, 0, 1, 1, x, y+r,
		'A', r, r, 0, 1, 1, x, y-r,
		'z'
	].join(); // 반호를 두 번 그려 완성한다.
}

testWithPaper('패스 하나로 그린 사각형의 각 영역에 이벤트 할당하기', function (paper) {
	var wholePath = []; // 패스를 저장할 배열
	var pathInfo = []; // 각 패스 영역의 데이터를 저장할 배열
	
	// 하나의 패스로 4개의 박스를 그린다.
	for (var i = 0; i < 4; i++) {
		var pathString = ['M', i*50, 20, 'h', 30, 'v', 40, 'h', -30, 'z'].join();
		wholePath.push(pathString);
		
		// pathBBox()로 방금 정의한 패스의 영역을 저장해둔다. 
		var pathBBox = Raphael.pathBBox(pathString);
		pathBBox.thisBoxName = i + '번 박스'; // 추가 데이터를 정의하고,
		pathInfo.push(pathBBox); // 저장한다.
	}
	
	// 패스를 그리고, 이벤트를 할당한다.
	var path = paper.path(wholePath.join());
	path.attr({
		'fill': 'orange'
	});
	path.click(function (e) {
		var x = Raphael.vml ? e.x : e.offsetX;
		var y = Raphael.vml ? e.y : e.offsetY;
		// 이벤트가 발생한 상대좌표를 알아올 때, x,y 또는 offsetX,offsetY를 사용한다.
		// IE8이하일 경우 x,y를, 이외 브라우저일 경우, offsetX,offsetY를 사용한다. 
		
		findWhichBoxClicked(x, y);
	});
	
	// 이벤트 핸들러
	function findWhichBoxClicked(x, y) {
		for (var i = 0; i < pathInfo.length; i++) { // 패스영역을 정의한 배열을 반복한다.
			var bbox = pathInfo[i];
			if (Raphael.isPointInsideBBox(bbox, x, y)) {
				console.log(bbox.thisBoxName + '를 클릭했습니다.');
				break;
			}
		}
	}
	
	// 정리하면 다음과 같다.
	// 1. 패스를 정의할 때 미리 분리된 영역을 저장해둔다. Raphael.pathBBox();
	// 2. 이벤트가 발생했을 때, IE8이하는 x,y로, 이외 브라우저는 offsetX, offsetY 정보로 찾는다.
	// 3. 저장해둔 정보를 반복하면서, isPoinstInsideBBox()로 이벤트 좌표에 해당하는 데이터를 찾는다.
	// 4. 찾았다면 액션~!
});

testWithPaper('패스 하나로 그린 원의 각 영역에 이벤트 할당하기', function (paper) {
	var wholePath = [];
	var pathInfo = [];
	
	// 하나의 패스로 4개의 원을 그린다.
	for (var i = 1; i <= 4; i++) {
		var pathString = getCirclePath(i*40, 20, 10);
		wholePath.push(pathString);
		
		var info = {
			pathString: pathString,
			circleName: i + '번 원'
		}; // 데이터에 패스 문자열과 추가 정보를 넣는다.
		pathInfo.push(info);
	}
	
	var path = paper.path(wholePath.join())
			.attr({
				'fill': 'orange'
			})
			.click(function (e) {
				var x = Raphael.vml ? e.x : e.offsetX;
				var y = Raphael.vml ? e.y : e.offsetY;
				findWhichCircleClicked(x, y);
			});
	
	function findWhichCircleClicked(x, y) {
		for (var i = 0; i < pathInfo.length; i++) {
			var pstr = pathInfo[i].pathString; // 패스 스트링을 바로 사용해
			if (Raphael.isPointInsidePath(pstr, x, y)) { // isPointInsidePath()로 검증한다.
				console.log(pathInfo[i].circleName + '을 클릭했습니다.');
				break;
			}
		}
	}
	
	// 정리하면 다음과 같다.
	// 1. 원이나 형태를 알 수 없는 패스일 경우, 패스 문자열을 바로 저장했다가 isPointInsidePath()로 검증한다.
	// 2. isPointInsidePath()는 내부적으로 pathBBox()를 사용하고, 한 번 생성한 bbox 정보는 캐시해 재사용한다.
	//    성능에 대한 우려는 하지 않아도 되겠다.
	//    @see https://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.core.js#L1545
});

testWithPaper('별첨: isPointInsideBBox()와 isPointInsidePath()의 미묘한 차이', function (paper) {
	var pathStr = 'M50.5,50.5, h99, v99, h-99, z';
	var path = paper.path(pathStr).attr({
		'stroke-width': 1,
		'fill': 'orange'
	}); // (50,50) (100,100)을 채우는 1px 테두리가 있는 사각형을 그린다.

	// inPoinstInsideBBox로 체크 
	var xOnBorder = 50.5,
		yOnBorder = 50.5; // 테두리 위에 있는 x,y 좌표
	
	var bbox = path.getBBox();
	equal(Raphael.isPointInsideBBox(bbox, xOnBorder, yOnBorder), true);
	// isPointInsideBBox에서는 테두리가 시작하는 경계점에 있어도 true를 리턴한다.
	
	equal(Raphael.isPointInsidePath(pathStr, xOnBorder, yOnBorder), false);
	// 주의! 하지만, isPointInsidePath에서는 테두리 위의 값은 false를 리턴한다. 
});

