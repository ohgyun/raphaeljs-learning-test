moduleOnRaphael('이벤트');

testWithBlock('클릭 이벤트 할당하기', function (paper, block) {
	// 엘리먼트를 클릭해 확인한다.
	block.click(function (e) {
		// this는 이벤트가 발생한 엘리먼트를 가리킨다.
		this.animate({
			'fill': getRandomColor()
		}, 500);
	});
});

testWithBlock('드래그 하기', function (paper, block) {
	// 엘리먼트를 드래그해 확인한다.
	var		
		// dx,dy = 드래그가 시작된 지점으로부터의 거리
		// x,y = 마우스 포지션
		onmoveHandler = function (dx, dy, x, y, event) {
			log('dragging...');
			
			this.translate(dx - movedX, dy - movedY);
			movedX = dx; movedY = dy;
			// 이 코드엔 버그가 좀 있지만, 이런 식으로 드래깅을 구현할 수 있다.
		},
		
		// x,y = 마우스 포지션
		onstartHandler = function (x, y, event) {
			log('drag started');
		},
		
		onendHandler = function (event) {
			log('drag ended');
		},
		
		movedX = 0, movedY = 0;
		
	// 파라미터로는 onmove, onstart, onend 핸들러가 순서대로 들어간다.
	block.drag(onmoveHandler, onstartHandler, onendHandler);
});

testWithBlock('hover 이벤트 할당하기', function (paper, block) {
	var
		hoverInHandler = function () {
			this.attr({
				'fill': 'orange'
			});
		},
		hoverOutHandler = function () {
			this.attr({
				'fill': 'white'
			});
		};
	
	// hover()의 파라미터로 hoverIn과 hoverOut 핸들러를 넘겨준다.
	block.hover(hoverInHandler, hoverOutHandler);
});


moduleOnRaphael('그룹');

testWithBlock('세트로 묶기', function (paper, block) {
	var circle = paper.circle(40, 40, 20); // 테스트할 원을 하나 생성하고,
	var set = paper.set(); // 셋을 생성한다.
	
	set.push(block, circle); // 셋에 블럭과 원을 추가한다.
	
	set.attr({
		'fill': 'red'
	});
	// set을 생성한다고 해서 대상을 래핑하기 위한 엘리먼트를 만드는 것은 아니다.
	// 단지, 대상 엘리먼트를 담고 있는 배열일 뿐이다.
	// jquery에서 $가 작동하는 방식을 떠올리면 이해하기 쉬울 듯 하다.
});

testWithBlock('세트로 묶는 다른 방법', function (paper, block) {
	paper.setStart(); // 셋을 시작하고,
	
	// 세트에 포함할 대상을 생성한다.
	paper.circle(70,120,15).attr({ 'fill': '90-#000-#fff' });
	paper.circle(130,120,15).attr({ 'fill': '90-#000-#fff' });;
	
	var set = paper.setFinish(); // 다음, 셋을 종료해 묶을 수 있다.
	
	set.animate({
		transform: 'R3600'
	}, 2000);
});

testWithBlock('세트에서 반복문 돌리기', function (paper, block) {
	var set = paper.set();
	
	set.push(block, paper.circle(70,120,15));
	
	// 콜백의 파라미터로는 대상 엘리먼트와 인덱스가 넘어온다.
	set.forEach(function (obj, idx) {
		equal(this, window, '여기서의 this는 window를 가리킨다');
	});
	
	var mockContext = {};
	set.forEach(function (obj, idx) {
		equal(this, mockContext, '두번째 파라미터로 콜백의 컨텍스트를 넘길 수 있다');
	}, mockContext);
});


moduleOnRaphael('그 외 유용한 기능');

testWithPaper('템플릿 기능 fullfill', function (paper) {
	var pathString = Raphael.fullfill('M{x},{y} h{dim.h} v{dim.v}', {
		'x': 40,
		'y': 60,
		'dim': {
			'h': 80,
			'v': 120
		}
	}); // fullfill()을 템플릿처럼 활용할 수 있다.
	paper.path(pathString);
});

testWithPaper('템플릿 기능 format', function (paper) {
	var pathString = Raphael.format('M{0},{1} h{2} v{3}', 40, 60, 80, 120);
	// 간단한 경우라면 format을 사용해도 좋다.
	paper.path(pathString);
});

testWithPaper('커스텀 이벤트 정의하기', function (paper) {
	// eve.on()으로 커스텀 이벤트를 할당한다. 이벤트 명은 . 또는 / 로 구분할 수 있다.
	// pubsub 라이브러리로 생각하면 될 듯.
	eve.on('fruit.apple', function () {
		log('fruit.apple');
	});
	eve.on('fruit.banana', function () {
		log('fruit.banana');
	});
	eve.on('fruit.*', function () { // 와일드카드를 사용할 수도 있다.
		log('fruit.*');
	});
	
	// eve()로 해당 이벤트를 호출할 수 있다.
	eve('fruit.apple');
});

testWithBlock('커스텀 속성 생성하기', function (paper, block) {
	// ca(custom attribute) 속성에 공통 속성 메서드를 생성한다.
	paper.ca.fillAndBorder = function (color) {
		// 테두리와 바탕을 모두 채우는 속성을 만들어본다.
		return {
			'fill': color,
			'stroke': color
		};
	};
	
	block.attr({
		'fillAndBorder': 'red'
	});
});

testWithBlock('엘리먼트 공통 메서드 생성하기', function (paper, block) {
	// Raphael.el의 속성에 추가해, 엘리먼트의 공통 메서드를 생성한다.
	Raphael.el.red = function () {
		this.attr({ 'fill': 'red' });
	};
	
	block.red();
});

testWithBlock('세트 공통 메서드 생성하기', function (paper, block) {
	// 마찬가지로 Raphael.st의 속성으로 추가해, 세트의 공통 메서드를 생성할 수 있다.
	Raphael.st.red = function () {
		this.forEach(function (el) {
			el.attr({ 'fill': 'red' });
		});
	};
	
	var set = paper.set();
	set.push(block, paper.circle(80,80,20), paper.circle(120,120,20));
	
	set.red();
});

testWithBlock('바운딩 박스 활용하기', function (paper, block) {
	// 패스를 감싸고 있는 사각형 형태의 박스를 가져온다.
	// box는 x, y, x2, y2, width, height을 가진 객체이다.
	var box = block.getBBox();
	
	// 바운딩 박스 정보는 아래와 같이 활용할 수 있다.
	paper.rect(box.x, box.y, box.width, box.height)
			.attr({
				'stroke': 'orange',
				'stroke-width': 2,
				'stroke-dasharray': '-',
				'stroke-opacity': 0.4
			});
});