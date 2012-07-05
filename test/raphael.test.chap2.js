moduleOnRaphael('스타일 적용');

testWithBlock('attr로 기본 스타일 적용하기', function (paper, block) {
	// paper와 block이 만들어졌다고 가정하고 파라미터로 받는다.
	// attr()로 엘리먼트의 속성을 제어할 수 있다.
	block.attr({
		'fill': 'yellow', // 채우기
		'stroke': 'green', // 선 색깔
		'stroke-width': 5 // 선 두께
	});
});

testWithBlock('세부적인 선 스타일 적용하기', function (paper, block) {
	block.attr({
		'stroke': 'green',
		'stroke-width': 4,
		'stroke-dasharray': '--.', // 대시 형태 : (- : 대시, . : 공백)
		'stroke-linecap': 'round', // 선끝모양(라인캡) : butt | square || round
		'stroke-linejoin': 'round', // 선연결부분 : bevel | round | miter 
		'stroke-opacity': 0.4 // 투명도 0 ~ 1
	});
});

testWithBlock('리니어 그래디언트 적용하기', function (paper, block) {
	// 리니어 그래디언트 문자 포맷: "‹angle›-‹colour›[-‹colour›[:‹offset›]]*-‹colour›"
	// angle = 그래디언트 각도
	// offset = 각 컬러의 오프셋. % 단위이다.
	block.attr({
		'fill': '90-yellow-green'
	}); // 컬러가 아래부터 채워진 것에 주목한다. -90도 회전된 것이다.
});

testWithBlock('리니어 그래디언트 세부 적용', function (paper, block) {
	block.attr({
		// 노란색의 기준은 전체에서 20%에 위치한다. (퍼센트인 것에 주의한다)
		// 녹색의 기준은 40%에, 파란색의 기준은 60%에 위치한다.
		'fill': '0-yellow:20-green:40-blue:60'
	});
});

testWithBlock('래디얼 그래디언트 적용하기', function (paper, block) {
	// 래디얼 그래디언트 문자 포맷: "r[(‹fx›, ‹fy›)]‹colour›[-‹colour›[:‹offset›]]*-‹colour›"
	// fx, fy = 그래디언트의 포인트를 어디에 둘 것인가?
	block.attr({
		'fill': 'ryellow-green'
	}); // 적용할 수 없다. 래디얼 그래디언트는 '원형 도형'에만 적용가능한 것으로 보인다.
	
	// 원을 만들어서 그래디언트를 적용해본다.
	paper
		.circle(80, 80, 40)
		.attr({
			// 0.25,0.75 부분에 그래디언트의 포커스를 두고,
			// 노랑은 20%, 빨강은 60%로 오프셋을 설정한다.
			'fill': 'r(0.25,0.75)yellow:20-red:60-orange'
		});
});

testWithBlock('기타 스타일 관련 속성 적용하기', function (paper, block) {
	block.attr({
		'fill': '90-yellow-green',
		'cursor': 'pointer', // 커서의 모양을 변경한다.
		'fill-opacity': 0.3, // 테두리는 제외하고 채움의 투명도를 조절한다. 전체 투명도는 'opacity'를 사용한다.
		'title': 'Tetris Block' // 툴팁을 적용한다.
	});
});

testWithBlock('링크 관련 속성 적용하기', function (paper, block) {
	// 엘리먼트에 링크를 할당할 수 있다. 마우스 커서는 자동으로 pointer가 적용된다.
	block.attr({
		'fill': 'orange',
		'href': 'http://raphaeljs.com/',
		'target': '_blank' // [주의] 이 target 속성이 a 태그의 target을 의미하는 것 같지 않다.
							// 실제로 생성되는 a 태그 엘리먼트를 확인해보면 'show'라는 이름의 속성이 추가된다.
	});
});

testWithPaper('마이터리밋 속성 적용하기', function (paper) {
	// 두 개의 꺽인 선을 그린다.
	var pathA = paper.path('M40,40 l80,40 -80,0'),
		pathB = paper.path('M140,40 l80,40 -80,0');
	
	pathA.attr({
		'stroke-width': 10,
		'stroke-miterlimit': 1
	});
	
	pathB.attr({
		'stroke-width': 10,
		'stroke-miterlimit': 5
	});
	
	// pathA와 pathB의 꺽인 부분의 차이를 본다.
});

testWithBlock('글로우 속성 적용하기', function (paper, block) {
	block.glow();
});

testWithBlock('글로우 속성 세부 적용하기', function (paper, block) {
	block.glow({
		'width': 5,
		'fill': true, // 글로우 되는 영역의 속을 채울 것인가?
		'offsetx': 10,
		'offsety': 10,
		'color': 'orange'
	});
});

testWithBlock('글로우 속성 적용 후 엘리먼트 변형', function (paper, block) {
	block.glow();
	block.transform('t30,30');
	// 글로우 대상 엘리먼트를 변형해도 글로우 속성은 따라가지 않는다.
	// 글로우 속성을 표현하기 위해 별도의 엘리먼트를 생성하는 것이기 때문이다.
	// 이 문제는 나중에 테스트할 set()을 통해 해결할 수 있다.
});


moduleOnRaphael('트랜스폼');

testWithBlock('이동하기', function (paper, block) {
	// Path를 그렸던 것과 마찬가지로 변형도 문자열로 설정할 수 있다.
	// T : translate, 마찬가지로 소문자 t는 상대 좌표
	var tstr = 't50,50';
	block.transform(tstr);
});

testWithBlock('회전/비율 변경하기', function (paper, block) {
	// R : rotate, 0~360도 회전한다. 
	// S : scale, 비율을 변경한다. 
	var tstr = 'r60 s0.5,1.2';
	block.transform(tstr);
	
	// 변형의 기준점은 기본값으로 도형의 중심이다.
	// 아래 도형의 중심 라인을 그려서 확인해본다.
	paper.path('M100,0 l0,200');
	paper.path('M0,80 l300,0');
});

testWithBlock('기준점을 잡고 회전/비율 변경하기', function (paper, block) {
	// 추가 옵션으로 기준점을 변경할 수 있다.
	// 0,0을 기준으로 15도 회전하고, 1.2배 확대한다.
	var tstr = 'r15,0,0 s1.2,1.2,0,0';
	block.transform(tstr);
});

testWithBlock('y축으로 뒤집기', function (paper, block) {
	block.scale(1, -1); // y축 스케일을 -1로 준다.
});

testWithBlock('속성으로 변형하기', function (paper, block) {
	block.attr({
		// attr() 메서드로 변형할 수도 있다.
		'transform': 't30,30 r15 s1.5'
	});
});